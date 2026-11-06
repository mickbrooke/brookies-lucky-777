/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* =========================================================================
   1. SYNTHESIZED WEB AUDIO ENGINE
   ========================================================================= */
class PubAudioEngine {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  resume(): Promise<void> {
    if (this.muted) return Promise.resolve();
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      return this.ctx.resume();
    }
    return Promise.resolve();
  }

  playReelStop() {
    if (this.muted) return;
    this.resume();
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;

    // Low mechanical thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);

    // Clunk latch
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = 'sawtooth';
    snap.frequency.setValueAtTime(400, now);
    snap.frequency.exponentialRampToValueAtTime(70, now + 0.03);
    snapGain.gain.setValueAtTime(0.35, now);
    snapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    snap.connect(snapGain);
    snapGain.connect(ctx.destination);
    snap.start(now);
    snap.stop(now + 0.04);
  }

  playSpinTick() {
    if (this.muted) return;
    this.resume();
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(240, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }

  playNudgeStep() {
    if (this.muted) return;
    this.resume();
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playButtonPress() {
    if (this.muted) return;
    this.resume();
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  playCoinDrop() {
    if (this.muted) return;
    this.resume();
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100 + i * 180, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  }

  playWinBleeps() {
    if (this.muted) return;
    this.resume();
    const ctx = this.ctx;
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const t = now + (idx * 0.08);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.075);
    });
  }

  playBuzzer() {
    if (this.muted) return;
    this.resume();
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(110, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.21);
  }
}

const audio = new PubAudioEngine();

/* =========================================================================
   2. SYMBOLS & MECHANICAL REEL DEFINITION
   ========================================================================= */
interface SymbolDef {
  id: string;
  name: string;
  payout: number;
  isSeven?: boolean;
  isBar?: boolean;
  emoji?: string;
}

const SYMBOLS: Record<string, SymbolDef> = {
  SEVEN:  { id: 'SEVEN',  name: 'Red 7',   payout: 10.00, isSeven: true },
  BAR:    { id: 'BAR',    name: 'Bar',     payout: 5.00,  isBar: true },
  BELL:   { id: 'BELL',   name: 'Bell',    payout: 3.00,  emoji: '🔔' },
  MELON:  { id: 'MELON',  name: 'Melon',   payout: 2.00,  emoji: '🍉' },
  GRAPE:  { id: 'GRAPE',  name: 'Grapes',  payout: 1.50,  emoji: '🍇' },
  ORANGE: { id: 'ORANGE', name: 'Orange',  payout: 1.00,  emoji: '🍊' },
  LEMON:  { id: 'LEMON',  name: 'Lemon',   payout: 0.50,  emoji: '🍋' },
  CHERRY: { id: 'CHERRY', name: 'Cherry',  payout: 0.40,  emoji: '🍒' }
};

const REEL_STRIP_1: SymbolDef[] = [
  SYMBOLS.CHERRY, SYMBOLS.LEMON, SYMBOLS.BELL, SYMBOLS.ORANGE,
  SYMBOLS.GRAPE, SYMBOLS.BAR, SYMBOLS.CHERRY, SYMBOLS.MELON,
  SYMBOLS.BAR, SYMBOLS.LEMON, SYMBOLS.ORANGE, SYMBOLS.SEVEN,
  SYMBOLS.BELL, SYMBOLS.CHERRY, SYMBOLS.MELON, SYMBOLS.GRAPE
];

const REEL_STRIP_2: SymbolDef[] = [
  SYMBOLS.LEMON, SYMBOLS.CHERRY, SYMBOLS.ORANGE, SYMBOLS.BELL,
  SYMBOLS.MELON, SYMBOLS.CHERRY, SYMBOLS.BAR, SYMBOLS.GRAPE,
  SYMBOLS.SEVEN, SYMBOLS.LEMON, SYMBOLS.BAR, SYMBOLS.ORANGE,
  SYMBOLS.BELL, SYMBOLS.GRAPE, SYMBOLS.MELON, SYMBOLS.CHERRY
];

const REEL_STRIP_3: SymbolDef[] = [
  SYMBOLS.ORANGE, SYMBOLS.CHERRY, SYMBOLS.LEMON, SYMBOLS.MELON,
  SYMBOLS.BELL, SYMBOLS.GRAPE, SYMBOLS.CHERRY, SYMBOLS.BAR,
  SYMBOLS.BAR, SYMBOLS.LEMON, SYMBOLS.SEVEN, SYMBOLS.ORANGE,
  SYMBOLS.MELON, SYMBOLS.BELL, SYMBOLS.CHERRY, SYMBOLS.GRAPE
];

const strips = [REEL_STRIP_1, REEL_STRIP_2, REEL_STRIP_3];

export default function App() {
  // Game state
  const [bank, setBank] = useState<number>(10.00);
  const [lastWin, setLastWin] = useState<number>(0.00);
  const [stakeIndex, setStakeIndex] = useState<number>(0);
  const stakes = [0.20, 0.50, 1.00];

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reelOffsets, setReelOffsets] = useState<[number, number, number]>([0, 5, 10]);
  const [holdsActive, setHoldsActive] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [holdsOffered, setHoldsOffered] = useState<boolean>(false);
  const [nudgesAvailable, setNudgesAvailable] = useState<number>(0);
  const [winningRowKey, setWinningRowKey] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('READY TO PLAY');
  const [chaserStep, setChaserStep] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // References for animation
  const reelOffsetsRef = useRef<[number, number, number]>([0, 5, 10]);
  const holdsActiveRef = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const isSpinningRef = useRef<boolean>(false);
  const nudgesAvailableRef = useRef<number>(0);
  const holdsOfferedRef = useRef<boolean>(false);
  const stakeIndexRef = useRef<number>(0);
  const bankRef = useRef<number>(10.00);

  // Canvas refs and container ref for responsive mobile scaling
  const reelContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = [
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null)
  ];

  // Keep refs in sync with state
  useEffect(() => {
    reelOffsetsRef.current = reelOffsets;
  }, [reelOffsets]);
  useEffect(() => {
    holdsActiveRef.current = holdsActive;
  }, [holdsActive]);
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);
  useEffect(() => {
    nudgesAvailableRef.current = nudgesAvailable;
  }, [nudgesAvailable]);
  useEffect(() => {
    holdsOfferedRef.current = holdsOffered;
  }, [holdsOffered]);
  useEffect(() => {
    stakeIndexRef.current = stakeIndex;
  }, [stakeIndex]);
  useEffect(() => {
    bankRef.current = bank;
  }, [bank]);

  // Chaser bulbs interval
  useEffect(() => {
    const timer = setInterval(() => {
      setChaserStep(prev => (prev + 1) % 9);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  /* =========================================================================
     CANVAS RENDERING (PURE DOWNWARD REEL ROLL)
     ========================================================================= */
  const drawSymbol = (
    ctx: CanvasRenderingContext2D,
    symbol: SymbolDef,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    isPayline: boolean
  ) => {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(centerX - width * 0.46, centerY - height * 0.44, width * 0.92, height * 0.88);

    if (symbol.isSeven) {
      // Authentic Bold Red 7 with gold border outline centered on reel
      ctx.font = `900 ${Math.floor(height * 0.72)}px 'Teko', 'Impact', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#facc15';
      ctx.strokeText('7', centerX, centerY);

      ctx.fillStyle = '#dc2626';
      ctx.fillText('7', centerX, centerY);
    } else if (symbol.isBar) {
      // Classic AWP Black & Gold BAR plaque centered on reel
      const barW = width * 0.8;
      const barH = height * 0.52;
      const barX = centerX - barW / 2;
      const barY = centerY - barH / 2;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.strokeRect(barX, barY, barW, barH);

      ctx.font = `900 ${Math.floor(height * 0.32)}px 'Teko', 'Impact', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#facc15';
      ctx.fillText('BAR', centerX, centerY);
    } else {
      // Fruit & Bell Emojis centered on reel
      ctx.font = `${Math.floor(height * 0.56)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol.emoji || '', centerX, centerY);
    }

    if (isPayline) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - width * 0.46, centerY - height * 0.44, width * 0.92, height * 0.88);
    }
    ctx.restore();
  };

  const renderReel = useCallback((reelIndex: number, currentOffsets: [number, number, number]) => {
    const canvas = canvasRefs[reelIndex].current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const strip = strips[reelIndex];
    const w = canvas.width;
    const h = canvas.height;
    const symbolHeight = h / 3;

    ctx.clearRect(0, 0, w, h);

    // Background reel cylinder shading
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.18, '#f1f5f9');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(0.82, '#f1f5f9');
    grad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const offset = currentOffsets[reelIndex];
    const baseIndex = Math.floor(offset);
    const frac = offset - baseIndex;

    // Rows: -1 (above), 0 (top visible), 1 (center payline), 2 (bottom visible), 3 (below)
    for (let row = -1; row <= 3; row++) {
      const symbolIndex = ((baseIndex - row + 1) % strip.length + strip.length) % strip.length;
      const symbol = strip[symbolIndex];
      const centerY = (row + frac) * symbolHeight + (symbolHeight / 2);

      const distFromCenter = Math.abs(centerY - (h / 2));
      const scaleY = 1 - Math.min(0.2, (distFromCenter / (h / 2)) * 0.2);

      ctx.save();
      ctx.translate(w / 2, centerY);
      ctx.scale(1, scaleY);
      drawSymbol(ctx, symbol, 0, 0, w, symbolHeight, row === 1);
      ctx.restore();
    }

    // Cylinder top & bottom shadows
    const shade = ctx.createLinearGradient(0, 0, 0, h);
    shade.addColorStop(0, 'rgba(0,0,0,0.5)');
    shade.addColorStop(0.2, 'rgba(0,0,0,0)');
    shade.addColorStop(0.8, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const renderAllReels = useCallback((currentOffsets: [number, number, number]) => {
    for (let i = 0; i < 3; i++) {
      renderReel(i, currentOffsets);
    }
  }, [renderReel]);

  const resizeCanvases = useCallback(() => {
    canvasRefs.forEach(ref => {
      const canvas = ref.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    });
    renderAllReels(reelOffsetsRef.current);
  }, [renderAllReels]);

  // Resize and initial render with mobile ResizeObserver
  useEffect(() => {
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    let observer: ResizeObserver | null = null;
    if (reelContainerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        resizeCanvases();
      });
      observer.observe(reelContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvases);
      if (observer) observer.disconnect();
    };
  }, [resizeCanvases]);

  useEffect(() => {
    renderAllReels(reelOffsets);
  }, [reelOffsets, renderAllReels]);

  /* =========================================================================
     PAYLINE CHECK & WIN LOGIC
     ========================================================================= */
  const getCenterSymbol = (reelIndex: number, currentOffsets: [number, number, number]) => {
    const strip = strips[reelIndex];
    const idx = ((Math.round(currentOffsets[reelIndex])) % strip.length + strip.length) % strip.length;
    return strip[idx];
  };

  const checkWinLine = (currentOffsets: [number, number, number]) => {
    const s1 = getCenterSymbol(0, currentOffsets);
    const s2 = getCenterSymbol(1, currentOffsets);
    const s3 = getCenterSymbol(2, currentOffsets);
    const currentStake = stakes[stakeIndexRef.current];
    const stakeRatio = currentStake / 0.20;

    // 3 matching symbols
    if (s1.id === s2.id && s2.id === s3.id) {
      return {
        won: true,
        type: '3_OF_A_KIND',
        rowKey: s1.id === 'CHERRY' ? 'CHERRY3' : s1.id,
        symbol: s1,
        payout: s1.payout * stakeRatio
      };
    }

    // Cherry wins: 2 Cherries anywhere on payline or 1 Cherry
    const cherries = [s1, s2, s3].filter(s => s.id === 'CHERRY').length;
    if (cherries === 2) {
      return {
        won: true,
        type: '2_CHERRIES',
        rowKey: 'CHERRY2',
        symbol: SYMBOLS.CHERRY,
        payout: 0.30 * stakeRatio
      };
    }
    if (cherries === 1) {
      return {
        won: true,
        type: '1_CHERRY',
        rowKey: 'CHERRY1',
        symbol: SYMBOLS.CHERRY,
        payout: 0.20 * stakeRatio
      };
    }

    return { won: false, payout: 0, rowKey: null };
  };

  const evaluatePubFeatures = () => {
    const holdRoll = Math.random();
    if (holdRoll < 0.38) {
      setHoldsOffered(true);
      holdsOfferedRef.current = true;
      setStatusText('HOLDS OFFERED! PRESS HOLD');
      audio.playWinBleeps();
    } else {
      setHoldsOffered(false);
      holdsOfferedRef.current = false;
    }

    const nudgeRoll = Math.random();
    if (holdRoll >= 0.38 && nudgeRoll < 0.30) {
      const count = Math.floor(Math.random() * 3) + 1;
      setNudgesAvailable(count);
      nudgesAvailableRef.current = count;
      setStatusText(`${count} NUDGE${count > 1 ? 'S' : ''} AWARDED!`);
      audio.playWinBleeps();
    }

    if (holdRoll >= 0.38 && nudgeRoll >= 0.30) {
      setStatusText('NO WIN - SPIN AGAIN!');
    }
  };

  const onReelsStopped = (finalOffsets: [number, number, number]) => {
    setIsSpinning(false);
    isSpinningRef.current = false;

    const result = checkWinLine(finalOffsets);

    if (result.won && result.payout) {
      audio.playWinBleeps();
      setTimeout(() => audio.playCoinDrop(), 320);

      setLastWin(result.payout);
      setBank(prev => prev + result.payout);
      setWinningRowKey(result.rowKey);
      setStatusText(`WINNER! £${result.payout.toFixed(2)}`);
    } else {
      setWinningRowKey(null);
      evaluatePubFeatures();
    }
  };

  const spinReels = () => {
    if (isSpinningRef.current || nudgesAvailableRef.current > 0) return;

    const currentStake = stakes[stakeIndexRef.current];
    if (bankRef.current < currentStake) {
      setStatusText('LOW BANK! INSERT COIN');
      audio.playBuzzer();
      return;
    }

    audio.playButtonPress();
    setBank(prev => prev - currentStake);
    setIsSpinning(true);
    isSpinningRef.current = true;
    setWinningRowKey(null);
    setStatusText('SPINNING...');

    const currentHolds = holdsActiveRef.current;
    const reelsToSpin = [
      !currentHolds[0],
      !currentHolds[1],
      !currentHolds[2]
    ];

    // Reset active holds & nudges
    setHoldsOffered(false);
    holdsOfferedRef.current = false;
    setHoldsActive([false, false, false]);
    holdsActiveRef.current = [false, false, false];
    setNudgesAvailable(0);
    nudgesAvailableRef.current = 0;

    const durations = [1100, 1600, 2100];
    const startTimes = [performance.now(), performance.now(), performance.now()];
    const initialOffsets = [...reelOffsetsRef.current] as [number, number, number];
    const reelStopped = [!reelsToSpin[0], !reelsToSpin[1], !reelsToSpin[2]];

    const stepsToMove = [
      reelsToSpin[0] ? 24 + Math.floor(Math.random() * 16) : 0,
      reelsToSpin[1] ? 36 + Math.floor(Math.random() * 16) : 0,
      reelsToSpin[2] ? 48 + Math.floor(Math.random() * 16) : 0
    ];

    const targetOffsets = [
      initialOffsets[0] + stepsToMove[0],
      initialOffsets[1] + stepsToMove[1],
      initialOffsets[2] + stepsToMove[2]
    ];

    let lastTickTime = 0;

    const animFrame = (now: number) => {
      let allStopped = true;
      const current = [...reelOffsetsRef.current] as [number, number, number];

      for (let i = 0; i < 3; i++) {
        if (!reelsToSpin[i]) continue;

        const elapsed = now - startTimes[i];
        const dur = durations[i];

        if (elapsed < dur) {
          allStopped = false;
          const p = elapsed / dur;
          const easeOut = 1 - Math.pow(1 - p, 3);
          current[i] = initialOffsets[i] + (stepsToMove[i] * easeOut);

          if (now - lastTickTime > 75) {
            audio.playSpinTick();
            lastTickTime = now;
          }
        } else {
          if (!reelStopped[i]) {
            current[i] = targetOffsets[i];
            reelStopped[i] = true;
            audio.playReelStop();
          }
        }
      }

      reelOffsetsRef.current = current;
      renderAllReels(current);

      if (!allStopped) {
        requestAnimationFrame(animFrame);
      } else {
        const final: [number, number, number] = [
          Math.round(current[0]) % strips[0].length,
          Math.round(current[1]) % strips[1].length,
          Math.round(current[2]) % strips[2].length
        ];
        reelOffsetsRef.current = final;
        setReelOffsets(final);
        renderAllReels(final);
        onReelsStopped(final);
      }
    };

    requestAnimationFrame(animFrame);
  };

  /* =========================================================================
     NUDGE LOGIC
     ========================================================================= */
  const executeNudge = (reelIndex: number) => {
    if (nudgesAvailableRef.current <= 0 || isSpinningRef.current) return;

    audio.playNudgeStep();
    const newNudges = nudgesAvailableRef.current - 1;
    setNudgesAvailable(newNudges);
    nudgesAvailableRef.current = newNudges;

    const current = [...reelOffsetsRef.current] as [number, number, number];
    current[reelIndex] = (current[reelIndex] + 1) % strips[reelIndex].length;
    reelOffsetsRef.current = current;
    setReelOffsets(current);
    renderReel(reelIndex, current);

    const result = checkWinLine(current);
    if (result.won && result.payout) {
      setNudgesAvailable(0);
      nudgesAvailableRef.current = 0;
      audio.playWinBleeps();
      setTimeout(() => audio.playCoinDrop(), 300);

      setLastWin(result.payout);
      setBank(prev => prev + result.payout);
      setWinningRowKey(result.rowKey);
      setStatusText(`NUDGE WIN! £${result.payout.toFixed(2)}`);
    } else {
      if (newNudges === 0) {
        setStatusText('NUDGES COMPLETED');
      } else {
        setStatusText(`${newNudges} NUDGE${newNudges > 1 ? 'S' : ''} LEFT`);
      }
    }
  };

  const handleReelButtonClick = (idx: number) => {
    if (isSpinningRef.current) return;

    if (nudgesAvailableRef.current > 0) {
      executeNudge(idx);
    } else if (holdsOfferedRef.current) {
      audio.playButtonPress();
      setHoldsActive(prev => {
        const next: [boolean, boolean, boolean] = [...prev];
        next[idx] = !next[idx];
        holdsActiveRef.current = next;
        return next;
      });
    }
  };

  const insertCoin = () => {
    audio.playCoinDrop();
    setBank(prev => prev + 5.00);
    setStatusText('£5.00 INSERTED! READY TO PLAY');
  };

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAudioEnabled(prev => {
      const next = !prev;
      audio.setMuted(!next);
      if (next) {
        audio.resume().then(() => {
          audio.playButtonPress();
        });
      }
      return next;
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        spinReels();
      } else if (e.key === '1') {
        handleReelButtonClick(0);
      } else if (e.key === '2') {
        handleReelButtonClick(1);
      } else if (e.key === '3') {
        handleReelButtonClick(2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Bulb colors cycle
  const bulbColors = ['lit-yellow', 'lit-red', 'lit-green', 'lit-blue'];

  const currentStakeVal = stakes[stakeIndex];

  return (
    <div
      className="min-h-screen sm:min-h-[100dvh] text-slate-100 flex flex-col items-center justify-center p-1 sm:p-2 select-none overflow-x-hidden"
      onClick={() => audio.resume()}
    >
      {/* Mobile-optimized Pub Machine Cabinet Frame */}
      <main className="w-full max-w-[420px] cabinet-casing rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex flex-col relative my-auto shadow-2xl">

        {/* Header Marquee & Lights */}
        <header className="rounded-xl bg-gradient-to-b from-amber-950 via-red-950 to-stone-900 border-2 border-amber-600/70 p-1.5 sm:p-2 text-center shadow-lg mb-1.5 sm:mb-2">
          {/* Top Marquee Bulb Chaser */}
          <div className="flex justify-between px-1 sm:px-2 mb-0.5 sm:mb-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => {
              const isActive = (idx + chaserStep) % 2 === 0;
              const colorClass = isActive ? bulbColors[(idx + chaserStep) % bulbColors.length] : '';
              return <div key={idx} className={`bulb ${colorClass}`} />;
            })}
          </div>

          {/* Marquee Title */}
          <div className="text-center py-0.5 sm:py-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-red-500 drop-shadow-[0_2px_6px_rgba(239,68,68,0.7)] font-bezel leading-none">
              BROOKIE'S LUCKY 7
            </h1>
          </div>
        </header>

        {/* Classic Upper Glass Marquee Paytable */}
        <section
          onClick={() => setShowModal(true)}
          className="glass-paytable border-2 border-amber-500/50 rounded-xl p-1.5 sm:p-2 mb-1.5 sm:mb-2 shadow-inner cursor-pointer transition hover:border-amber-400"
          title="Click to view paytable details"
        >
          <div className="grid grid-cols-2 gap-x-1.5 sm:gap-x-2 gap-y-0.5 sm:gap-y-1 text-[8.5px] xs:text-[9.5px] sm:text-[10px]">
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1 sm:px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'SEVEN' ? 'highlight' : ''}`}>
              <span className="truncate pr-1"><span className="text-red-500 font-black">7 7 7</span> <span className="font-bold text-red-400">Red 7s</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">£10.00</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'BAR' ? 'highlight' : ''}`}>
              <span className="truncate pr-1"><span className="text-amber-400 font-black">BAR BAR BAR</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">£5.00</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'BELL' ? 'highlight' : ''}`}>
              <span className="truncate pr-1">🔔🔔🔔 <span className="font-bold text-slate-200">Bells</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">£3.00</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'MELON' ? 'highlight' : ''}`}>
              <span className="truncate pr-1">🍉🍉🍉 <span className="font-bold text-slate-200">Melons</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">£2.00</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'GRAPE' ? 'highlight' : ''}`}>
              <span className="truncate pr-1">🍇🍇🍇 <span className="font-bold text-slate-200">Grapes</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">£1.50</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'ORANGE' ? 'highlight' : ''}`}>
              <span className="truncate pr-1">🍊🍊🍊 <span className="font-bold text-slate-200">Oranges</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">£1.00</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'LEMON' ? 'highlight' : ''}`}>
              <span className="truncate pr-1">🍋🍋🍋 <span className="font-bold text-slate-200">Lemons</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">50p</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'CHERRY3' ? 'highlight' : ''}`}>
              <span className="truncate pr-1">🍒🍒🍒 <span className="font-bold text-slate-200">3x Cherry</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">40p</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'CHERRY2' ? 'highlight' : ''}`}>
              <span className="truncate pr-1">🍒🍒 Any <span className="font-bold text-slate-200">2x Cherry</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">30p</span>
            </div>
            <div className={`paytable-row flex items-center justify-between bg-black/40 px-1.5 py-0.5 rounded border border-stone-800 ${winningRowKey === 'CHERRY1' ? 'highlight' : ''}`}>
              <span className="truncate pr-1">🍒 Any Any <span className="font-bold text-slate-200">1x Cherry</span></span>
              <span className="font-led text-yellow-400 text-[8px] sm:text-[9px] shrink-0">20p</span>
            </div>
          </div>
        </section>

        {/* Mechanical 3-Reel Window */}
        <section className="relative bg-zinc-900 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border-3 sm:border-4 border-stone-700 shadow-2xl mb-1.5 sm:mb-2">
          {/* Payline side arrows */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full border border-white animate-pulse" />
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full border border-white animate-pulse" />
          </div>

          <div
            ref={reelContainerRef}
            className="reel-viewport rounded-lg sm:rounded-xl relative h-36 sm:h-44 md:h-48 w-full grid grid-cols-3 gap-1 bg-black p-1"
          >
            {/* Payline Center Wire */}
            <div className="payline-wire absolute top-1/2 left-0 right-0 z-10 -translate-y-1/2" />
            {/* Gloss Reflection */}
            <div className="reel-glass-reflection absolute inset-0 z-10 pointer-events-none rounded-lg" />

            {/* 3 Reel Canvases */}
            <div className="relative w-full h-full bg-white rounded overflow-hidden border border-zinc-600">
              <canvas ref={canvasRefs[0]} className="w-full h-full block" />
            </div>
            <div className="relative w-full h-full bg-white rounded overflow-hidden border border-zinc-600">
              <canvas ref={canvasRefs[1]} className="w-full h-full block" />
            </div>
            <div className="relative w-full h-full bg-white rounded overflow-hidden border border-zinc-600">
              <canvas ref={canvasRefs[2]} className="w-full h-full block" />
            </div>
          </div>

          {/* Feature Status Ribbon */}
          <div className="mt-1.5 sm:mt-2 flex items-center justify-between px-1.5 bg-black/85 rounded border border-amber-600/40 py-0.5 sm:py-1 min-h-[24px] sm:min-h-[26px]">
            {nudgesAvailable > 0 && (
              <div className="flex items-center gap-1 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/50 animate-pulse">
                <span className="text-[8.5px] sm:text-[9px] text-emerald-400 font-bold uppercase">NUDGES:</span>
                <span className="text-[11px] sm:text-xs font-led text-emerald-300">{nudgesAvailable}</span>
              </div>
            )}
            <div className={`text-[8.5px] sm:text-[9px] font-bold text-emerald-400 font-led tracking-wider truncate ${
              nudgesAvailable > 0 ? 'text-right' : 'w-full text-center'
            }`}>
              {statusText}
            </div>
          </div>
        </section>

        {/* Contextual Illuminated Arcade Buttons (Hold in Amber / Nudge in Vivid Green) */}
        <section className="grid grid-cols-3 gap-2 sm:gap-3 mb-1.5 sm:mb-2 px-0.5">
          {[0, 1, 2].map(idx => {
            const isHeld = holdsActive[idx];
            const canNudge = nudgesAvailable > 0 && !isSpinning;
            const canHold = holdsOffered && !isSpinning;
            const isDisabled = (!canNudge && !canHold && !isHeld);

            let btnColorClasses = '';
            let btnStateClasses = '';
            let btnLabel: React.ReactNode = null;

            if (canNudge) {
              // Distinct Electric Emerald Green for Nudges (avoids confusion with amber Hold)
              btnColorClasses = 'bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-700 border-2 border-emerald-300';
              btnStateClasses = 'flashing-nudge';
              btnLabel = (
                <span className="font-bezel font-black text-base sm:text-lg tracking-wider text-emerald-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-0.5">
                  NUDGE ▼
                </span>
              );
            } else if (isHeld) {
              // Firmly held reel in glowing gold/amber
              btnColorClasses = 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 border-2 border-yellow-200';
              btnStateClasses = 'pressed brightness-125';
              btnLabel = (
                <span className="font-bezel font-black text-base sm:text-lg tracking-wider text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  HELD
                </span>
              );
            } else if (canHold) {
              // Classic Amber/Orange for Holds
              btnColorClasses = 'bg-gradient-to-b from-amber-500 via-orange-500 to-amber-700 border-2 border-amber-300';
              btnStateClasses = 'flashing-hold';
              btnLabel = (
                <span className="font-bezel font-black text-base sm:text-lg tracking-wider text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  HOLD
                </span>
              );
            } else {
              // Idle unlit arcade button
              btnColorClasses = 'bg-gradient-to-b from-amber-600/40 via-orange-700/30 to-amber-900/40 border-2 border-amber-800/50';
              btnLabel = null;
            }

            return (
              <button
                key={idx}
                disabled={isDisabled}
                onClick={() => handleReelButtonClick(idx)}
                aria-label={`Reel ${idx + 1} ${canNudge ? 'Nudge' : 'Hold'}`}
                className={`awp-btn h-10 sm:h-12 rounded-lg sm:rounded-xl shadow-lg disabled:opacity-25 disabled:pointer-events-none transition-all flex items-center justify-center relative overflow-hidden ${btnColorClasses} ${btnStateClasses}`}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-white/20 pointer-events-none" />
                <div className="relative z-10">{btnLabel}</div>
              </button>
            );
          })}
        </section>

        {/* LED Meters */}
        <section className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 bg-black/60 p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-stone-700">
          <div className="led-display rounded-lg p-0.5 sm:p-1 text-center">
            <div className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-slate-400 font-semibold">BANK</div>
            <div className="text-[11px] sm:text-xs font-led text-emerald-400">£{bank.toFixed(2)}</div>
          </div>
          <div className="led-display rounded-lg p-0.5 sm:p-1 text-center">
            <div className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-slate-400 font-semibold">LAST WIN</div>
            <div className="text-[11px] sm:text-xs font-led text-yellow-300">£{lastWin.toFixed(2)}</div>
          </div>
          <button
            onClick={() => {
              if (!isSpinning) {
                audio.playButtonPress();
                setStakeIndex(prev => (prev + 1) % stakes.length);
              }
            }}
            title="Click to cycle stake"
            className="led-display rounded-lg p-0.5 sm:p-1 text-center hover:border-sky-500 transition cursor-pointer"
          >
            <div className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-slate-400 font-semibold">STAKE</div>
            <div className="text-[11px] sm:text-xs font-led text-sky-400">
              {currentStakeVal < 1.00 ? `${Math.round(currentStakeVal * 100)}p` : `£${currentStakeVal.toFixed(2)}`}
            </div>
          </button>
        </section>

        {/* Master Console: Single Full-Width SPIN Button */}
        <footer className="w-full">
          <button
            onClick={spinReels}
            disabled={isSpinning || nudgesAvailable > 0}
            className={`w-full awp-btn bg-gradient-to-b from-red-500 via-red-600 to-red-800 hover:from-red-400 hover:to-red-700 active:from-red-700 active:to-red-900 text-white font-black text-xl sm:text-2xl py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl border-3 sm:border-4 border-amber-300 font-bezel tracking-widest shadow-2xl flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none ${
              isSpinning || nudgesAvailable > 0 ? '' : 'animate-pulse'
            }`}
          >
            SPIN
          </button>
        </footer>

        {/* Bottom Actions */}
        <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-400 px-1 font-semibold">
          <button
            onClick={insertCoin}
            className="bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/40 px-2 py-0.5 rounded text-[9px] sm:text-[10px] transition cursor-pointer"
          >
            + INSERT £5 COIN
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="text-amber-400/80 hover:text-amber-300 underline cursor-pointer text-[9px] sm:text-[10px]"
          >
            PAYTABLE
          </button>
          <button
            onClick={toggleAudio}
            className={`px-1.5 py-0.5 rounded border transition cursor-pointer text-[9px] sm:text-[10px] flex items-center gap-1 font-semibold ${
              audioEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200'
            }`}
            title={audioEnabled ? "Click to mute audio" : "Click to unmute audio"}
            aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
          >
            {audioEnabled ? '🔊 AUDIO ACTIVE' : '🔇 AUDIO MUTED'}
          </button>
        </div>
      </main>

      {/* Paytable Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3">
          <div className="bg-slate-900 border-2 border-amber-500 max-w-sm w-full rounded-2xl p-4 text-slate-100 flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-500/40 pb-2">
              <h3 className="text-lg font-bezel text-amber-400 font-bold tracking-wide">BROOKIE'S LUCKY 7 PAYTABLE</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5"><span className="text-red-500 font-black">7 7 7</span> <span>Jackpot Red 7</span></span>
                <span className="font-led text-yellow-400">£10.00</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5"><span className="text-amber-400 font-black">BAR BAR BAR</span> <span>Golden Bar</span></span>
                <span className="font-led text-yellow-400">£5.00</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5">🔔 🔔 🔔 <span>Golden Bell</span></span>
                <span className="font-led text-yellow-400">£3.00</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5">🍉 🍉 🍉 <span>Juicy Melon</span></span>
                <span className="font-led text-yellow-400">£2.00</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5">🍇 🍇 🍇 <span>Grapes</span></span>
                <span className="font-led text-yellow-400">£1.50</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5">🍊 🍊 🍊 <span>Orange</span></span>
                <span className="font-led text-yellow-400">£1.00</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5">🍋 🍋 🍋 <span>Lemon</span></span>
                <span className="font-led text-yellow-400">50p</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5">🍒 🍒 🍒 <span>3x Cherries</span></span>
                <span className="font-led text-yellow-400">40p</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5">🍒 🍒 Any <span>2x Cherries</span></span>
                <span className="font-led text-yellow-400">30p</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="flex items-center gap-1.5">🍒 Any Any <span>1x Cherry</span></span>
                <span className="font-led text-yellow-400">20p</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="awp-btn bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold py-2 rounded-xl text-center font-bezel tracking-wider cursor-pointer"
            >
              CLOSE PAYTABLE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
