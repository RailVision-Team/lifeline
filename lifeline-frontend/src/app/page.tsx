'use client';
import { useState, useEffect } from 'react';
import { useLifelineState } from '@/hooks/useLifelineState';
import MetricsBar from '@/components/MetricsBar';
import AgentPanel from '@/components/AgentPanel';
import CityMap from '@/components/CityMap';
import EventLog from '@/components/EventLog';
import CrisisControls from '@/components/CrisisControls';
import HardwareStatus from '@/components/HardwareStatus';

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(new Date().toUTCString().slice(0, 25));
    const t = setInterval(() => setTime(new Date().toUTCString().slice(0, 25)), 1000);
    return () => clearInterval(t);
  }, []);
  return <span>{time} UTC</span>;
}

export default function Dashboard() {
  const { state, loading, usingMock, triggerDisaster } = useLifelineState(3000);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* TOP BAR */}
      <header className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--bg-panel-border)', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full pulse" style={{ background: 'var(--accent-green)' }} />
          <span className="font-condensed text-lg font-700 tracking-widest" style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-condensed)', fontWeight: 700, letterSpacing: '0.2em' }}>
            LIFELINE
          </span>
          <span className="text-xs mono" style={{ color: 'var(--text-secondary)' }}>
            AUTONOMOUS CRISIS RESPONSE NETWORK
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs mono" style={{ color: 'var(--text-secondary)' }}>
          {usingMock && <span style={{ color: 'var(--accent-amber)' }}>⚠ SIMULATION MODE</span>}
          <Clock />
        </div>
      </header>

      {/* METRICS BAR */}
      <MetricsBar metrics={state.metrics} />

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Agent Panel */}
        <div className="w-56 flex flex-col border-r" style={{ borderColor: 'var(--bg-panel-border)' }}>
          <AgentPanel agents={state.agents} />
          <CrisisControls onTrigger={triggerDisaster} loading={loading} />
        </div>

        {/* CENTER: City Map */}
        <div className="flex-1">
          <CityMap nodes={state.nodes} edges={state.edges} />
        </div>

        {/* RIGHT: Event Log + Hardware */}
        <div className="w-72 flex flex-col border-l" style={{ borderColor: 'var(--bg-panel-border)' }}>
          <EventLog events={state.events} />
          <HardwareStatus connected={state.hardwareConnected} />
        </div>
      </div>
    </div>
  );
}