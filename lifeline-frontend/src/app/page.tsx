'use client';
import { useEffect, useState } from 'react';
import { useLifelineState } from '@/hooks/useLifelineState';
import AgentPanel from '@/components/AgentPanel';
import CityMap from '@/components/CityMap';
import EventLog from '@/components/EventLog';
import CrisisControls from '@/components/CrisisControls';
import HardwareStatus from '@/components/HardwareStatus';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () => new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'UTC',
    }).format(new Date());
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span>{time} UTC</span>;
}

export default function Dashboard() {
  const { state, loading, usingMock, triggerDisaster } = useLifelineState(3000);
  const [activeDisaster, setActiveDisaster] = useState('');

const handleTrigger = (type: string) => {
  if (type === 'reset') setActiveDisaster('');
  else setActiveDisaster(type);
  triggerDisaster(type);
};

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      background: 'var(--bg-primary)', color: 'var(--text-primary)'
    }}>

      {/* HEADER */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.5rem 1rem', flexShrink: 0,
        borderBottom: '1px solid var(--bg-panel-border)',
        background: 'rgba(13,17,23,0.97)', gap: '1rem',
      }}>
        {activeDisaster && activeDisaster !== 'reset' && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    style={{
      background: activeDisaster === 'bridge' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
      borderBottom: `1px solid ${activeDisaster === 'bridge' ? '#ef444440' : '#f59e0b40'}`,
      padding: '0.4rem 1rem',
      display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
    }}
  >
    <motion.div
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      style={{
        width: 8, height: 8, borderRadius: '50%',
        background: activeDisaster === 'bridge' ? '#ef4444' : '#f59e0b',
        boxShadow: `0 0 8px ${activeDisaster === 'bridge' ? '#ef4444' : '#f59e0b'}`,
      }}
    />
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
      color: activeDisaster === 'bridge' ? '#ef4444' : '#f59e0b',
    }}>
      ⚠ ACTIVE DISASTER —{' '}
      {activeDisaster === 'flood' ? 'FLOOD: WATER INGRESS DETECTED'
        : activeDisaster === 'bridge' ? 'BRIDGE COLLAPSE: TRANSPORT CORRIDOR DISRUPTED'
        : 'SUPPLY CHAIN FAILURE: INVENTORY SHORTAGE'}
    </span>
    <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
      Autonomous agents responding...
    </span>
  </motion.div>
)}

        {/* Title */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>LIFELINE</div>
          <div style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginTop: 2 }}>AUTONOMOUS CRISIS RESPONSE</div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
          {[
            { href: '/', label: 'Dashboard', active: true },
            { href: '/map', label: 'City Map', active: false },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              padding: '0.3rem 0.7rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
              border: link.active ? '1px solid rgba(0,255,136,0.3)' : '1px solid var(--bg-panel-border)',
              background: link.active ? 'rgba(0,255,136,0.08)' : 'transparent',
              color: link.active ? 'var(--accent-green)' : 'var(--text-secondary)',
              textDecoration: 'none',
            }}>{link.label}</Link>
          ))}
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: '0.4rem', flex: 1, justifyContent: 'center' }}>
          {[
            { label: 'Response', value: `${state.metrics.responseTime.toFixed(1)}m`, color: 'var(--accent-green)' },
            { label: 'Active Routes', value: state.metrics.activeRoutes, color: 'var(--accent-blue)' },
            { label: 'Blocked', value: state.metrics.blockedRoutes, color: 'var(--accent-red)' },
            { label: 'Demand Met', value: `${state.metrics.demandFulfilled}%`, color: 'var(--accent-amber)' },
            { label: 'Vehicles', value: state.metrics.vehiclesActive, color: 'var(--accent-green)' },
          ].map(m => (
            <div key={m.label} style={{
              padding: '0.25rem 0.6rem', borderRadius: 8, minWidth: 70,
              border: '1px solid var(--bg-panel-border)',
              background: 'rgba(255,255,255,0.03)',
            }}>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* System status */}
        <div style={{
          flexShrink: 0, padding: '0.3rem 0.7rem', borderRadius: 10,
          border: '1px solid var(--bg-panel-border)',
          background: 'rgba(255,255,255,0.03)', fontSize: '0.65rem', textAlign: 'right',
        }}>
          <div style={{ color: 'var(--text-secondary)' }}>System Status</div>
          <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 5px var(--accent-green)', display: 'inline-block' }} />
            Operational
          </div>
          <div style={{ color: usingMock ? 'var(--accent-amber)' : 'var(--accent-green)', fontWeight: 600, marginTop: 2 }}>
            {usingMock ? 'Simulation' : 'Live'}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}><Clock /></div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr 280px',
        flex: 1, minHeight: 0, overflow: 'hidden',
      }}>
        {/* LEFT */}
        <aside style={{
          borderRight: '1px solid var(--bg-panel-border)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          background: 'rgba(17,24,39,0.95)',
        }}>
          <AgentPanel agents={state.agents} />
        </aside>

        {/* CENTER - MAP */}
        <section style={{
          padding: '0.6rem', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ flex: 1, minHeight: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bg-panel-border)' }}>
            <CityMap nodes={state.nodes} edges={state.edges} />
          </div>
        </section>

        {/* RIGHT */}
        <aside style={{
  borderLeft: '1px solid var(--bg-panel-border)',
  display: 'flex', flexDirection: 'column',
  overflow: 'hidden', background: 'rgba(17,24,39,0.95)',
}}>
  {/* Event log — takes all remaining space */}
  <div style={{
    flex: 1, minHeight: 0, overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    borderBottom: '1px solid var(--bg-panel-border)',
  }}>
    <EventLog events={state.events} />
  </div>

  {/* Hardware — fixed height, never grows */}
  <div style={{ height: '160px', flexShrink: 0, borderBottom: '1px solid var(--bg-panel-border)', overflow: 'hidden' }}>
    <HardwareStatus connected={state.hardwareConnected} disasterType={activeDisaster} />
  </div>

  {/* Crisis controls — fixed height */}
  <div style={{ flexShrink: 0, overflowY: 'auto' }}>
  <CrisisControls onTrigger={handleTrigger} loading={loading} activeDisaster={activeDisaster} />
</div>
</aside>
      </main>
    </div>
  );
}