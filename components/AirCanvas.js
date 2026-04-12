"use client";

import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Peer from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './AirCanvas.module.css';
import LandingPage from './LandingPage';
import CalibratingReality from './CalibratingReality';
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
  const [winningLine, setWinningLine] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [ping, setPing] = useState(null);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(true);

  const peerRef = useRef(null);
  const dataConnRef = useRef(null);
  const localStreamRef = useRef(null);
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
    if (videoRef.current && localStreamRef.current && videoRef.current.srcObject !== localStreamRef.current) {
      videoRef.current.srcObject = localStreamRef.current;
      videoRef.current.muted = true;
    }
  }, [isInCall, hasStarted]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const room = urlParams.get('room');
      if (room) {
        setJoinRoomId(room);
        joinRoomIdRef.current = room;
        setRemotePeerId(room);
        setInputRoomCode(room);
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
          setWinningLine(line);
          winnerRef.current = board[a];
        }
        return;
      }
    }
    if (!board.includes(null)) {
      if (winnerRef.current !== 'DRAW') {
        setWinner('DRAW');
        setWinningLine(null);
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
        localStreamRef.current = stream;
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

      // --- DOM Grid Bounding Box collision logic (Responsive & Decoupled) ---
      const getCellIndex = (x, y) => {
        // x and y are native camera pixel coordinates (e.g. 0 to 1280)
        // Adjust for native video scaling via CSS object-fit: cover
        const scaleX = window.innerWidth / canvas.width;
        const scaleY = window.innerHeight / canvas.height;
        const scale = Math.max(scaleX, scaleY);

        const actW = canvas.width * scale;
        const actH = canvas.height * scale;

        // object-fit: cover centers the content natively
        const offsetX = (window.innerWidth - actW) / 2;
        const offsetY = (window.innerHeight - actH) / 2;

        // Mirror X because of scaleX(-1) on canvas and video
        const mirroredPx = canvas.width - x;
        const screenX = mirroredPx * scale + offsetX;
        const screenY = y * scale + offsetY;

        for (let i = 0; i < 9; i++) {
          const cell = document.getElementById(`tic-cell-${i}`);
          if (!cell) continue;

          const rect = cell.getBoundingClientRect();

          if (screenX >= rect.left && screenX <= rect.right && screenY >= rect.top && screenY <= rect.bottom) {
            return i;
          }
        }
        return -1;
      };

      const getDist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

      let startTimeMs = performance.now();

      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        const results = handLandmarker.detectForVideo(video, startTimeMs);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
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
    
    call.on('close', () => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      setIsInCall(false);
      setRemoteName('');
      showToast('Opponent ended the call.');
    });
    call.on('error', () => {
      setIsInCall(false);
      setRemoteName('');
    });
    
    setIsInCall(true);
  };

  const connectToPeer = () => {
    connectToPeerId(remotePeerId, localStreamRef.current);
  };

  const setupCallResponses = (call) => {
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setIsInCall(true);
    });
    call.on('close', () => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      setIsInCall(false);
      setRemoteName('');
      showToast('Call ended by opponent.');
    });
    call.on('error', () => {
      setIsInCall(false);
      setRemoteName('');
    });
  };

  const setupDataConnection = (conn) => {
    conn.on('open', () => {
      dataConnRef.current = conn;
      conn.send({ 
        type: 'HANDSHAKE', 
        name: localNameRef.current,
        isHost: !joinRoomIdRef.current,
        hostRole: roleRef.current 
      });
      
      // If the host was playing natively and a player securely joined, automatically wipe the board
      const hasMoves = boardRef.current.some(cell => cell !== null);
      if (hasMoves) {
         resetBoard();
         showToast('Grid cleared automatically for the new session.');
      }
    });
    conn.on('close', () => {
      setIsInCall(false);
      setRemoteName('');
      remoteLinesRef.current = [];
      showToast('Opponent disconnected from the session.');
    });
    conn.on('error', () => {
      setIsInCall(false);
      setRemoteName('');
    });
    conn.on('data', (payload) => {
      if (Array.isArray(payload)) {
        remoteLinesRef.current = payload;
      } else if (payload.type === 'HANDSHAKE') {
        setRemoteName(payload.name);
        
        // Enforce opposing role on the joining Guest dynamically
        if (payload.isHost && payload.hostRole) {
           const newRole = payload.hostRole === 'X' ? 'O' : 'X';
           setMyRole(newRole);
           showToast(`Connected to Host! You are assigned Player ${newRole}`);
        }
      } else if (payload.type === 'LINES') {
        remoteLinesRef.current = payload.data;
      } else if (payload.type === 'MOVE') {
        boardRef.current[payload.cell] = payload.role;
        setCurrentTurn(payload.role === 'X' ? 'O' : 'X');
        checkWinnerLocal(boardRef.current);
      } else if (payload.type === 'BOARD_RESET') {
        boardRef.current = Array(9).fill(null);
        setWinner(null);
        setWinningLine(null);
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
    setWinningLine(null);
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
    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getVideoTracks();
      if (tracks.length > 0) {
        setIsVideoOn(prev => {
          const newState = !prev;
          tracks.forEach(track => track.enabled = newState);
          return newState;
        });
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getAudioTracks();
      if (tracks.length > 0) {
        setIsAudioOn(prev => {
          const newState = !prev;
          tracks.forEach(track => track.enabled = newState);
          return newState;
        });
      }
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

  // --- Aesthetic Victory & Animation Handlers ---
  const [lineCoords, setLineCoords] = useState(null);
  const gridContainerRef = useRef(null);

  useEffect(() => {
    if (!winningLine || !gridContainerRef.current) return;
    const updateLine = () => {
      const cellA = document.getElementById(`tic-cell-${winningLine[0]}`);
      const cellC = document.getElementById(`tic-cell-${winningLine[2]}`);
      const gridContainer = gridContainerRef.current;

      if (cellA && cellC && gridContainer) {
        const rectA = cellA.getBoundingClientRect();
        const rectC = cellC.getBoundingClientRect();
        const gridRect = gridContainer.getBoundingClientRect();

        setLineCoords({
          x1: rectA.left + rectA.width / 2 - gridRect.left,
          y1: rectA.top + rectA.height / 2 - gridRect.top,
          x2: rectC.left + rectC.width / 2 - gridRect.left,
          y2: rectC.top + rectC.height / 2 - gridRect.top,
        });
      }
    };
    
    updateLine();
    const timer = setTimeout(updateLine, 50);
    window.addEventListener('resize', updateLine);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateLine);
    };
  }, [winningLine]);

  useEffect(() => {
    if (winner && winner !== 'DRAW') {
      const isLocalWin = winner === myRole;
      const primaryColor = isLocalWin ? '#39ff14' : '#ff00ff';
      const secondaryColor = isLocalWin ? '#00ffff' : '#ff66ff';
      const colors = [primaryColor, '#ffffff', secondaryColor];
      
      let duration = 3 * 1000;
      let animationEnd = Date.now() + duration;
  
      let frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors,
          zIndex: 10000,
          disableForReducedMotion: true
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors,
          zIndex: 10000,
          disableForReducedMotion: true
        });
  
        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [winner, myRole]);

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


      {hasStarted && !isLoaded && !loadError && <CalibratingReality />}
      {loadError && <div className={styles.loader} style={{ color: '#ff4444', animation: 'none', textAlign: 'center', padding: '0 20px', textShadow: '0 0 10px #ff0000' }}>{loadError}</div>}

      {isLoaded && (
        <>
          {/* Top App Bar */}
          <header className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-2xl shadow-indigo-950/20">
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-lg font-bold tracking-tighter text-indigo-100 font-['Plus_Jakarta_Sans']">Obsidian Gaming</div>
              <div className="h-4 w-[1px] bg-outline-variant/30 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-indigo-200">
                <span className="text-xs font-semibold uppercase tracking-widest opacity-80">Room: {peerId || '...'}</span>
              </div>
              {isInCall && ping !== null && (
                <span style={{ color: getPingColor(ping), fontSize: '10px', marginLeft: '10px', fontWeight: 'bold' }}>⚡ {ping}ms</span>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className={isInCall ? "flex -space-x-2" : "flex"}>
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 overflow-hidden relative bg-primary flex items-center justify-center z-10 shadow-lg shadow-primary/20">
                  <span className="font-bold text-background text-xs">{localName?.charAt(0)?.toUpperCase() || '?'}</span>
                </div>
                {isInCall && (
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-[#f0f] flex items-center justify-center z-0 shadow-lg shadow-[#f0f]/20">
                    <span className="font-bold text-white text-xs">{remoteName?.charAt(0)?.toUpperCase() || '?'}</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Central Status Indicators */}
          {!isInCall ? (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 glass-panel px-6 py-2 rounded-full flex items-center gap-3 border border-white/5 shadow-xl z-50">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <span className="text-sm font-medium text-indigo-100 tracking-wide">Waiting for opponent</span>
            </div>
          ) : showGrid && !winner ? (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 glass-panel px-6 py-2 rounded-full flex items-center gap-3 border border-white/5 shadow-xl z-50" style={{ animation: currentTurn === myRole ? 'pulse 1.5s infinite' : 'none', border: currentTurn === myRole ? '1px solid #39ff14' : '' }}>
              <span className="text-sm font-bold tracking-widest uppercase" style={{ color: currentTurn === myRole ? '#39ff14' : '#f0f' }}>
                {currentTurn === myRole ? `▶ YOUR TURN (${currentTurn})` : `WAITING FOR OPPONENT...`}
              </span>
            </div>
          ) : null}

          {/* Share Modal removed from inline overlay, now rendered full screen at the end of the DOM tree */}
        </>
      )}

      {/* Emoji Overlays */}
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

      {/* Popups & Toasts */}
      {toastMessage && (
        <div className={styles.toast}>
          {toastMessage}
        </div>
      )}

      {winner && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4 glass-panel px-10 py-6 rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl bg-slate-900/80"
        >
            <h2 className="text-4xl font-black uppercase tracking-widest" style={{ color: winner === 'DRAW' ? '#fff' : winner === 'X' ? '#39ff14' : '#ff00ff', textShadow: `0 0 20px ${winner === 'DRAW' ? '#fff' : winner === 'X' ? '#39ff14' : '#ff00ff'}` }}>
              {winner === 'DRAW' ? 'MATCH DRAWN!' : `PLAYER ${winner} WINS!`}
            </h2>
            <button 
              className="mt-2 px-8 py-3 rounded-full font-bold tracking-widest hover:scale-105 active:scale-95 border border-white/30 transition-all text-white shadow-lg shadow-black/50 bg-gradient-to-r from-white/10 to-white/5" 
              onClick={resetBoard}
            >
              PLAY AGAIN
            </button>
        </motion.div>
      )}

      {/* Overlay Filters */}
      {hasStarted && (
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 z-10 pointer-events-none" />
      )}

      {/* Media & Canvas Layered */}
      {/* Stream Wrapper (Unconditional Render to preserve MediaStream track and AI Tensor bindings for LOCAL video) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full relative">
          <video 
            ref={videoRef} 
            className={`${styles.video} ${!hasStarted ? 'opacity-0' : 'opacity-100'}`} 
            autoPlay 
            playsInline 
            muted
          ></video>
        </div>
      </div>
      
      {/* Remote Video Wrapper (Unconditional Render to prevent losing srcObject on events) */}
      <div className={isInCall ? "fixed right-6 top-24 z-20 flex flex-col gap-4" : "hidden"}>
        <div className="w-48 aspect-video glass-panel rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group transition-transform hover:scale-105 relative bg-black">
          <video 
            ref={remoteVideoRef} 
            className={styles.videoPip} 
            autoPlay 
            playsInline
          ></video>
          {isInCall && (
            <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-[#f0f] shadow-lg shadow-[#f0f]/50 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md">
                Opponent ({myRole === 'X' ? 'O' : 'X'})
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Central Interactive DOM Grid (Replaces Canvas Grid) */}
      {hasStarted && showGrid && (
        <main className="absolute inset-0 z-30 w-full h-full flex flex-col items-center justify-center p-6 pointer-events-none overflow-hidden">
          {/* 3x3 Grid Container Wrapper (Exact Stitch design) */}
          <div className="relative group pointer-events-auto">
            {/* Asymmetric Glow Aura */}
            <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"></div>

            <div ref={gridContainerRef} className="relative grid grid-cols-3 gap-3 p-4 glass-panel rounded-[2rem] border border-white/5 grid-glow">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => {
                const cellValue = boardRef.current[index];
                return (
                  <div id={`tic-cell-${index}`} key={index} className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group/cell">
                    {cellValue === 'X' && (
                      <motion.span 
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        className="material-symbols-outlined text-5xl sm:text-7xl text-primary glow-text-primary" style={{ fontVariationSettings: "'wght' 200" }}>close</motion.span>
                    )}
                    {cellValue === 'O' && (
                      <motion.span 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        className="material-symbols-outlined text-5xl sm:text-7xl text-tertiary glow-text-tertiary" style={{ fontVariationSettings: "'wght' 200" }}>radio_button_unchecked</motion.span>
                    )}
                  </div>
                );
              })}

              {winningLine && lineCoords && (
                <svg className="absolute inset-0 pointer-events-none z-50 overflow-visible" style={{ width: '100%', height: '100%' }}>
                  <motion.line
                    x1={lineCoords.x1}
                    y1={lineCoords.y1}
                    x2={lineCoords.x2}
                    y2={lineCoords.y2}
                    stroke={winner === 'X' ? '#39ff14' : '#0ff'}
                    strokeWidth="16"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0, scale: 0.95 }}
                    animate={{ pathLength: 1, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      filter: `drop-shadow(0 0 16px ${winner === 'X' ? '#39ff14' : '#0ff'}) drop-shadow(0 0 32px ${winner === 'X' ? '#39ff14' : '#0ff'})`
                    }}
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Session Metadata (Asymmetric editorial moment) */}
          <div className="relative mt-8 sm:mt-12 w-full max-w-[28rem] flex justify-between items-end opacity-80 px-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Current Turn</span>
              <span className="text-xl font-light text-indigo-100" style={{ color: currentTurn === myRole ? '#39ff14' : '#c0c1ff' }}>{currentTurn === myRole ? `${localName || 'You'} (${myRole})` : `${remoteName || 'Opponent'} (${currentTurn})`}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Round Info</span>
              <span className="text-xl font-mono text-indigo-100">{winner ? 'Finished' : 'In Progress'}</span>
            </div>
          </div>
        </main>
      )}

      {/* Legacy Canvas (Used natively for AI Stroke prediction & Free Drawing) - Must be elevated above grid */}
      <canvas ref={canvasRef} className={!hasStarted ? styles.hidden : styles.canvas} style={{ zIndex: 40 }}></canvas>

      {/* Bottom Controls Navbar */}
      {isLoaded && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/60 backdrop-blur-2xl rounded-full px-4 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Drawing Mode Toggle (Adapted Games button) */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex flex-col items-center gap-1 ${showGrid ? 'bg-indigo-500/20 text-indigo-100 rounded-full' : 'text-slate-400'} p-3 transition-transform hover:text-indigo-200 hover:scale-110 active:scale-90 duration-150`}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{showGrid ? 'videogame_asset' : 'draw'}</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-medium uppercase tracking-widest">Game</span>
          </button>

          {/* Mic */}
          <button
            onClick={toggleAudio}
            className={`flex flex-col items-center gap-1 ${isAudioOn ? 'text-slate-400' : 'text-error'} p-3 transition-transform hover:text-indigo-200 hover:scale-110 active:scale-90 duration-150`}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{isAudioOn ? 'mic' : 'mic_off'}</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-medium uppercase tracking-widest">Mic</span>
          </button>

          {/* Cam */}
          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center gap-1 ${isVideoOn ? 'text-slate-400' : 'text-error'} p-3 transition-transform hover:text-indigo-200 hover:scale-110 active:scale-90 duration-150`}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{isVideoOn ? 'videocam' : 'videocam_off'}</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-medium uppercase tracking-widest">Cam</span>
          </button>

          {/* Hand Tracking Disable */}
          <button
            onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}
            className={`flex flex-col items-center gap-1 ${isDrawingEnabled ? 'text-slate-400' : 'text-error'} p-3 transition-transform hover:text-indigo-200 hover:scale-110 active:scale-90 duration-150`}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{isDrawingEnabled ? 'pan_tool' : 'do_not_touch'}</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-medium uppercase tracking-widest">Hands</span>
          </button>

          {/* Erase Board & Switch Role logic adapted into standard layout */}
          <div className="w-[1px] h-8 bg-outline-variant/20 mx-1"></div>

          <button
            onClick={handleClear}
            className="flex flex-col items-center gap-1 text-warning p-3 transition-transform hover:scale-110 active:scale-90 duration-150" style={{ color: '#ffaa00' }}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>mop</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-medium uppercase tracking-widest">Clear</span>
          </button>

          <button
            onClick={handleRoleSwitch}
            className="flex flex-col items-center gap-1 p-3 transition-transform hover:scale-110 active:scale-90 duration-150"
            style={{ color: myRole === 'X' ? '#39ff14' : '#0ff' }}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>switch_account</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-widest mt-1 leading-[4px]">{myRole}</span>
          </button>

          <div className="w-[1px] h-8 bg-outline-variant/20 mx-1"></div>

          {/* Invite (Re-using Share Logic) */}
          <button
            onClick={() => setShowShareModal(!showShareModal)}
            className="flex flex-col items-center gap-1 text-slate-400 p-3 transition-transform hover:text-indigo-200 hover:scale-110 active:scale-90 duration-150">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>person_add</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-medium uppercase tracking-widest">Invite</span>
          </button>

          {/* End Call (Wait... does endCall exist? We'll conditionally show it if we have it, or fallback) */}
          <button
            onClick={() => window.location.reload()}
            className="flex flex-col items-center gap-1 text-error p-3 transition-transform hover:bg-error/10 hover:scale-110 rounded-full active:scale-90 duration-150">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>call_end</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-medium uppercase tracking-widest">End</span>
          </button>
        </nav>
      )}

      {/* Full screen Share Modal Overlay */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#040811]/80 backdrop-blur-sm">
          <div className="relative bg-[#060b14] border border-white/5 shadow-[0_0_60px_rgba(93,96,235,0.15)] rounded-[2rem] w-full max-w-[340px] p-8 flex flex-col items-center">
            
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
            </button>

            <div className="w-full bg-[#0b1120] rounded-2xl py-6 flex flex-col items-center border border-white/5 mb-8 mt-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 mb-2">Room Code</span>
              <h2 className="text-4xl tracking-[0.3em] font-light text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] m-0 pl-3">{peerId ? peerId.toUpperCase() : '...'}</h2>
            </div>

            <div className="w-56 h-56 bg-[#0b1120] border border-white/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(153,69,232,0.1)] overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-[#ddb7ff]/10 to-transparent opacity-50 pointer-events-none"></div>
               <div className="relative z-10 bg-[#060b14] p-3 rounded-2xl border border-white/5">
                 <QRCodeSVG 
                   value={`${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}?room=${peerId}`} 
                   size={160} 
                   level="H" 
                   includeMargin={false} 
                   fgColor="#ffffff" 
                   bgColor="#060b14" 
                 />
               </div>
            </div>

            <button 
              onClick={copyInviteLink}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#5d60eb] to-[#bf58ff] text-white flex items-center justify-center gap-2 font-bold text-[11px] tracking-widest uppercase hover:opacity-90 active:scale-95 transition-all shadow-[0_0_30px_rgba(191,88,255,0.3)] mb-6"
            >
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'wght' 300" }}>content_copy</span>
              Copy link to clipboard
            </button>

            <span className="text-[9px] uppercase tracking-[0.1em] text-slate-600 font-bold absolute bottom-6">
              Expires in 23:59:59
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
