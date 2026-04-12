"use client";

import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Peer from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';
import styles from './AirCanvas.module.css';
import LandingPage from './LandingPage';
import {
  Mic, MicOff,
  Video, VideoOff,
  Hand,
  Grid3X3, Brush,
  Trash2, PhoneOff,
  ThumbsUp, Flame, Smile, Heart,
  Link, Share2
} from 'lucide-react';

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
  const [toastMessage, setToastMessage] = useState('');
  const [ping, setPing] = useState(null);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(true);

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
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

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

  useEffect(() => {
    let interval;
    if (isInCall) {
      interval = setInterval(() => {
        if (dataConnRef.current && dataConnRef.current.open) {
          dataConnRef.current.send({ type: 'PING', timestamp: Date.now() });
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const isPinchingRef = useRef(false);
  const needsSyncRef = useRef(false);
  const isDrawingEnabledRef = useRef(true);

  // Ref mirrors for animation loop closure
  const showGridRef = useRef(showGrid);
  useEffect(() => { showGridRef.current = showGrid; }, [showGrid]);
  const roleRef = useRef(myRole);
  useEffect(() => { roleRef.current = myRole; }, [myRole]);
  const turnRef = useRef(currentTurn);
  useEffect(() => { turnRef.current = currentTurn; }, [currentTurn]);
  const winnerRef = useRef(winner);
  useEffect(() => { isDrawingEnabledRef.current = isDrawingEnabled; }, [isDrawingEnabled]);

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

  const getPingColor = (p) => {
    if (p < 80) return '#39ff14';
    if (p < 150) return '#ffff00';
    return '#ff4444';
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
      const myCustomId = Math.random().toString(36).substring(2, 7).toUpperCase();
      const peer = new Peer(myCustomId);
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
    let lastSyncTime = 0;
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
          ctx.save();
          
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(gridX, gridY, GRID_SIZE, GRID_SIZE, 20);
          else ctx.rect(gridX, gridY, GRID_SIZE, GRID_SIZE);
          ctx.clip(); // Clip drawing to the board area

          // 1. Frosted Glass Blur Effect overlaid perfectly with the video feed
          ctx.filter = 'blur(5px)';
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.filter = 'none';

          // 2. Glass Tint Overlay
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fill();

          // 3. Faint Internal Grid Lines with Gradients
          const hGrad = ctx.createLinearGradient(gridX, 0, gridX + GRID_SIZE, 0);
          hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
          hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.strokeStyle = hGrad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(gridX, gridY + cellW); ctx.lineTo(gridX + GRID_SIZE, gridY + cellW);
          ctx.moveTo(gridX, gridY + cellW * 2); ctx.lineTo(gridX + GRID_SIZE, gridY + cellW * 2);
          ctx.stroke();

          const vGrad = ctx.createLinearGradient(0, gridY, 0, gridY + GRID_SIZE);
          vGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
          vGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

          ctx.strokeStyle = vGrad;
          ctx.beginPath();
          ctx.moveTo(gridX + cellW, gridY); ctx.lineTo(gridX + cellW, gridY + GRID_SIZE);
          ctx.moveTo(gridX + cellW * 2, gridY); ctx.lineTo(gridX + cellW * 2, gridY + GRID_SIZE);
          ctx.stroke();

          ctx.restore(); // End clipping

          // 4. Elegant Outer Border & Box Shadows
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(gridX, gridY, GRID_SIZE, GRID_SIZE, 20);
          else ctx.rect(gridX, gridY, GRID_SIZE, GRID_SIZE);
          
          // Outer Drop Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 32;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 8;
          
          // Primary Border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Reset shadow
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Inset highlights (inner stroke)
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(gridX + 1, gridY + 1, GRID_SIZE - 2, GRID_SIZE - 2, 19);
          else ctx.rect(gridX + 1, gridY + 1, GRID_SIZE - 2, GRID_SIZE - 2);
          
          const insetGrad = ctx.createLinearGradient(0, gridY, 0, gridY + GRID_SIZE);
          insetGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)'); // top highlight
          insetGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');   // fade in middle
          insetGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)'); // bottom highlight
          
          ctx.strokeStyle = insetGrad;
          ctx.lineWidth = 1;
          ctx.stroke();

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

        if (results.landmarks && results.landmarks.length > 0 && isDrawingEnabledRef.current) {
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
              const pX = Math.round(smoothedPx * 10) / 10;
              const pY = Math.round(smoothedPy * 10) / 10;
              if (!isPinchingRef.current) {
                linesRef.current.push({ color: '#39ff14', points: [{ x: pX, y: pY }] });
                isPinchingRef.current = true;
              } else {
                const currentLine = linesRef.current[linesRef.current.length - 1];
                if (currentLine) currentLine.points.push({ x: pX, y: pY });
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
                          strokeO.push({ x: Math.round((cx + Math.cos(angle) * r) * 10) / 10, y: Math.round((cy + Math.sin(angle) * r) * 10) / 10 });
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
                                for (let t = 0; t <= 1; t += 0.05) stroke1.push({ x: Math.round((minX + (maxX - minX) * t) * 10) / 10, y: Math.round((minY + (maxY - minY) * t) * 10) / 10 });
                                for (let t = 0; t <= 1; t += 0.05) stroke2.push({ x: Math.round((maxX - (maxX - minX) * t) * 10) / 10, y: Math.round((minY + (maxY - minY) * t) * 10) / 10 });
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
        const nowMs = Date.now();
        if (nowMs - lastSyncTime > 60) {
          dataConnRef.current.send({ type: 'LINES', data: linesRef.current });
          lastSyncTime = nowMs;
          needsSyncRef.current = false;
        }
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
      } else if (payload.type === 'EMOJI') {
        spawnEmoji(payload.emoji, true);
      } else if (payload.type === 'PING') {
        conn.send({ type: 'PONG', timestamp: payload.timestamp });
      } else if (payload.type === 'PONG') {
        setPing(Date.now() - payload.timestamp);
      }
    });
  };

  const handleClear = () => {
    linesRef.current = [];
    needsSyncRef.current = true;
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
    const emjMap = { ThumbsUp: '👍', Flame: '🔥', Smile: '😂', Heart: '💖' };
    const realEmoji = emjMap[emojiStr] || emojiStr;

    const particles = Array.from({ length: 6 }).map((_, i) => ({
      id: `p-${Date.now()}-${Math.random()}`,
      offsetX: (Math.random() - 0.5) * 60,
      offsetY: (Math.random() - 0.5) * 50,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.5,
      color: ['#ff00ff', '#00ffff', '#39ff14', '#ffff00'][Math.floor(Math.random() * 4)]
    }));

    const newEmoji = {
      id: Date.now() + Math.random(),
      char: realEmoji,
      left: isRemote ? `${70 + Math.random() * 20}%` : `${10 + Math.random() * 20}%`,
      particles
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
    if (inputRoomCode.trim()) {
      const code = inputRoomCode.trim().toUpperCase();
      setJoinRoomId(code);
      joinRoomIdRef.current = code;
      setRemotePeerId(code);
    }
    setHasStarted(true);
    if (window.__START_AIR_CANVAS__) {
      window.__START_AIR_CANVAS__();
    }
  };

  return (
    <div className={hasStarted ? styles.container : ""}>
      {!hasStarted && (
        <LandingPage
          localName={localName}
          setLocalName={setLocalName}
          inputRoomCode={inputRoomCode}
          setInputRoomCode={setInputRoomCode}
          handleNativeStart={handleNativeStart}
        />
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
              <div className={styles.shareMenuWrapper}>
                 <button className={styles.inviteButton} onClick={() => setShowShareModal(!showShareModal)}>
                   <Share2 size={16} /> {showShareModal ? 'CLOSE SHARE MENU' : 'INVITE OPPONENT'}
                 </button>
                 {showShareModal && (
                   <div className={styles.shareDropdownMenu}>
                     <div className={styles.codeContainerSmall}>
                       <span>ROOM CODE</span>
                       <h2>{peerId || '...'}</h2>
                     </div>
                     <div className={styles.qrSmallWrapper}>
                       <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}?room=${peerId}`} size={110} level="H" includeMargin={true} fgColor="#ff00ff" />
                     </div>
                     <button className={styles.copyTinyBtn} onClick={copyInviteLink}>
                       COPY LINK
                     </button>
                   </div>
                 )}
              </div>
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

      {isInCall && ping !== null && (
        <div className={styles.pingIndicator} style={{ color: getPingColor(ping) }}>
          ⚡ {ping}ms
        </div>
      )}

      {floatingEmojis.map(e => (
        <div key={e.id} className={styles.emojiFlyContainer} style={{ left: e.left }}>
          <div className={styles.emojiFlyText}>{e.char}</div>
          {e.particles && e.particles.map(p => (
            <div
              key={p.id}
              className={styles.particle}
              style={{
                left: `${p.offsetX}px`,
                top: `${p.offsetY}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
      ))}

      {toastMessage && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}

      {/* Popups */}

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
      <video ref={videoRef} className={!hasStarted ? styles.hidden : (isInCall ? styles.videoPip : styles.video)} autoPlay playsInline></video>
      <canvas ref={canvasRef} className={!hasStarted ? styles.hidden : styles.canvas}></canvas>

      {/* Removed old bulky tools, integrated below */}

      {isLoaded && (
        <div className={styles.bottomControls}>
          <button className={styles.emojiBtn} onClick={() => sendEmoji('ThumbsUp')} title="Thumbs Up">👍</button>
          <button className={styles.emojiBtn} onClick={() => sendEmoji('Flame')} title="Flame">🔥</button>
          <button className={styles.emojiBtn} onClick={() => sendEmoji('Smile')} title="Smile">😂</button>
          <button className={styles.emojiBtn} onClick={() => sendEmoji('Heart')} title="Heart">💖</button>

          <div className={styles.divider}></div>

          <button className={`${styles.controlBtn} ${!isAudioOn ? styles.off : ''}`} onClick={toggleAudio} title="Toggle Audio">
            {isAudioOn ? <Mic size={24} /> : <MicOff size={24} color="#ff4444" />}
          </button>
          <button className={`${styles.controlBtn} ${!isVideoOn ? styles.off : ''}`} onClick={toggleVideo} title="Toggle Video">
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} color="#ff4444" />}
          </button>

          <div className={styles.divider}></div>

          <button
            className={`${styles.controlBtn} ${!isDrawingEnabled ? styles.off : ''}`}
            onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}
            title={isDrawingEnabled ? "Disable Hand Tracking" : "Enable Hand Tracking"}
          >
            <Hand size={24} color={isDrawingEnabled ? "#39ff14" : "#ff4444"} />
          </button>

          <div className={styles.divider}></div>

          <button
            className={`${styles.controlBtn} ${!showGrid ? styles.off : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title={showGrid ? "Disable Game Mode (Free Draw)" : "Enable Game Mode (Tic-Tac-Toe)"}
          >
            {showGrid ? <Grid3X3 size={24} color="#00ffcc" /> : <Brush size={24} color="#f0f" />}
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
            <Trash2 size={24} color="#ffaa00" />
          </button>

          <button className={`${styles.controlBtn} ${styles.danger}`} onClick={endCall} title="End Call">
            <PhoneOff size={24} color="#fff" />
          </button>
        </div>
      )}
    </div>
  );
}
