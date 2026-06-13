'use client';
import { motion } from 'framer-motion';

interface Props {
  onTrigger: (type: string) => void;
  loading: boolean;
}

const buttons = [
  { type: 'flood', label: 'Trigger Flood', color: 'var(--accent-blue)', hint: 'Water ingress scenario' },
  { type: 'bridge', label: 'Bridge Collapse', color: 'var(--accent-orange)', hint: 'Transport corridor disruption' },
  { type: 'supply', label: 'Supply Failure', color: 'var(--accent-amber)', hint: 'Inventory shortage event' },
  { type: 'reset', label: 'Reset Simulation', color: 'var(--text-secondary)', hint: 'Restore baseline state' },
];

export default function CrisisControls({ onTrigger, loading }: Props) {
  return (
    <div className="bg-[rgba(17,24,39,0.95)]">
      <div className="panel-header border-b border-[var(--bg-panel-border)] bg-[rgba(255,255,255,0.02)] text-[0.8rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]"><span>⚡</span> Crisis Controls</div>
      <div className="space-y-0 divide-y divide-[var(--bg-panel-border)]">
        {buttons.map(btn => (
          <motion.button
            key={btn.type}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.985 }}
            disabled={loading}
            onClick={() => onTrigger(btn.type)}
            aria-busy={loading}
            className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.03)] disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              color: 'var(--text-primary)',
              background: 'transparent',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: btn.color }} />
              <div>
                <div className="text-sm font-semibold text-white">{btn.label}</div>
                <div className="text-xs text-[var(--text-secondary)]">{btn.hint}</div>
              </div>
            </div>

            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-green)]">RUN</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}