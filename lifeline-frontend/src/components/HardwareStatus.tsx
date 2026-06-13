'use client';
import { Cpu, MonitorSmartphone, Radio, Wifi } from 'lucide-react';

const indicators = [
  { label: 'ESP32', key: 'esp', icon: Cpu },
  { label: 'OLED', key: 'oled', icon: MonitorSmartphone },
  { label: 'LED Board', key: 'led', icon: Radio },
  { label: 'Sync Status', key: 'sync', icon: Wifi },
] as const;

export default function HardwareStatus({ connected }: { connected: boolean }) {
  const toneStyles = {
    green: {
      color: 'var(--accent-green)',
      border: 'rgba(34, 197, 94, 0.24)',
      background: 'rgba(34, 197, 94, 0.08)',
    },
    amber: {
      color: 'var(--accent-amber)',
      border: 'rgba(245, 158, 11, 0.24)',
      background: 'rgba(245, 158, 11, 0.08)',
    },
    red: {
      color: 'var(--accent-red)',
      border: 'rgba(239, 68, 68, 0.24)',
      background: 'rgba(239, 68, 68, 0.08)',
    },
  };

  return (
    <div className="bg-[rgba(17,24,39,0.95)]">
      <div className="panel-header border-b border-[var(--bg-panel-border)] bg-[rgba(255,255,255,0.02)] text-[0.8rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]"><span>◻</span> Hardware Status</div>
      <div className="grid grid-cols-2 gap-px bg-[var(--bg-panel-border)]">
        {indicators.map(ind => (
          <div
            key={ind.key}
            className="min-h-[4.75rem] border-0 px-3 py-2 shadow-sm"
            style={{
              background: 'rgba(17,24,39,0.92)',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.04)]"
                style={{
                  color:
                    ind.key === 'sync'
                      ? connected
                        ? toneStyles.green.color
                        : toneStyles.amber.color
                      : connected
                        ? ind.key === 'led'
                          ? toneStyles.amber.color
                          : toneStyles.green.color
                        : toneStyles.red.color,
                }}
              >
                <ind.icon className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{ind.label}</div>
                <div
                  className="mt-1 flex items-center gap-2 text-xs font-medium"
                  style={{
                    color:
                      ind.key === 'sync'
                        ? connected
                          ? toneStyles.green.color
                          : toneStyles.amber.color
                        : connected
                          ? ind.key === 'led'
                            ? toneStyles.amber.color
                            : toneStyles.green.color
                          : toneStyles.red.color,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background:
                        ind.key === 'sync'
                          ? connected
                            ? toneStyles.green.color
                            : toneStyles.amber.color
                          : connected
                            ? ind.key === 'led'
                              ? toneStyles.amber.color
                              : toneStyles.green.color
                            : toneStyles.red.color,
                    }}
                  />
                  {ind.key === 'sync'
                    ? connected
                      ? 'Synced'
                      : 'Degraded'
                    : connected
                      ? ind.key === 'led'
                        ? 'Standby'
                        : 'Online'
                      : 'Offline'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}