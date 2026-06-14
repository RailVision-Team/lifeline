'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onTrigger: (type: string) => void;
  loading: boolean;
  activeDisaster?: string;
}

const disasters = [
  { type: 'flood',  label: 'Trigger Flood',    hint: 'Water ingress scenario',        color: '#3b82f6', icon: '🌊' },
  { type: 'bridge', label: 'Bridge Collapse',   hint: 'Transport corridor disruption', color: '#ef4444', icon: '🌉' },
  { type: 'supply', label: 'Supply Failure',    hint: 'Inventory shortage event',      color: '#f59e0b', icon: '📦' },
  { type: 'reset',  label: 'Reset Simulation',  hint: 'Restore baseline state',        color: '#64748b', icon: '↺'  },
];

export default function CrisisControls({ onTrigger, loading, activeDisaster }: Props) {
  return (
    <div style={{ background: 'rgba(17,24,39,0.95)' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--bg-panel-border)' }}>
        <span>⚡</span> Crisis Controls
      </div>

      {/* Active disaster banner */}
      <AnimatePresence>
        {activeDisaster && activeDisaster !== 'reset' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: activeDisaster === 'bridge' ? '#ef444415' : '#f59e0b15',
              borderBottom: `1px solid ${activeDisaster === 'bridge' ? '#ef444440' : '#f59e0b40'}`,
              padding: '0.4rem 0.75rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: activeDisaster === 'bridge' ? '#ef4444' : '#f59e0b',
                boxShadow: `0 0 6px ${activeDisaster === 'bridge' ? '#ef4444' : '#f59e0b'}`,
              }}
            />
            <span style={{
              fontSize: '0.65rem', fontWeight: 700,
              color: activeDisaster === 'bridge' ? '#ef4444' : '#f59e0b',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {activeDisaster === 'flood' ? '🌊 FLOOD ACTIVE'
                : activeDisaster === 'bridge' ? '🌉 BRIDGE COLLAPSE ACTIVE'
                : '📦 SUPPLY FAILURE ACTIVE'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        {disasters.map(btn => {
          const isActive = activeDisaster === btn.type;
          return (
            <motion.button
              key={btn.type}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={() => onTrigger(btn.type)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0.5rem 0.75rem',
                background: isActive ? `${btn.color}12` : 'transparent',
                borderBottom: '1px solid var(--bg-panel-border)',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none', borderBottomColor: 'var(--bg-panel-border)',
                borderBottomWidth: 1, borderBottomStyle: 'solid',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{btn.icon}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isActive ? btn.color : '#fff' }}>
                    {btn.label}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: 1 }}>
                    {btn.hint}
                  </div>
                </div>
              </div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: isActive ? btn.color : 'var(--accent-green)',
                background: isActive ? `${btn.color}20` : 'transparent',
                padding: '2px 8px', borderRadius: 4,
                border: isActive ? `1px solid ${btn.color}40` : 'none',
              }}>
                {loading ? '...' : isActive ? 'ACTIVE' : 'RUN'}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}