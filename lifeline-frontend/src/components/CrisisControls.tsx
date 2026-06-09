'use client';
import { motion } from 'framer-motion';

interface Props {
  onTrigger: (type: string) => void;
  loading: boolean;
}

const buttons = [
  { type: 'flood', label: 'Trigger Flood', color: 'var(--accent-blue)' },
  { type: 'bridge', label: 'Bridge Collapse', color: 'var(--accent-red)' },
  { type: 'supply', label: 'Supply Failure', color: 'var(--accent-amber)' },
  { type: 'reset', label: 'Reset Simulation', color: 'var(--text-secondary)' },
];

export default function CrisisControls({ onTrigger, loading }: Props) {
  return (
    <div className="border-t" style={{ borderColor: 'var(--bg-panel-border)', background: 'var(--bg-panel)' }}>
      <div className="panel-header"><span>⚡</span> Crisis Control</div>
      <div className="p-2 flex flex-col gap-1">
        {buttons.map(btn => (
          <motion.button
            key={btn.type}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={() => onTrigger(btn.type)}
            className="w-full text-left px-3 py-1.5 text-xs border"
            style={{
              fontFamily: 'var(--font-condensed)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: btn.color,
              borderColor: btn.color + '40',
              background: btn.color + '10',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '...' : btn.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}