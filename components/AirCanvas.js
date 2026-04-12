"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Peer from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './AirCanvas.module.css';
import LandingPage from './LandingPage';
import CalibratingReality from './CalibratingReality';
import { sfx } from '../utils/SoundEngine';
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

  const [turnDurationSetting, setTurnDurationSetting] = useState(0); // 10, 15, 20, 30, 0 (Infinite)
  const turnDurationSettingRef = useRef(0);
  const [isTimerMenuOpen, setIsTimerMenuOpen] = useState(false);
  useEffect(() => { turnDurationSettingRef.current = turnDurationSetting; }, [turnDurationSetting]);
  const [timeLeft, setTimeLeft] = useState(turnDurationSetting * 1000);

  const [scoreboard, setScoreboard] = useState({ X: 0, O: 0 });
  const scoreboardRef = useRef({ X: 0, O: 0 });
  useEffect(() => { scoreboardRef.current = scoreboard; }, [scoreboard]);

  // Draggable Grid — zero-rerender approach via direct DOM ref
  const draggableRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mx: 0, my: 0, gx: 0, gy: 0 });
  const gridPosRef = useRef({ x: null, y: null }); // tracks live position without state
  const rafRef = useRef(null);

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
  const [localAvatar, setLocalAvatar] = useState('Felix');
  const [remoteName, setRemoteName] = useState('');
  const [remoteAvatar, setRemoteAvatar] = useState('');
  const [joinRoomId, setJoinRoomId] = useState(null);
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);

  const localNameRef = useRef('');
  const localAvatarRef = useRef('');
  useEffect(() => { localNameRef.current = localName; }, [localName]);
  useEffect(() => { localAvatarRef.current = localAvatar; }, [localAvatar]);

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

  const [isDoodleEnabled, setIsDoodleEnabled] = useState(false);
  const isDoodleEnabledRef = useRef(false);
  useEffect(() => { isDoodleEnabledRef.current = isDoodleEnabled; }, [isDoodleEnabled]);

  const gridContainerRef = useRef(null);

  const isPinchingRef = useRef(false);
  const needsSyncRef = useRef(false);
  const isDrawingEnabledRef = useRef(true);
  const lastOpponentNameRef = useRef(null);

  // Ref mirrors for animation loop closure
  const showGridRef = useRef(showGrid);
  useEffect(() => { showGridRef.current = showGrid; }, [showGrid]);
  const roleRef = useRef(myRole);
  useEffect(() => { roleRef.current = myRole; }, [myRole]);
  const turnRef = useRef(currentTurn);
  useEffect(() => { turnRef.current = currentTurn; }, [currentTurn]);
  const winnerRef = useRef(winner);
  useEffect(() => { isDrawingEnabledRef.current = isDrawingEnabled; }, [isDrawingEnabled]);

  // Turn Timer Effect
  useEffect(() => {
    if (!isInCall || !hasStarted || winner || winnerRef.current || turnDurationSetting === 0) {
      setTimeLeft(turnDurationSetting * 1000);
      return;
    }

    setTimeLeft(turnDurationSetting * 1000);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          if (turnRef.current === roleRef.current) {
            if (dataConnRef.current && dataConnRef.current.open) {
              dataConnRef.current.send({ type: 'TIMEOUT_FORFEIT' });
            }
            setCurrentTurn(roleRef.current === 'X' ? 'O' : 'X');
            showToast("⏳ Turn timeout! You lost your turn.");
          }
          return turnDurationSetting * 1000; // reset for next player
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTurn, isInCall, hasStarted, winner, turnDurationSetting]);

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

          setScoreboard(prev => ({ ...prev, [board[a]]: prev[board[a]] + 1 }));
          sfx?.playWin();
        }
        return;
      }
    }
    if (!board.includes(null)) {
      if (winnerRef.current !== 'DRAW') {
        setWinner('DRAW');
        setWinningLine(null);
        winnerRef.current = 'DRAW';
        sfx?.playNotify();
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
            video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: "user" },
            audio: true
          });
        } catch (e1) {
          console.warn("Attempt 1 (A+V) failed, trying Video only...", e1);
          try {
            // Attempt 2: Strict Audio blocks (iOS Microphone limits) cause NotAllowedError. Try Video only!
            stream = await navigator.mediaDevices.getUserMedia({
              video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: "user" },
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
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
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
          // Tighter hysteresis: 0.055 to start pinch, 0.060 to release — reduces stickiness
          const isPinching = distance < (isPinchingRef.current ? 0.060 : 0.055);

          const isIndexExt = getDist(landmarks[8], wrist) > getDist(landmarks[6], wrist);
          const isMiddleExt = getDist(landmarks[12], wrist) > getDist(landmarks[10], wrist);
          const isRingExt = getDist(landmarks[16], wrist) > getDist(landmarks[14], wrist);
          const isPinkyExt = getDist(landmarks[20], wrist) > getDist(landmarks[18], wrist);
          const isThumbExt = getDist(landmarks[4], landmarks[17]) > getDist(landmarks[2], landmarks[17]);

          const isOpenHand = isIndexExt && isMiddleExt && isRingExt && isPinkyExt && isThumbExt && !isPinching;

          // Use midpoint between thumb tip and index tip — more physically stable than just index tip
          const targetPx = (thumbTip.x * 0.4 + indexTip.x * 0.6) * canvas.width;
          const targetPy = (thumbTip.y * 0.4 + indexTip.y * 0.6) * canvas.height;

          // Higher alpha = faster response, less lag (was 0.5)
          const alpha = 0.75;
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
            const coreColor = isPinching ? '#df15ff' : '#0ff';
            const outerRadius = isPinching ? 16 : 22;

            ctx.save();
            ctx.translate(smoothedPx, smoothedPy);

            // Soft Glowing Core
            ctx.beginPath();
            ctx.arc(0, 0, outerRadius * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = isPinching ? 'rgba(223, 21, 255, 0.4)' : 'rgba(0, 255, 255, 0.2)';
            ctx.shadowBlur = 25;
            ctx.shadowColor = coreColor;
            ctx.fill();

            // Crisp White Outer Ring
            ctx.beginPath();
            ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
            ctx.strokeStyle = isPinching ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0; // Remove shadow to ensure outer ring stays sharp
            ctx.stroke();
            ctx.restore();

            // SHAPE TRACKING
            if (isPinching) {
              const pX = Math.round(smoothedPx * 10) / 10;
              const pY = Math.round(smoothedPy * 10) / 10;

              let canDraw = isDoodleEnabledRef.current;
              if (!canDraw && gridContainerRef.current) {
                const rect = gridContainerRef.current.getBoundingClientRect();
                const scaleX = window.innerWidth / canvas.width;
                const scaleY = window.innerHeight / canvas.height;
                const scale = Math.max(scaleX, scaleY);
                const actW = canvas.width * scale;
                const actH = canvas.height * scale;
                const offsetX = (window.innerWidth - actW) / 2;
                const offsetY = (window.innerHeight - actH) / 2;
                const mirroredPx = canvas.width - pX;
                const screenX = mirroredPx * scale + offsetX;
                const screenY = pY * scale + offsetY;

                // Add 15px margin for easier drawing near edges
                if (screenX >= rect.left - 15 && screenX <= rect.right + 15 && 
                    screenY >= rect.top - 15 && screenY <= rect.bottom + 15) {
                  canDraw = true;
                }
              }

              if (canDraw) {
                if (!isPinchingRef.current) {
                  linesRef.current.push({ color: '#df15ff', points: [{ x: pX, y: pY }] });
                  isPinchingRef.current = true;
                } else {
                  const currentLine = linesRef.current[linesRef.current.length - 1];
                  if (currentLine) currentLine.points.push({ x: pX, y: pY });
                }
                needsSyncRef.current = true;
              }
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
                        sfx?.playError();
                      } else if (detectedShape !== roleRef.current) {
                        showToast(`⚠ RULE ERROR: You are Player ${roleRef.current}, but you drew a ${detectedShape}!`);
                        sfx?.playError();
                      } else if (boardRef.current[cellIdx] !== null) {
                        showToast(`⚠ RULE ERROR: This block is already occupied!`);
                        sfx?.playError();
                      } else {
                        sfx?.playClick();
                        boardRef.current[cellIdx] = detectedShape;
                        setCurrentTurn(detectedShape === 'X' ? 'O' : 'X');
                        if (dataConnRef.current && dataConnRef.current.open) {
                          dataConnRef.current.send({ type: 'MOVE', cell: cellIdx, role: detectedShape });
                        }
                        checkWinnerLocal(boardRef.current);
                      }
                      needsSyncRef.current = true;
                    } else if (!isBoardMove) {
                      // Outside the grid — leave the raw freehand stroke exactly as drawn, no snapping
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
        ctx.lineWidth = 4;
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
        avatar: localAvatarRef.current,
        isHost: !joinRoomIdRef.current,
        hostRole: roleRef.current,
        timerSetting: turnDurationSettingRef.current
      });
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
        const isReconnect = lastOpponentNameRef.current === payload.name;

        // Host-Side Game State Logic
        if (!joinRoomIdRef.current) {
          if (!isReconnect && boardRef.current.some(c => c !== null)) {
            // New player joined - wipe solo practice
            resetBoard();
            showToast('Grid cleared automatically for the new session.');
          } else if (isReconnect && boardRef.current.some(c => c !== null)) {
            // Opponent reconnected - Dispatch state sync!
            setTimeout(() => {
              if (dataConnRef.current && dataConnRef.current.open) {
                dataConnRef.current.send({
                  type: 'RESUME_STATE',
                  board: boardRef.current,
                  turn: turnRef.current,
                  winner: winnerRef.current,
                  winningLine: winningLineRef.current,
                  scoreboard: scoreboardRef.current
                });
              }
            }, 500);
            showToast('Opponent rejoined. Resuming game...');
          }
        }

        if (payload.timerSetting !== undefined) {
          setTurnDurationSetting(payload.timerSetting);
        }

        let finalRemoteAvatar = payload.avatar;
        // AVATAR COLLISION RESOLUTION (Host only)
        if (!joinRoomIdRef.current && finalRemoteAvatar === localAvatarRef.current) {
          // If collision happens, we just generate a random seed for the opponent
          finalRemoteAvatar = Math.random().toString(36).substring(7);

          setTimeout(() => {
            if (dataConnRef.current && dataConnRef.current.open) {
              dataConnRef.current.send({ type: 'AVATAR_SYNC', avatar: finalRemoteAvatar });
            }
          }, 400);
        }

        lastOpponentNameRef.current = payload.name;
        setRemoteName(payload.name);
        setRemoteAvatar(finalRemoteAvatar);
        sfx?.playNotify();

        // Enforce opposing role on the joining Guest dynamically
        if (payload.isHost && payload.hostRole) {
          const newRole = payload.hostRole === 'X' ? 'O' : 'X';
          setMyRole(newRole);
          showToast(`Connected to Host! You are assigned Player ${newRole}`);
        }
      } else if (payload.type === 'AVATAR_SYNC') {
        setLocalAvatar(payload.avatar);
        localAvatarRef.current = payload.avatar;
        showToast("Avatar in use! You've been reassigned an avatar.");
      } else if (payload.type === 'SYNC_TIMER_SETTING') {
        setTurnDurationSetting(payload.setting);
        showToast(`Turn Timer set to ${payload.setting === 0 ? 'Infinite' : payload.setting + 's'}!`);
      } else if (payload.type === 'TIMEOUT_FORFEIT') {
        setCurrentTurn(roleRef.current);
        showToast("⏳ Opponent ran out of time!");
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
      } else if (payload.type === 'RESUME_STATE') {
        boardRef.current = payload.board;
        setCurrentTurn(payload.turn);
        setWinner(payload.winner);
        setWinningLine(payload.winningLine);
        winnerRef.current = payload.winner;

        if (payload.scoreboard) {
          setScoreboard(payload.scoreboard);
        }

        showToast('Session Restored!');
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
    sfx?.init();
    sfx?.playNotify();
    if (window.__START_AIR_CANVAS__) {
      window.__START_AIR_CANVAS__();
    }
  };

  // --- Aesthetic Victory & Animation Handlers ---
  const [lineCoords, setLineCoords] = useState(null);

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
          localAvatar={localAvatar}
          setLocalAvatar={setLocalAvatar}
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
              <div className={isInCall ? "flex -space-x-3 hover:-space-x-1 transition-all duration-300" : "flex"}>
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden relative bg-surface-container-highest flex items-center justify-center z-10 shadow-lg shadow-primary/20">
                  <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${localAvatar || 'Felix'}&backgroundColor=transparent`} className="w-full h-full drop-shadow-sm" alt="Local Avatar" />
                </div>
                {isInCall && remoteAvatar && (
                  <div className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden relative bg-surface-container-highest flex items-center justify-center z-0 shadow-lg shadow-[#f0f]/20">
                    <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${remoteAvatar}&backgroundColor=transparent`} className="w-full h-full drop-shadow-sm" alt="Remote Avatar" />
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowInfoMenu(!showInfoMenu)}
                  className="p-2 rounded-full hover:bg-white/10 active:bg-white/5 transition-colors flex items-center justify-center text-indigo-200 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[24px]">info</span>
                </button>
                {showInfoMenu && (
                  <div className="absolute right-0 top-[120%] w-[320px] bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-[100] flex flex-col p-5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0ff]/10 to-transparent pointer-events-none -z-10" />
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#0ff] drop-shadow-[0_0_8px_rgba(0,255,255,0.4)] m-0">How To Play</h3>
                      <button onClick={() => setShowInfoMenu(false)} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                    <ul className="text-xs text-indigo-100/90 leading-relaxed space-y-3 font-medium m-0 p-0 list-none">
                      <li className="flex gap-3 items-start"><span className="text-[#39ff14] font-bold">1.</span> Pinch thumb & index finger to draw.</li>
                      <li className="flex gap-3 items-start"><span className="text-[#39ff14] font-bold">2.</span> Open your whole hand fully to erase lines.</li>
                      <li className="flex gap-3 items-start"><span className="text-[#39ff14] font-bold">3.</span> In "Game" mode, draw an 'O' or 'X' in a Grid cell.</li>
                      <li className="flex gap-3 items-start"><span className="text-[#39ff14] font-bold">4.</span> First to get 3 in a row wins the round!</li>
                    </ul>
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

      {/* Media & Canvas Layered */}
      {/* Remote Video Wrapper (Opponent - Now Fullscreen Background) */}
      <div className={`${isInCall ? "absolute inset-0 z-0 pointer-events-none" : "hidden"}`}>
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover transition-opacity duration-1000"
          autoPlay
          playsInline
        ></video>
      </div>

      {/* Local Video Wrapper (You - Fullscreen while waiting, PIP when connected) */}
      <div className={`${isInCall ? "fixed right-6 top-24 z-20 w-48 aspect-video glass-panel rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group bg-black" : "absolute inset-0 z-0 pointer-events-none"} transition-all duration-700 pointer-events-none`}>
        <video
          ref={videoRef}
          className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${!hasStarted ? 'opacity-0' : 'opacity-100'}`}
          autoPlay
          playsInline
          muted
        ></video>
        {isInCall && (
          <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10 transition-opacity">
            <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md">
              You ({myRole})
            </span>
          </div>
        )}
      </div>

      {/* Draggable Grid HUD - only show after AI fully loaded */}
      {hasStarted && isLoaded && showGrid && (() => {

        const handleDragStart = (clientX, clientY) => {
          isDraggingRef.current = true;
          const el = draggableRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          // Freeze position to fixed pixels before dragging
          el.style.right = 'auto';
          el.style.transform = 'none';
          el.style.left = rect.left + 'px';
          el.style.top = rect.top + 'px';
          dragStartRef.current = { mx: clientX, my: clientY, gx: rect.left, gy: rect.top };
        };

        const handleDragMove = (clientX, clientY) => {
          if (!isDraggingRef.current) return;
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const dx = clientX - dragStartRef.current.mx;
            const dy = clientY - dragStartRef.current.my;
            if (draggableRef.current) {
              draggableRef.current.style.left = (dragStartRef.current.gx + dx) + 'px';
              draggableRef.current.style.top = (dragStartRef.current.gy + dy) + 'px';
            }
          });
        };

        const handleDragEnd = () => { isDraggingRef.current = false; };

        return (
          <div
            ref={draggableRef}
            style={{ position: 'fixed', right: '5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', userSelect: 'none' }}
            onMouseMove={e => handleDragMove(e.clientX, e.clientY)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={e => { e.preventDefault(); handleDragMove(e.touches[0].clientX, e.touches[0].clientY); }}
            onTouchEnd={handleDragEnd}
          >

            {/* 3x3 Grid Container Wrapper */}
            <div className="relative group">
              {/* Asymmetric Glow Aura */}
              <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"></div>

              {/* Drag Handle */}
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all group/handle z-10"
                onMouseDown={e => { e.preventDefault(); handleDragStart(e.clientX, e.clientY); }}
                onTouchStart={e => { e.preventDefault(); handleDragStart(e.touches[0].clientX, e.touches[0].clientY); }}
              >
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="opacity-40 group-hover/handle:opacity-80 transition-opacity">
                  <circle cx="2" cy="2" r="1.5" fill="white" /><circle cx="8" cy="2" r="1.5" fill="white" /><circle cx="14" cy="2" r="1.5" fill="white" />
                  <circle cx="2" cy="6" r="1.5" fill="white" /><circle cx="8" cy="6" r="1.5" fill="white" /><circle cx="14" cy="6" r="1.5" fill="white" />
                </svg>
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 group-hover/handle:text-white/60 transition-colors font-bold">drag</span>
              </div>

              {/* The Grid itself */}
              <div ref={gridContainerRef} className="relative grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 grid-glow mt-10">

                {/* Burning Turn Timer SVG Overlay with Sparkle Tip */}
                {isInCall && !winner && turnDurationSetting > 0 && (
                  <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-[60]">
                    {/* Main Perimeter Border */}
                    <rect
                      x="-2" y="-2"
                      width="calc(100% + 4px)" height="calc(100% + 4px)"
                      rx="32" ry="32"
                      fill="none"
                      stroke={timeLeft > (turnDurationSetting * 1000 * 0.5) ? '#39ff14' : timeLeft > (turnDurationSetting * 1000 * 0.2) ? '#ffea00' : '#ff0000'}
                      strokeWidth="6"
                      pathLength="100"
                      strokeDasharray="100 100"
                      strokeDashoffset={100 - (timeLeft / (turnDurationSetting * 1000)) * 100}
                      style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease', strokeLinecap: 'round' }}
                    />
                    {/* Glowing Sparkle Body */}
                    <rect
                      x="-2" y="-2"
                      width="calc(100% + 4px)" height="calc(100% + 4px)"
                      rx="32" ry="32"
                      fill="none"
                      stroke={timeLeft > (turnDurationSetting * 1000 * 0.5) ? '#ffffff' : timeLeft > (turnDurationSetting * 1000 * 0.2) ? '#ffea00' : '#ff0000'}
                      strokeWidth="12"
                      pathLength="100"
                      strokeDasharray="0.01 99.99"
                      strokeDashoffset={100 - (timeLeft / (turnDurationSetting * 1000)) * 100}
                      style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease', strokeLinecap: 'round', filter: 'blur(4px)' }}
                    />
                    {/* Hot Intense Sparkle Core */}
                    <rect
                      x="-2" y="-2"
                      width="calc(100% + 4px)" height="calc(100% + 4px)"
                      rx="32" ry="32"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="6"
                      pathLength="100"
                      strokeDasharray="0.01 99.99"
                      strokeDashoffset={100 - (timeLeft / (turnDurationSetting * 1000)) * 100}
                      style={{ transition: 'stroke-dashoffset 1s linear', strokeLinecap: 'round', filter: 'drop-shadow(0px 0px 8px #ffffff)' }}
                    />
                  </svg>
                )}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => {
                  const cellValue = boardRef.current[index];
                  return (
                    <div id={`tic-cell-${index}`} key={index} className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group/cell">
                      {cellValue === 'X' && (
                        <motion.span
                          initial={{ scale: 0, rotate: -45, opacity: 0 }}
                          animate={{ scale: 2, rotate: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                          className="material-symbols-outlined text-7xl sm:text-7xl text-primary glow-text-primary" style={{ fontVariationSettings: "'wght' 400" }}>close</motion.span>
                      )}
                      {cellValue === 'O' && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 2, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                          className="material-symbols-outlined text-7xl sm:text-7xl text-tertiary glow-text-tertiary" style={{ fontVariationSettings: "'wght' 400" }}>radio_button_unchecked</motion.span>
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
              </div> {/* end gridContainerRef */}
            </div> {/* end group wrapper */}

            {/* Session Metadata */}
            <div className="relative z-20 w-[20rem] sm:w-[24rem] flex justify-between items-center bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-white/10 px-4 py-2 shadow-2xl">
              <div className="flex flex-col">
                <span className="text-[7px] uppercase tracking-[0.2em] text-slate-400 font-bold">Turn</span>
                <span className="text-sm sm:text-base font-medium text-indigo-100" style={{ color: currentTurn === myRole ? '#39ff14' : '#c0c1ff' }}>{currentTurn === myRole ? `${localName || 'You'} (${myRole})` : `${remoteName || 'Opp.'} (${currentTurn})`}</span>
              </div>
              {hasStarted && (
                <div className="flex flex-col items-center justify-center px-3 sm:px-6 border-x border-white/10 hidden sm:flex">
                  <span className="text-[6px] uppercase tracking-[0.25em] text-slate-500 font-bold">Score</span>
                  <div className="flex items-center gap-2 font-mono text-lg sm:text-xl font-bold tracking-widest">
                    <span className={myRole === 'X' ? 'text-[#39ff14]' : 'text-indigo-100'}>{scoreboard.X}</span>
                    <span className="text-slate-600/50 text-[10px]">-</span>
                    <span className={myRole === 'O' ? 'text-[#0ff]' : 'text-indigo-100'}>{scoreboard.O}</span>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-end">
                <span className="text-[7px] uppercase tracking-[0.2em] text-slate-400 font-bold">Status</span>
                <span className="text-sm sm:text-base font-mono text-indigo-100">{winner ? 'Done' : 'Live'}</span>
              </div>
            </div>

          </div>
        );
      })()}

      {/* Legacy Canvas - elevated ABOVE grid so strokes always appear on top */}
      <canvas ref={canvasRef} className={!hasStarted ? styles.hidden : styles.canvas} style={{ zIndex: 60 }}></canvas>

      {/* Bottom Controls Navbar */}
      {isLoaded && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900/60 backdrop-blur-2xl rounded-full px-4 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

          {/* Timer Options Dropdown */}
          {hasStarted && showGrid && (
            <div className="relative flex flex-col items-center gap-1 p-3 transition-transform hover:scale-110 duration-150 border-r border-white/10 mr-1 pr-5 cursor-pointer group"
              onClick={() => setIsTimerMenuOpen(!isTimerMenuOpen)}
            >
              {/* Custom Popover Menu */}
              {isTimerMenuOpen && (
                <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 min-w-[130px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 flex flex-col isolate animate-in fade-in slide-in-from-bottom-4 duration-200">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none -z-10" />

                  <div className="px-3 py-3 text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold border-b border-white/5 text-center bg-black/20">
                    Speed Mode
                  </div>

                  {[10, 15, 20, 30, 0].map(val => (
                    <button
                      key={val}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTurnDurationSetting(val);
                        if (dataConnRef.current && dataConnRef.current.open) {
                          dataConnRef.current.send({ type: 'SYNC_TIMER_SETTING', setting: val });
                        }
                        setIsTimerMenuOpen(false);
                      }}
                      className={`px-4 py-3 text-[11px] font-bold tracking-[0.15em] hover:bg-white/10 active:bg-white/5 transition-colors flex items-center justify-between text-left w-full
                        ${turnDurationSetting === val ? 'text-[#39ff14] bg-[#39ff14]/5' : 'text-indigo-100'}
                      `}
                    >
                      {val === 0 ? 'INF(∞)' : `${val} SEC`}
                      {turnDurationSetting === val && <span className="material-symbols-outlined text-[14px] text-[#39ff14]" style={{ fontVariationSettings: "'wght' 300" }}>check</span>}
                    </button>
                  ))}
                </div>
              )}

              <span className="material-symbols-outlined text-xl text-yellow-400 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>hourglass_bottom</span>
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-widest text-[#39ff14] group-hover:text-white transition-colors">
                {turnDurationSetting === 0 ? 'INF(∞)' : `${turnDurationSetting}s`}
              </span>
            </div>
          )}

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

          {/* Doodle Outside Grid Toggle */}
          <button
            onClick={() => setIsDoodleEnabled(!isDoodleEnabled)}
            className={`flex flex-col items-center gap-1 ${isDoodleEnabled ? 'bg-indigo-500/20 text-indigo-100 rounded-full' : 'text-slate-400'} p-3 transition-transform hover:text-indigo-200 hover:scale-110 active:scale-90 duration-150`}>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{isDoodleEnabled ? 'gesture' : 'draw_abstract'}</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-medium uppercase tracking-widest">Doodle</span>
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
