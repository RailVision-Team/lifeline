'use client';
import { Metrics } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const cards = [
  { key: 'responseTime', label: 'Response Time', unit: 'min', color: 'var(--accent-green)' },
  { key: 'activeRoutes', label: 'Active Routes', unit: '', color: 'var(--accent-blue)' },
  { key: 'blockedRoutes', label: 'Blocked Routes', unit: '', color: 'var(--accent-red)' },
  { key: 'demandFulfilled', label: 'Demand Fulfilled', unit: '%', color: 'var(--accent-amber)' },
  { key: 'vehiclesActive', label: 'Vehicles Active', unit: '', color: 'var(--accent-green)' },
];

function MetricValue({ value, fixed }: { value: number; fixed?: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const duration = 420;
    const startValue = previousValue.current;
    const delta = value - startValue;
    const startedAt = performance.now();
    let frame = 0;
    previousValue.current = value;

    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + delta * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  if (fixed !== undefined) {
    return <>{displayValue.toFixed(fixed)}</>;
  }

  return <>{Math.round(displayValue)}</>;
}

export default function MetricsBar({ metrics }: { metrics: Metrics }) {
  return (
    <div className="px-0 py-0">
      <div className="grid gap-0">
        {cards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.28 }}
            whileHover={{ y: -2 }}
            className="border-b border-[var(--bg-panel-border)] bg-[rgba(17,24,39,0.95)] px-3 py-2 shadow-[0_8px_20px_rgba(2,6,23,0.18)] transition-shadow hover:shadow-[0_14px_28px_rgba(2,6,23,0.24)] last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-[0.08em]">{card.label}</span>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: card.color }} />
            </div>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-xl font-semibold tracking-tight text-[var(--text-primary)]" style={{ color: card.color }}>
                <MetricValue value={metrics[card.key as keyof Metrics]} fixed={card.unit === 'min' ? 1 : undefined} />
              </span>
              {card.unit ? <span className="pb-1 text-sm font-medium text-[var(--text-secondary)]">{card.unit}</span> : null}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}