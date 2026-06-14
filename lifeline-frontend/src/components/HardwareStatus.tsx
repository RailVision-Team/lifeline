'use client';
import { Cpu, Radio, Wifi, Volume2, Network } from 'lucide-react';

interface Props {
  connected: boolean;
  disasterType?: string;
}

export default function HardwareStatus({ connected, disasterType }: Props) {
  const isDisasterActive = !!disasterType && disasterType !== 'reset';

  const getLEDStatus = () => {
    if (!connected) return { color: '#6b7280', label: 'Offline', desc: 'System Offline' };
    if (!isDisasterActive) return { color: '#22c55e', label: 'Green', desc: 'System Operational' };
    if (disasterType === 'flood') return { color: '#f59e0b', label: 'Yellow', desc: 'Disaster Alert Active' };
    if (disasterType === 'bridge') return { color: '#ef4444', label: 'Red', desc: 'Critical Emergency' };
    if (disasterType === 'supply') return { color: '#f59e0b', label: 'Yellow', desc: 'Disaster Alert Active' };
    return { color: '#22c55e', label: 'Green', desc: 'System Operational' };
  };

  const getVoiceStatus = () => {
    if (!connected) return { color: '#6b7280', label: 'Offline' };
    if (isDisasterActive) return { color: '#ef4444', label: 'Playing Alert' };
    return { color: '#22c55e', label: 'Online' };
  };

  const getNetworkStatus = () => {
    if (!connected) return { color: '#6b7280', label: 'Disconnected' };
    return { color: '#3b82f6', label: 'Connected' };
  };

  const led = getLEDStatus();
  const voice = getVoiceStatus();
  const network = getNetworkStatus();

  const indicators = [
    {
      icon: Cpu,
      label: 'ESP32',
      status: connected ? 'Online' : 'Offline',
      color: connected ? '#22c55e' : '#6b7280',
    },
    {
      icon: Volume2,
      label: 'Voice Alert Module',
      status: voice.label,
      color: voice.color,
    },
    {
      icon: Radio,
      label: 'LED Board',
      status: led.desc,
      color: led.color,
    },
    {
      icon: Wifi,
      label: 'Sync Status',
      status: connected ? 'Synced' : 'Lost',
      color: connected ? '#22c55e' : '#6b7280',
    },
  ];

  return (
    <div style={{ background: 'rgba(17,24,39,0.95)' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--bg-panel-border)' }}>
        <span>◻</span> Hardware Interface
        {isDisasterActive && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.55rem', fontWeight: 700,
            color: '#ef4444', background: '#ef444415',
            border: '1px solid #ef444440', borderRadius: 4,
            padding: '2px 6px', letterSpacing: '0.06em',
          }}>
            ⚠ ALERT MODE
          </span>
        )}
      </div>

      {/* LED color indicator bar */}
      <div style={{
        height: 3,
        background: led.color,
        boxShadow: `0 0 8px ${led.color}`,
        transition: 'background 0.5s ease',
      }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--bg-panel-border)' }}>
        {indicators.map(ind => (
          <div key={ind.label} style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(17,24,39,0.95)',
            minHeight: 56,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 26, height: 26, borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: ind.color,
              }}>
                <ind.icon size={13} />
              </span>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#fff' }}>{ind.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: ind.color,
                    boxShadow: `0 0 4px ${ind.color}`,
                  }} />
                  <span style={{ fontSize: '0.58rem', color: ind.color, fontWeight: 600 }}>{ind.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Future Expansion */}
      <div style={{
        padding: '0.4rem 0.75rem',
        borderTop: '1px solid var(--bg-panel-border)',
        background: 'rgba(255,255,255,0.01)',
      }}>
        <div style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: 4, textTransform: 'uppercase' }}>
          Future Expansion
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Network size={11} style={{ color: '#6366f1' }} />
          <span style={{ fontSize: '0.58rem', color: '#6366f1' }}>LoRa Mesh Network</span>
          <span style={{
            fontSize: '0.5rem', color: '#6366f1', background: '#6366f115',
            border: '1px solid #6366f130', borderRadius: 3, padding: '1px 5px', marginLeft: 2,
          }}>Planned</span>
        </div>
      </div>
    </div>
  );
}