import { useMemo } from "react";
import { getSegments } from "../utils/roulette";

export default function RouletteWheel({ items, rotation, spinning, result, onSpin, disabled, t }) {
  const segments = useMemo(() => getSegments(items), [items]);

  const wheelBackground = useMemo(() => {
    if (!segments.length) return "conic-gradient(#e5e7eb 0deg 360deg)";
    const stops = segments.map(
      (s) => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`
    );
    return `conic-gradient(${stops.join(", ")})`;
  }, [segments]);

  return (
    <section className="panel wheel-panel">
      <div className="section-header">
        <h2>{t.wheelTitle}</h2>
      </div>

      <div className="wheel-stage">
        <div className="wheel-pointer" aria-hidden="true" />
        <div
          className={`wheel ${spinning ? "spinning" : ""}`}
          style={{ background: wheelBackground, transform: `rotate(${rotation}deg)` }}
        >
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="wheel-label"
              style={{ transform: `rotate(${segment.middleAngle - 90}deg)` }}
            >
              <span>{segment.label}</span>
            </div>
          ))}
          <div className="wheel-center" />
        </div>
      </div>

      <button className="primary-button spin-button" onClick={onSpin} disabled={disabled}>
        {spinning ? t.spinButtonSpinning : t.spinButtonNormal}
      </button>

      <div className="result-card" aria-live="polite">
        <div className="result-title">{t.resultTitle}</div>
        <div className="result-value">{result || t.resultPlaceholder}</div>
      </div>
    </section>
  );
}
