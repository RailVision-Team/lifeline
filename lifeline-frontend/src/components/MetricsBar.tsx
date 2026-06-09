'use client';
import { Metrics } from '@/types';
import { motion } from 'framer-motion';

const cards = [
  { key: 'responseTime', label: 'Avg Response', unit: 'min', color: 'var(--accent-green)' },
  { key: 'activeRoutes', label: 'Active Routes', unit: '', color: 'var(--accent-blue)' },
  { key: 'blockedRoutes', label: 'Blocked Routes', unit: '', color: 'var(--accent-red)' },
  { key: 'demandFulfilled', label: 'Demand Met', unit: '%', color: 'var(--accent-amber)' },
  { key: 'vehiclesActive', label: 'Vehicles Active', unit: '', color: 'var(--accent-green)' },
];

export default function MetricsBar({ metrics }: { metrics: Metrics }) {
  return (
    <div className="flex gap-px border-b" style={{ borderColor: 'var(--bg-panel-border)', background: 'var(--bg-panel-border)' }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex-1 px-4 py-2 flex flex-col"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-condensed)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {card.label}
          </span>
          <span className="text-xl font-700 mono" style={{ color: card.color, fontFamily: 'var(--font-mono)' }}>
            {metrics[card.key as keyof Metrics]}{card.unit}
          </span>
        </motion.div>
      ))}
    </div>
  );
}