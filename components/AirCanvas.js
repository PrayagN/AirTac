"use client";

import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Peer from 'peerjs';
import styles from './AirCanvas.module.css';

export default function AirCanvas() {
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  // Game State
  const [myRole, setMyRole] = useState('X');
  const [currentTurn, setCurrentTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  const [eraseRequest, setEraseRequest] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const peerRef = useRef(null);
  const dataConnRef = useRef(null);
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');

  const linesRef = useRef([]);
  const remoteLinesRef = useRef([]);
  const boardRef = useRef(Array(9).fill(null));

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // Invite & Player Info States
  const [localName, setLocalName] = useState('');
  const [remoteName, setRemoteName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState(null);

  const localNameRef = useRef('');
  useEffect(() => { localNameRef.current = localName; }, [localName]);
  
  const joinRoomIdRef = useRef(null);

  useEffect(() => {
     if (typeof window !== 'undefined') {
         const urlParams = new URLSearchParams(window.location.search);
         const room = urlParams.get('room');
         if (room) {
             setJoinRoomId(room);
             joinRoomIdRef.current = room;
             setRemotePeerId(room);
         }
     }
  }, []);

  const isPinchingRef = useRef(false);
  const needsSyncRef = useRef(false);
  const erasePendingRef = useRef(false);

  // Ref mirrors for animation loop closure
  const showGridRef = useRef(showGrid);
  useEffect(() => { showGridRef.current = showGrid; }, [showGrid]);
  const roleRef = useRef(myRole);
  useEffect(() => { roleRef.current = myRole; }, [myRole]);
  const turnRef = useRef(currentTurn);
  useEffect(() => { turnRef.current = currentTurn; }, [currentTurn]);
  const winnerRef = useRef(winner);

  const checkWinnerLocal = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        if (winnerRef.current !== board[a]) {
          setWinner(board[a]);
          winnerRef.current = board[a];
        }
        return;
      }
    }
    if (!board.includes(null)) {
      if (winnerRef.current !== 'DRAW') {
        setWinner('DRAW');
        winnerRef.current = 'DRAW';
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => { setToastMessage(''); }, 3500);
  };

  useEffect(() => {
    let handLandmarker;
    let animationFrameId;
    let smoothedPx = 0, smoothedPy = 0;
    let cursorAngle = 0;
    let eraserPulse = 0;

    window.__START_AIR_CANVAS__ = async () => {
      try {
        // 0. Explicit check for HTTP insecure context wipeout
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error("SECURE_CONTEXT_ERROR");
        }

        // 1. Immediately request camera so browser ties it precisely to the user's click interaction
        let stream;
        try {
            // Attempt 1: Full ideal resolution and audio
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, 
                audio: true 
            });
        } catch (e1) {
            console.warn("Attempt 1 (A+V) failed, trying Video only...", e1);
            try {
                // Attempt 2: Strict Audio blocks (iOS Microphone limits) cause NotAllowedError. Try Video only!
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, 
                    audio: false 
                });
                setIsAudioOn(false); // Notify state that audio is permanently disabled
            } catch (e2) {
                console.warn("Attempt 2 (Ideal Video) failed, trying Barebones Video...", e2);
                // Attempt 3: Strict constraints might still trigger OverconstrainedError. Try barebones!
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                setIsAudioOn(false);
            }
        }
        
        // 2. Camera succeeded! Now fetch AI models safely
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "CPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.7,
          minHandPresenceConfidence: 0.7,
          minTrackingConfidence: 0.7
        });
        
        // 3. Complete media flow binding
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
          setIsLoaded(true);
          initializePeer(stream);
        }
      } catch (err) {
        console.error("Init Error:", err);
        if (err.message === "SECURE_CONTEXT_ERROR") {
            setLoadError("BROWSER BLOCKED CAMERA: You are using an insecure HTTP Wi-Fi connection. The browser prevents Camera access! Please enable 'Insecure origins' in chrome://flags as discussed, or use an HTTPS Tunnel.");
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setLoadError("PERMISSION DENIED: Browser blocked access. Please manually grant tracking permissions securely via the Address Bar!");
        } else {
            setLoadError("SYSTEM ERROR: Failed to load AI arrays or assign web elements. " + err.message);
        }
      }
    };

    const initializePeer = (localStream) => {
      const peer = new Peer();
      peerRef.current = peer;
      peer.on('open', (id) => {
          setPeerId(id);
          if (joinRoomIdRef.current) {
              setTimeout(() => {
                  connectToPeerId(joinRoomIdRef.current, localStream);
              }, 500);
          }
      });
      peer.on('call', (call) => {
        call.answer(localStream);
        setupCallResponses(call);
      });
      peer.on('connection', (conn) => setupDataConnection(conn));
    };

    let lastVideoTime = -1;
    const predictWebcam = () => {
      if (!videoRef.current || !canvasRef.current || !handLandmarker) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Responsive Game Grid Physical Constraints (Adapts to Mobile Portrait or Desktop Landscape)
      const GRID_SIZE = Math.min(canvas.width, canvas.height) * 0.8;
      const gridX = (canvas.width - GRID_SIZE) / 2;
      const gridY = (canvas.height - GRID_SIZE) / 2;
      const cellW = GRID_SIZE / 3;

      const getCellIndex = (x, y) => {
        if (x >= gridX && x <= gridX + GRID_SIZE && y >= gridY && y <= gridY + GRID_SIZE) {
          const col = Math.floor((x - gridX) / cellW);
          const row = Math.floor((y - gridY) / cellW);
          return row * 3 + col;
        }
        return -1;
      };

      const getDist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

      let startTimeMs = performance.now();

      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        const results = handLandmarker.detectForVideo(video, startTimeMs);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the Board Logic directly on Canvas!
        if (showGridRef.current) {
          ctx.strokeStyle = 'rgba(0, 255, 204, 0.3)';
          ctx.lineWidth = 10;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#0ff';

          ctx.beginPath();
          ctx.moveTo(gridX + cellW, gridY); ctx.lineTo(gridX + cellW, gridY + GRID_SIZE);
          ctx.moveTo(gridX + cellW * 2, gridY); ctx.lineTo(gridX + cellW * 2, gridY + GRID_SIZE);
          ctx.moveTo(gridX, gridY + cellW); ctx.lineTo(gridX + GRID_SIZE, gridY + cellW);
          ctx.moveTo(gridX, gridY + cellW * 2); ctx.lineTo(gridX + GRID_SIZE, gridY + cellW * 2);
          ctx.stroke();

          ctx.shadowBlur = 0;

          // Draw locked Game Pieces
          for (let i = 0; i < 9; i++) {
            const p = boardRef.current[i];
            if (p) {
              const col = i % 3; const row = Math.floor(i / 3);
              const cx = gridX + col * cellW + cellW / 2;
              const cy = gridY + row * cellW + cellW / 2;
              const r = cellW * 0.35;

              ctx.strokeStyle = p === 'X' ? '#39ff14' : '#f0f';
              ctx.lineWidth = 15;

              if (p === 'O') {
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
              } else if (p === 'X') {
                ctx.beginPath();
                ctx.moveTo(cx - r, cy - r); ctx.lineTo(cx + r, cy + r);
                ctx.moveTo(cx + r, cy - r); ctx.lineTo(cx - r, cy + r);
                ctx.stroke();
              }
            }
          }
        }

        // Render Free-form lines natively in 2D
        drawLines(ctx, linesRef.current, false);
        drawLines(ctx, remoteLinesRef.current, true);

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          const wrist = landmarks[0];
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];

          const distance = getDist(thumbTip, indexTip);
          const isPinching = distance < (isPinchingRef.current ? 0.065 : 0.04);

          const isIndexExt = getDist(landmarks[8], wrist) > getDist(landmarks[6], wrist);
          const isMiddleExt = getDist(landmarks[12], wrist) > getDist(landmarks[10], wrist);
          const isRingExt = getDist(landmarks[16], wrist) > getDist(landmarks[14], wrist);
          const isPinkyExt = getDist(landmarks[20], wrist) > getDist(landmarks[18], wrist);
          const isThumbExt = getDist(landmarks[4], landmarks[5]) > 0.1;

          const isOpenHand = isIndexExt && isMiddleExt && isRingExt && isPinkyExt && isThumbExt && !isPinching;

          const targetPx = indexTip.x * canvas.width;
          const targetPy = indexTip.y * canvas.height;

          const alpha = 0.5;
          smoothedPx = smoothedPx === 0 ? targetPx : smoothedPx * (1 - alpha) + targetPx * alpha;
          smoothedPy = smoothedPy === 0 ? targetPy : smoothedPy * (1 - alpha) + targetPy * alpha;

          const ex = landmarks[9].x * canvas.width;
          const ey = landmarks[9].y * canvas.height;

          // ERASER LOGIC 
          if (isOpenHand) {
            const eraserRadius = canvas.width * 0.08;
            eraserPulse += 0.15;
            const pulseR = eraserRadius + Math.sin(eraserPulse) * 15;

            ctx.save();
            ctx.translate(ex, ey);
            ctx.beginPath();
            ctx.arc(0, 0, eraserRadius * 0.4, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255, 0, 255, 0.4)';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#f0f';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, pulseR, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
            ctx.lineWidth = 3;
            ctx.setLineDash([20, 15]);
            ctx.rotate(eraserPulse * 0.2);
            ctx.stroke();
            ctx.restore();

            const newLines = [];
            let somethingErased = false;

            for (let i = 0; i < linesRef.current.length; i++) {
              const line = linesRef.current[i];
              let currentSegment = [];
              for (let j = 0; j < line.points.length; j++) {
                const pt = line.points[j];
                const distToEraser = Math.hypot(pt.x - ex, pt.y - ey);
                if (distToEraser > eraserRadius) {
                  currentSegment.push(pt);
                } else {
                  if (currentSegment.length > 0) {
                    newLines.push({ color: line.color, points: currentSegment });
                    currentSegment = [];
                  }
                  somethingErased = true;
                }
              }
              if (currentSegment.length > 0) newLines.push({ color: line.color, points: currentSegment });
            }

            if (somethingErased) {
              linesRef.current = newLines.filter(l => l.points.length > 1);
              needsSyncRef.current = true;
            }

            // Remote hit check
            let remoteHit = false;
            for (let i = 0; i < remoteLinesRef.current.length; i++) {
              const line = remoteLinesRef.current[i];
              for (let j = 0; j < line.points.length; j++) {
                if (Math.hypot(line.points[j].x - ex, line.points[j].y - ey) < eraserRadius) {
                  remoteHit = true; break;
                }
              }
              if (remoteHit) break;
            }

            if (remoteHit && !erasePendingRef.current) {
              if (dataConnRef.current && dataConnRef.current.open) {
                dataConnRef.current.send({ type: 'ERASE_REQUEST' });
                erasePendingRef.current = true;
                setTimeout(() => { erasePendingRef.current = false; }, 4000);
              }
            }

            isPinchingRef.current = false;

          } else {
            // CURSOR TRACKER
            cursorAngle += 0.08;
            const size = isPinching ? 18 : 28;

            ctx.save();
            ctx.translate(smoothedPx, smoothedPy);
            ctx.rotate(cursorAngle);
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.strokeStyle = isPinching ? '#39ff14' : '#0ff';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = isPinching ? '#39ff14' : '#0ff';
            if (!isPinching) ctx.setLineDash([12, 8]);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-size * 0.6, 0); ctx.lineTo(size * 0.6, 0);
            ctx.moveTo(0, -size * 0.6); ctx.lineTo(0, size * 0.6);
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            ctx.stroke();
            ctx.restore();

            // SHAPE TRACKING
            if (isPinching) {
              if (!isPinchingRef.current) {
                linesRef.current.push({ color: '#39ff14', points: [{ x: smoothedPx, y: smoothedPy }] });
                isPinchingRef.current = true;
              } else {
                const currentLine = linesRef.current[linesRef.current.length - 1];
                if (currentLine) currentLine.points.push({ x: smoothedPx, y: smoothedPy });
              }
              needsSyncRef.current = true;
            } else {
              // PINCH RELEASED -> SHAPE ENGINE
              if (isPinchingRef.current) {
                const lastLine = linesRef.current[linesRef.current.length - 1];
                if (lastLine && lastLine.points.length > 5) {
                  const pts = lastLine.points;
                  const start = pts[0];
                  const end = pts[pts.length - 1];
                  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                  let pathLen = 0;

                  for (let i = 0; i < pts.length; i++) {
                    const p = pts[i];
                    if (p.x < minX) minX = p.x;
                    if (p.x > maxX) maxX = p.x;
                    if (p.y < minY) minY = p.y;
                    if (p.y > maxY) maxY = p.y;
                    if (i > 0) pathLen += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
                  }

                  const width = maxX - minX;
                  const height = maxY - minY;
                  const diag = Math.hypot(width, height);

                  if (diag > 20) {
                    const gap = Math.hypot(start.x - end.x, start.y - end.y);
                    const isClosed = gap < (diag * 0.45);

                    let detectedShape = null;
                    let stroke1, stroke2, strokeO;

                    if (isClosed) {
                      const expectedCircum = Math.PI * ((width + height) / 2);
                      const ratio = pathLen / expectedCircum;
                      if (ratio > 0.6 && ratio < 1.7) {
                        detectedShape = 'O';
                        strokeO = [];
                        const cx = minX + width / 2; const cy = minY + height / 2;
                        const r = Math.max(width, height) / 2;
                        for (let angle = 0; angle <= Math.PI * 2; angle += 0.15) {
                          strokeO.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
                        }
                      }
                    } else {
                      const startToEndDist = Math.hypot(start.x - end.x, start.y - end.y);
                      const isStraight = pathLen > 0 && (startToEndDist / pathLen) > 0.55;

                      if (isStraight) {
                        for (let i = linesRef.current.length - 2; i >= 0; i--) {
                          const prevLine = linesRef.current[i];
                          if (prevLine.points.length < 5) continue;

                          const pStart = prevLine.points[0]; const pEnd = prevLine.points[prevLine.points.length - 1];
                          let pLen = 0; for (let j = 1; j < prevLine.points.length; j++) pLen += Math.hypot(prevLine.points[j].x - prevLine.points[j - 1].x, prevLine.points[j].y - prevLine.points[j - 1].y);
                          const pDist = Math.hypot(pStart.x - pEnd.x, pStart.y - pEnd.y);

                          if (pLen > 0 && (pDist / pLen) > 0.55) {
                            let pMinX = Math.min(pStart.x, pEnd.x), pMaxX = Math.max(pStart.x, pEnd.x);
                            let pMinY = Math.min(pStart.y, pEnd.y), pMaxY = Math.max(pStart.y, pEnd.y);

                            const overlapX = Math.max(0, Math.min(maxX, pMaxX) - Math.max(minX, pMinX));
                            const overlapY = Math.max(0, Math.min(maxY, pMaxY) - Math.max(minY, pMinY));

                            if (overlapX > 20 && overlapY > 20) {
                              const dx1 = end.x - start.x; const dy1 = end.y - start.y;
                              const dx2 = pEnd.x - pStart.x; const dy2 = pEnd.y - pStart.y;

                              if ((dx1 * dy1) * (dx2 * dy2) < 0) {
                                minX = Math.min(minX, pMinX); maxX = Math.max(maxX, pMaxX);
                                minY = Math.min(minY, pMinY); maxY = Math.max(maxY, pMaxY);
                                detectedShape = 'X';
                                stroke1 = []; stroke2 = [];
                                for (let t = 0; t <= 1; t += 0.05) stroke1.push({ x: minX + (maxX - minX) * t, y: minY + (maxY - minY) * t });
                                for (let t = 0; t <= 1; t += 0.05) stroke2.push({ x: maxX - (maxX - minX) * t, y: minY + (maxY - minY) * t });
                                break;
                              }
                            }
                          }
                        }
                      }
                    }

                    const cleanArea = (bMinX, bMaxX, bMinY, bMaxY) => {
                      const margin = 80;
                      const cMinX = bMinX - margin, cMaxX = bMaxX + margin;
                      const cMinY = bMinY - margin, cMaxY = bMaxY + margin;
                      linesRef.current = linesRef.current.filter(line => {
                        if (line.points.length === 0) return false;
                        let inside = 0;
                        line.points.forEach(p => {
                          if (p.x >= cMinX && p.x <= cMaxX && p.y >= cMinY && p.y <= cMaxY) inside++;
                        });
                        return (inside / line.points.length) < 0.5;
                      });
                    };

                    const bCenter = { x: minX + (maxX - minX) / 2, y: minY + (maxY - minY) / 2 };
                    const cellIdx = getCellIndex(bCenter.x, bCenter.y);
                    const isBoardMove = cellIdx !== -1 && showGridRef.current;

                    if (isBoardMove && detectedShape) {
                      cleanArea(minX, maxX, minY, maxY);
                      
                      const isInCallCheck = dataConnRef.current && dataConnRef.current.open;
                      
                      if (isInCallCheck && roleRef.current !== turnRef.current) {
                          showToast(`⚠ NOT YOUR TURN! Waiting for Player ${turnRef.current}...`);
                      } else if (detectedShape !== roleRef.current) {
                        showToast(`⚠ RULE ERROR: You are Player ${roleRef.current}, but you drew a ${detectedShape}!`);
                      } else if (boardRef.current[cellIdx] !== null) {
                        showToast(`⚠ RULE ERROR: This block is already occupied!`);
                      } else {
                        boardRef.current[cellIdx] = detectedShape;
                        setCurrentTurn(detectedShape === 'X' ? 'O' : 'X');
                        if (dataConnRef.current && dataConnRef.current.open) {
                          dataConnRef.current.send({ type: 'MOVE', cell: cellIdx, role: detectedShape });
                        }
                        checkWinnerLocal(boardRef.current);
                      }
                      needsSyncRef.current = true;
                    } else if (!isBoardMove && detectedShape) {
                      cleanArea(minX, maxX, minY, maxY);
                      if (detectedShape === 'O') {
                        linesRef.current.push({ color: lastLine.color, points: strokeO });
                      } else if (detectedShape === 'X') {
                        linesRef.current.push({ color: lastLine.color, points: stroke1 });
                        linesRef.current.push({ color: lastLine.color, points: stroke2 });
                      }
                      needsSyncRef.current = true;
                    }
                  }
                }
                needsSyncRef.current = true;
              }
              isPinchingRef.current = false;
            }
          }
        } else {
          isPinchingRef.current = false;
        }
      }

      if (needsSyncRef.current && dataConnRef.current && dataConnRef.current.open) {
        dataConnRef.current.send({ type: 'LINES', data: linesRef.current });
        needsSyncRef.current = false;
      }

      animationFrameId = requestAnimationFrame(predictWebcam);
    };

    const drawLines = (ctx, linesArray, isRemote) => {
      linesArray.forEach(line => {
        if (line.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 1; i < line.points.length; i++) ctx.lineTo(line.points[i].x, line.points[i].y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = isRemote ? '#ff00ff' : line.color;
        ctx.lineWidth = 10;
        ctx.shadowBlur = 0;
        ctx.stroke();
      });
    };

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handLandmarker) handLandmarker.close();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  const connectToPeerId = (targetId, stream) => {
    if (!targetId || !peerRef.current || !stream) return;
    const call = peerRef.current.call(targetId, stream);
    
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    });

    const conn = peerRef.current.connect(targetId);
    setupDataConnection(conn);
    setIsInCall(true);
  };

  const connectToPeer = () => {
     connectToPeerId(remotePeerId, videoRef.current?.srcObject);
  };

  const setupCallResponses = (call) => {
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setIsInCall(true);
    });
  };

  const setupDataConnection = (conn) => {
    conn.on('open', () => { 
        dataConnRef.current = conn; 
        conn.send({ type: 'HANDSHAKE', name: localNameRef.current });
    });
    conn.on('data', (payload) => {
      if (Array.isArray(payload)) {
        remoteLinesRef.current = payload;
      } else if (payload.type === 'HANDSHAKE') {
        setRemoteName(payload.name);
      } else if (payload.type === 'LINES') {
        remoteLinesRef.current = payload.data;
      } else if (payload.type === 'MOVE') {
        boardRef.current[payload.cell] = payload.role;
        setCurrentTurn(payload.role === 'X' ? 'O' : 'X');
        checkWinnerLocal(boardRef.current);
      } else if (payload.type === 'BOARD_RESET') {
        boardRef.current = Array(9).fill(null);
        setWinner(null);
        winnerRef.current = null;
        setCurrentTurn('X');
      } else if (payload.type === 'ROLE_SYNC') {
        setMyRole(payload.role);
        showToast(`Roles updated! You are now Player ${payload.role}`);
      } else if (payload.type === 'ERASE_REQUEST') {
        setEraseRequest(true);
      } else if (payload.type === 'EMOJI') {
        spawnEmoji(payload.emoji, true);
      }
    });
  };

  const handleClear = () => {
    linesRef.current = [];
    needsSyncRef.current = true;
  };

  const handleApproveErase = () => {
    linesRef.current = [];
    needsSyncRef.current = true;
    setEraseRequest(false);
  };

  const resetBoard = () => {
    boardRef.current = Array(9).fill(null);
    setWinner(null);
    winnerRef.current = null;
    setCurrentTurn('X');
    if (dataConnRef.current && dataConnRef.current.open) {
      dataConnRef.current.send({ type: 'BOARD_RESET' });
    }
  };

  const handleRoleSwitch = () => {
      const newRole = myRole === 'X' ? 'O' : 'X';
      setMyRole(newRole);
      if (dataConnRef.current && dataConnRef.current.open) {
          const oppositeRole = newRole === 'X' ? 'O' : 'X';
          dataConnRef.current.send({ type: 'ROLE_SYNC', role: oppositeRole });
          showToast(`Synced! Opponent forced to Player ${oppositeRole}`);
      }
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getVideoTracks();
      tracks.forEach(track => track.enabled = !isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getAudioTracks();
      tracks.forEach(track => track.enabled = !isAudioOn);
      setIsAudioOn(!isAudioOn);
    }
  };

  const endCall = () => {
    window.location.reload(); 
  };

  const sendEmoji = (emojiStr) => {
    spawnEmoji(emojiStr, false);
    if (dataConnRef.current && dataConnRef.current.open) {
        dataConnRef.current.send({ type: 'EMOJI', emoji: emojiStr });
    }
  };

  const spawnEmoji = (emojiStr, isRemote) => {
     const newEmoji = { 
         id: Date.now() + Math.random(), 
         char: emojiStr, 
         left: isRemote ? `${70 + Math.random()*20}%` : `${10 + Math.random()*20}%`,
     };
     setFloatingEmojis(prev => [...prev, newEmoji]);
     setTimeout(() => {
         setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
     }, 4000); 
  };

  const copyInviteLink = () => {
      const url = `${window.location.origin}${window.location.pathname}?room=${peerId}`;
      navigator.clipboard.writeText(url);
      showToast('✅ Invite link copied to clipboard!');
  };

  const handleNativeStart = () => {
      setHasStarted(true);
      if (window.__START_AIR_CANVAS__) {
          window.__START_AIR_CANVAS__();
      }
  };

  return (
    <div className={styles.container}>
      {!hasStarted && (
         <div style={{ position: 'absolute', zIndex: 1000, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
            <h1 style={{ color: '#0ff', fontSize: '3rem', marginBottom: '40px', textShadow: '0 0 20px #0ff', letterSpacing: '8px' }}>AIR CANVAS</h1>
            
            <input 
               type="text"
               placeholder="Enter your name..."
               value={localName}
               onChange={(e) => setLocalName(e.target.value)}
               className={styles.nameInput}
            />

            <button 
               className={styles.btn} 
               disabled={!localName.trim()}
               style={{ border: '2px solid #39ff14', color: '#39ff14', fontSize: '1.5rem', padding: '20px 50px', borderRadius: '40px', boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)', cursor: localName.trim() ? 'pointer' : 'not-allowed', background: 'rgba(57, 255, 20, 0.1)', opacity: localName.trim() ? 1 : 0.5, marginTop: '20px' }} 
               onClick={handleNativeStart}>
                {joinRoomId ? 'JOIN FRIEND' : 'ENTER GAME'}
            </button>
            <p style={{ color: '#00ffcc', marginTop: '30px', fontSize: '1rem', opacity: 0.8 }}>Will request Camera & Microphone access securely.</p>
         </div>
      )}

      {hasStarted && !isLoaded && !loadError && <div className={styles.loader}>INITIALIZING SYSTEM...</div>}
      {loadError && <div className={styles.loader} style={{ color: '#ff4444', animation: 'none', textAlign: 'center', padding: '0 20px', textShadow: '0 0 10px #ff0000' }}>{loadError}</div>}

      {isLoaded && (
        <>
          <div className={styles.playerHud}>
             <div className={styles.playerInfo}>
                <span style={{ color: '#39ff14' }}>{localName} (You)</span>
                <span style={{ margin: '0 10px', color: '#fff' }}>vs</span>
                <span style={{ color: '#f0f' }}>{remoteName || 'Waiting for opponent...'}</span>
             </div>
             
             {showGrid && isInCall && !winner && (
                 <div style={{ color: currentTurn === myRole ? '#39ff14' : '#f0f', marginTop: '10px', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', animation: currentTurn === myRole ? 'pulse 1.5s infinite' : 'none' }}>
                     {currentTurn === myRole ? `▶ YOUR TURN (${currentTurn})` : `WAITING FOR OPPONENT...`}
                 </div>
             )}

             {!isInCall && (
                 <button className={styles.inviteButton} onClick={copyInviteLink}>
                     🔗 Copy Invite Link
                 </button>
             )}
          </div>

          {/* <div className={styles.tutorialHUD}>
            <h3>HOW TO PLAY</h3>
            <ul>
              <li><strong>PINCH</strong> your index & thumb to draw.</li>
              <li><strong>OPEN</strong> all 5 fingers wide to erase.</li>
              <li><strong>YOUR ROLE:</strong> You are currently <span className={styles.playerRole}>{myRole}</span>.</li>
              <li>Draw a matching signature inside an empty grid box to lock it!</li>
            </ul>
          </div> */}
        </>
      )}

      {floatingEmojis.map(e => (
         <div key={e.id} className={styles.emojiFly} style={{ left: e.left }}>
            {e.char}
         </div>
      ))}

      {toastMessage && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}

      {/* Popups */}
      {eraseRequest && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <h2>ERASE REQUEST</h2>
            <p>The remote player requested to delete your drawings!</p>
            <div className={styles.popupButtons}>
              <button className={styles.btn} style={{ borderColor: '#39ff14', color: '#39ff14' }} onClick={handleApproveErase}>ALLOW</button>
              <button className={styles.btn} style={{ borderColor: '#f0f', color: '#f0f' }} onClick={() => setEraseRequest(false)}>DENY</button>
            </div>
          </div>
        </div>
      )}

      {winner && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <h2>{winner === 'DRAW' ? 'MATCH DRAWN!' : `PLAYER ${winner} WINS!`}</h2>
            <button className={styles.btn} style={{ borderColor: '#0ff', color: '#0ff' }} onClick={resetBoard}>PLAY AGAIN</button>
          </div>
        </div>
      )}

      {/* Media & Canvas */}
      <video ref={remoteVideoRef} className={isInCall ? styles.remoteVideo : styles.hidden} autoPlay playsInline></video>
      <video ref={videoRef} className={isInCall ? styles.videoPip : styles.video} autoPlay playsInline></video>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>

      {/* Removed old bulky tools, integrated below */}
      
      {isLoaded && (
        <div className={styles.bottomControls}>
          <button className={styles.emojiBtn} onClick={() => sendEmoji('👍')}>👍</button>
          <button className={styles.emojiBtn} onClick={() => sendEmoji('🔥')}>🔥</button>
          <button className={styles.emojiBtn} onClick={() => sendEmoji('😂')}>😂</button>
          <button className={styles.emojiBtn} onClick={() => sendEmoji('💖')}>💖</button>
          
          <div className={styles.divider}></div>

          <button className={`${styles.controlBtn} ${!isAudioOn ? styles.off : ''}`} onClick={toggleAudio} title="Toggle Audio">
             {isAudioOn ? '🎤' : '🔇'}
          </button>
          <button className={`${styles.controlBtn} ${!isVideoOn ? styles.off : ''}`} onClick={toggleVideo} title="Toggle Video">
             {isVideoOn ? '📹' : '📵'}
          </button>
          
          <div className={styles.divider}></div>
          
          <button 
             className={`${styles.controlBtn} ${!showGrid ? styles.off : ''}`} 
             onClick={() => setShowGrid(!showGrid)}
             title={showGrid ? "Disable Game Mode (Free Draw)" : "Enable Game Mode (Tic-Tac-Toe)"}
          >
             {showGrid ? '🎲' : '✏️'}
          </button>

          <button 
             className={styles.controlBtn} 
             style={{ border: myRole === 'X' ? '2px solid #39ff14' : '2px solid #0ff', width: '60px', borderRadius: '15px', fontSize: '1.2rem', fontWeight: 'bold' }} 
             onClick={handleRoleSwitch}
             title="Switch Role"
          >
             {myRole}
          </button>

           <button className={styles.controlBtn} onClick={handleClear} title="Erase Board">
             🗑️
          </button>

          <button className={`${styles.controlBtn} ${styles.danger}`} onClick={endCall} title="End Call">
             📞
          </button>
        </div>
      )}
    </div>
  );
}
