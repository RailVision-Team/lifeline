'use client';

const indicators = [
  { label: 'ESP32', key: 'esp' },
  { label: 'OLED', key: 'oled' },
  { label: 'LED Board', key: 'led' },
  { label: 'Board Sync', key: 'sync' },
];

export default function HardwareStatus({ connected }: { connected: boolean }) {
  return (
    <div className="border-t" style={{ borderColor: 'var(--bg-panel-border)', background: 'var(--bg-panel)' }}>
      <div className="panel-header"><span>◻</span> Hardware Interface</div>
      <div className="px-3 py-2 grid grid-cols-2 gap-1">
        {indicators.map(ind => (
          <div key={ind.key} className="flex items-center gap-1.5">
            <span
              className="status-dot"
              style={{
                background: connected ? 'var(--accent-green)' : 'var(--accent-red)',
                boxShadow: connected ? '0 0 5px var(--accent-green)' : '0 0 5px var(--accent-red)',
                width: 6, height: 6, borderRadius: '50%', display: 'inline-block'
              }}
            />
            <span className="text-xs mono" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {ind.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}