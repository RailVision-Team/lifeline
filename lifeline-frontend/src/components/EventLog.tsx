'use client';
import { LogEvent } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const severityColor: Record<string, string> = {
  info: 'var(--accent-green)',
  warning: 'var(--accent-amber)',
  critical: 'var(--accent-red)',
};

const severityPrefix: Record<string, string> = {
  info: 'INF',
  warning: 'WRN',
  critical: 'CRT',
};

export default function EventLog({ events }: { events: LogEvent[] }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div className="panel-header">
        <span>▶</span> Autonomous Event Log
        <span className="ml-auto text-xs mono pulse" style={{ color: 'var(--accent-green)' }}>LIVE</span>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col-reverse p-2 gap-1">
        <AnimatePresence initial={false}>
          {events.map(ev => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="p-2 border text-xs"
              style={{
                borderColor: severityColor[ev.severity] + '30',
                background: severityColor[ev.severity] + '08',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span style={{ color: severityColor[ev.severity], fontSize: '0.6rem', fontWeight: 700 }}>
                  [{severityPrefix[ev.severity]}]
                </span>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.6rem' }}>{ev.timestamp}</span>
              </div>
              <div style={{ color: ev.severity === 'critical' ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {ev.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}