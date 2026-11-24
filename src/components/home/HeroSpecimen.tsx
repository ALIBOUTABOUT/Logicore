import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CurvePreset {
  id: string;
  label: string;
  formula: string;
  code: string;
  fn: (x: number) => number;
  xRange: [number, number];
  yRange: [number, number];
}

const PRESETS: CurvePreset[] = [
  {
    id: 'damped',
    label: 'Damped Wave',
    formula: 'f(x) = e⁻⁰·²ˣ · sin(2.6x)',
    code: 'Math.exp(-0.2 * x) * Math.sin(2.6 * x)',
    fn: (x) => Math.exp(-0.2 * x) * Math.sin(2.6 * x),
    xRange: [0, 6.28],
    yRange: [-1, 1],
  },
  {
    id: 'harmonic',
    label: 'Harmonic',
    formula: 'f(x) = 0.65·sin(x) + 0.35·cos(3x)',
    code: '0.65 * Math.sin(x) + 0.35 * Math.cos(3 * x)',
    fn: (x) => 0.65 * Math.sin(x) + 0.35 * Math.cos(3 * x),
    xRange: [-3.14, 3.14],
    yRange: [-1.1, 1.1],
  },
  {
    id: 'sigmoid',
    label: 'Sigmoid',
    formula: 'σ(x) = 1 / (1 + e⁻¹·⁴ˣ)',
    code: '1 / (1 + Math.exp(-1.4 * x))',
    fn: (x) => 1 / (1 + Math.exp(-1.4 * x)),
    xRange: [-4, 4],
    yRange: [-0.15, 1.15],
  },
];

const SVG_W = 380;
const SVG_H = 148;
const PAD_X = 22;
const PAD_Y = 18;

export function HeroSpecimen() {
  const [activeId, setActiveId] = useState<string>(PRESETS[0].id);
  const [selectedIdx, setSelectedIdx] = useState<number>(4);

  const preset = useMemo(
    () => PRESETS.find(p => p.id === activeId) ?? PRESETS[0],
    [activeId]
  );

  // Sample continuous curve path + 9 discrete plotted points (echoing the logo's curve + dots)
  const { pathD, samplePoints, zeroY } = useMemo(() => {
    const [xMin, xMax] = preset.xRange;
    const [yMin, yMax] = preset.yRange;
    const plotW = SVG_W - PAD_X * 2;
    const plotH = SVG_H - PAD_Y * 2;

    const toSvgX = (x: number) => PAD_X + ((x - xMin) / (xMax - xMin)) * plotW;
    const toSvgY = (y: number) => PAD_Y + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    const steps = 72;
    const cmds: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = preset.fn(x);
      const sx = toSvgX(x).toFixed(1);
      const sy = toSvgY(y).toFixed(1);
      cmds.push(`${i === 0 ? 'M' : 'L'} ${sx} ${sy}`);
    }

    const ptsCount = 9;
    const pts = Array.from({ length: ptsCount }, (_, i) => {
      const x = xMin + ((i + 0.5) / ptsCount) * (xMax - xMin);
      const y = preset.fn(x);
      return {
        x,
        y,
        sx: toSvgX(x),
        sy: toSvgY(y),
      };
    });

    const zy = toSvgY(0);

    return { pathD: cmds.join(' '), samplePoints: pts, zeroY: zy };
  }, [preset]);

  const activePoint = samplePoints[selectedIdx] ?? samplePoints[0];

  return (
    <div className="border border-rule bg-paper-stock">
      {/* Top plate: unframed LogiCore seal */}
      <div className="relative p-7 sm:p-8 flex items-center justify-center border-b border-rule">
        <span className="absolute top-3 left-3.5 font-mono text-xs text-rule-strong select-none" aria-hidden="true">+</span>
        <span className="absolute top-3 right-3.5 font-mono text-xs text-rule-strong select-none" aria-hidden="true">+</span>
        <span className="absolute bottom-3 left-3.5 font-mono text-xs text-rule-strong select-none" aria-hidden="true">+</span>
        <span className="absolute bottom-3 right-3.5 font-mono text-xs text-rule-strong select-none" aria-hidden="true">+</span>

        <img
          src="/logo.png"
          alt="LogiCore Club circular emblem featuring mathematical and programming symbols"
          className="w-40 h-40 sm:w-44 sm:h-44 object-contain mix-blend-multiply"
        />
      </div>

      {/* Interactive Plotter Header */}
      <div className="px-4 py-2.5 border-b border-rule flex flex-wrap items-center justify-between gap-2 bg-paper">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Mathematical curve presets">
          {PRESETS.map(p => {
            const active = p.id === preset.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => { setActiveId(p.id); setSelectedIdx(4); }}
                className={[
                  'px-2.5 py-1 rounded-sm font-mono text-[11px] transition-colors',
                  active
                    ? 'bg-navy-900 text-paper'
                    : 'text-ink-muted hover:text-ink hover:bg-paper-tint',
                ].join(' ')}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <span className="font-mono text-[11px] text-cobalt-500 tabular-nums">
          ({activePoint.x.toFixed(2)}, {activePoint.y.toFixed(2)})
        </span>
      </div>

      {/* SVG Coordinate Plotter */}
      <div className="px-4 pt-4 pb-2 bg-paper-stock">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label={`Interactive plot of ${preset.label}: ${preset.formula}`}
        >
          {/* Subtle grid hairlines */}
          {[0.25, 0.5, 0.75].map(t => (
            <line
              key={`h-${t}`}
              x1={PAD_X}
              y1={PAD_Y + t * (SVG_H - PAD_Y * 2)}
              x2={SVG_W - PAD_X}
              y2={PAD_Y + t * (SVG_H - PAD_Y * 2)}
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          ))}
          {[0.25, 0.5, 0.75].map(t => (
            <line
              key={`v-${t}`}
              x1={PAD_X + t * (SVG_W - PAD_X * 2)}
              y1={PAD_Y}
              x2={PAD_X + t * (SVG_W - PAD_X * 2)}
              y2={SVG_H - PAD_Y}
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          ))}

          {/* X-axis (y = 0) */}
          <line
            x1={PAD_X - 6}
            y1={zeroY}
            x2={SVG_W - PAD_X + 8}
            y2={zeroY}
            stroke="#0B1220"
            strokeOpacity="0.25"
            strokeWidth="1"
          />

          {/* Y-axis left */}
          <line
            x1={PAD_X}
            y1={PAD_Y - 6}
            x2={PAD_X}
            y2={SVG_H - PAD_Y + 6}
            stroke="#0B1220"
            strokeOpacity="0.25"
            strokeWidth="1"
          />

          {/* Animated Curve */}
          <motion.path
            key={preset.id}
            d={pathD}
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke="#0A2463"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 1 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />

          {/* Interactive discrete sample points */}
          {samplePoints.map((pt, i) => {
            const isSelected = i === selectedIdx;
            return (
              <g
                key={`${preset.id}-${i}`}
                onMouseEnter={() => setSelectedIdx(i)}
                onClick={() => setSelectedIdx(i)}
                className="cursor-pointer"
              >
                <circle cx={pt.sx} cy={pt.sy} r={10} fill="transparent" />
                <circle
                  cx={pt.sx}
                  cy={pt.sy}
                  r={isSelected ? 4.5 : 2.5}
                  fill={isSelected ? '#0052CC' : '#FFFFFF'}
                  stroke={isSelected ? '#0052CC' : '#0A2463'}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Formula + Code strip */}
      <div className="px-4 py-3 border-t border-rule bg-paper space-y-1">
        <div className="font-mono text-xs text-ink font-medium">
          {preset.formula}
        </div>
        <div className="font-mono text-[11px] text-ink-muted truncate">
          <span className="text-cobalt-500">&#123;</span> {preset.code} <span className="text-cobalt-500">&#125;</span>
        </div>
      </div>
    </div>
  );
}
