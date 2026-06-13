'use client';
import { LogEvent } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { ReactNode } from 'react';

const severityColor: Record<string, string> = {
  info: 'var(--accent-blue)',
  warning: 'var(--accent-amber)',
  critical: 'var(--accent-red)',
};

const severityIcon: Record<LogEvent['severity'], ReactNode> = {
  info: <Info className="h-4 w-4" />,
  warning: <TriangleAlert className="h-4 w-4" />,
  critical: <CircleAlert className="h-4 w-4" />,
};

export default function EventLog({ events }: { events: LogEvent[] }) {
  const orderedEvents = [...events].reverse();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[rgba(17,24,39,0.95)]">
      <div className="panel-header border-b border-[var(--bg-panel-border)] bg-[rgba(255,255,255,0.02)] text-[0.8rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        <span>▶</span> Activity Timeline
        <span className="ml-auto rounded-full border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.1)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent-green)]">
          Live feed
        </span>
      </div>
      <div className="scroll-surface flex-1 overflow-y-auto p-0">
        <AnimatePresence initial={false}>
          {orderedEvents.map((ev, index) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: 16, y: 4 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: index * 0.03, duration: 0.22 }}
              className="border-b border-[var(--bg-panel-border)] px-3 py-3 last:border-b-0"
              style={{
                borderLeft: `3px solid ${severityColor[ev.severity]}`,
                background: `${severityColor[ev.severity]}08`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${severityColor[ev.severity]}18`, color: severityColor[ev.severity] }}
                >
                  {severityIcon[ev.severity]}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-secondary)]">
                    <span className="mono">{ev.timestamp}</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--text-dim)]" />
                    <span style={{ color: severityColor[ev.severity] }}>
                      {ev.severity === 'critical' ? 'Critical' : ev.severity === 'warning' ? 'Warning' : 'Info'}
                    </span>
                  </div>

                  <div className="mt-1 text-sm leading-6 text-[var(--text-primary)]">{ev.message}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}