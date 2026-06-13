'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const allNodes = [
  { id: 'city-hospital',   label: 'City Hospital',    icon: '🏥', color: '#22c55e', x: 8,  y: 16 },
  { id: 'police',          label: 'Police Station',   icon: '🚔', color: '#6366f1', x: 34, y: 16 },
  { id: 'camp-alpha',      label: 'Camp Alpha',       icon: '⛺', color: '#ef4444', x: 57, y: 13 },
  { id: 'north-warehouse', label: 'North Warehouse',  icon: '🏭', color: '#3b82f6', x: 86, y: 16 },
  { id: 'residential',     label: 'Residential',      icon: '🏘️', color: '#94a3b8', x: 8,  y: 36 },
  { id: 'firestation',     label: 'Fire Station',     icon: '🚒', color: '#ef4444', x: 34, y: 36 },
  { id: 'citypark',        label: 'City Park',        icon: '🌳', color: '#22c55e', x: 54, y: 36 },
  { id: 'clinic',          label: 'Clinic',           icon: '🏥', color: '#22c55e', x: 70, y: 36 },
  { id: 'camp-bravo',      label: 'Camp Bravo',       icon: '⛺', color: '#ef4444', x: 90, y: 36 },
  { id: 'water',           label: 'Water Treatment',  icon: '💧', color: '#06b6d4', x: 8,  y: 57 },
  { id: 'school',          label: 'School',           icon: '🏫', color: '#8b5cf6', x: 32, y: 57 },
  { id: 'community',       label: 'Community Center', icon: '🏛️', color: '#8b5cf6', x: 54, y: 57 },
  { id: 'market',          label: 'Market',           icon: '🏪', color: '#f59e0b', x: 72, y: 57 },
  { id: 'camp-charlie',    label: 'Camp Charlie',     icon: '⛺', color: '#ef4444', x: 90, y: 60 },
  { id: 'south-warehouse', label: 'South Warehouse',  icon: '🏭', color: '#3b82f6', x: 8,  y: 78 },
  { id: 'fuel',            label: 'Fuel Station',     icon: '⛽', color: '#f97316', x: 30, y: 78 },
  { id: 'warehouse',       label: 'Warehouse',        icon: '🏭', color: '#3b82f6', x: 52, y: 78 },
  { id: 'lake',            label: 'Lake',             icon: '🌊', color: '#06b6d4', x: 68, y: 80 },
  { id: 'relief',          label: 'Relief Supply',    icon: '📦', color: '#f59e0b', x: 88, y: 78 },
];

// Route connections between nodes
const routes = [
  { id: 'r1',  from: 'city-hospital',   to: 'police',          status: 'active' },
  { id: 'r2',  from: 'police',          to: 'camp-alpha',      status: 'active' },
  { id: 'r3',  from: 'camp-alpha',      to: 'north-warehouse', status: 'active' },
  { id: 'r4',  from: 'city-hospital',   to: 'residential',     status: 'active' },
  { id: 'r5',  from: 'police',          to: 'firestation',     status: 'active' },
  { id: 'r6',  from: 'camp-alpha',      to: 'clinic',          status: 'active' },
  { id: 'r7',  from: 'north-warehouse', to: 'camp-bravo',      status: 'active' },
  { id: 'r8',  from: 'firestation',     to: 'school',          status: 'active' },
  { id: 'r9',  from: 'clinic',          to: 'market',          status: 'active' },
  { id: 'r10', from: 'camp-bravo',      to: 'camp-charlie',    status: 'active' },
  { id: 'r11', from: 'residential',     to: 'water',           status: 'active' },
  { id: 'r12', from: 'school',          to: 'community',       status: 'active' },
  { id: 'r13', from: 'community',       to: 'market',          status: 'active' },
  { id: 'r14', from: 'water',           to: 'south-warehouse', status: 'active' },
  { id: 'r15', from: 'south-warehouse', to: 'fuel',            status: 'active' },
  { id: 'r16', from: 'fuel',            to: 'warehouse',       status: 'active' },
  { id: 'r17', from: 'warehouse',       to: 'lake',            status: 'active' },
  { id: 'r18', from: 'lake',            to: 'relief',          status: 'active' },
  { id: 'r19', from: 'relief',          to: 'camp-charlie',    status: 'active' },
  { id: 'r20', from: 'north-warehouse', to: 'relief',          status: 'alternative' },
];

const disasterEffects: Record<string, { nodes: Record<string, string>; routes: Record<string, string> }> = {
  flood: {
    nodes:  { 'north-warehouse': 'blocked', 'camp-alpha': 'critical', 'clinic': 'warning', 'camp-bravo': 'warning' },
    routes: { 'r3': 'blocked', 'r6': 'blocked', 'r7': 'warning' },
  },
  bridge: {
    nodes:  { 'camp-bravo': 'critical', 'camp-charlie': 'critical', 'relief': 'blocked' },
    routes: { 'r10': 'blocked', 'r19': 'blocked', 'r7': 'warning' },
  },
  supply: {
    nodes:  { 'south-warehouse': 'blocked', 'warehouse': 'critical', 'fuel': 'warning' },
    routes: { 'r15': 'blocked', 'r16': 'critical' },
  },
};

const statusColor: Record<string, string> = {
  normal:      '#22c55e',
  warning:     '#f59e0b',
  critical:    '#ef4444',
  blocked:     '#6b7280',
  active:      '#22c55e',
  alternative: '#f59e0b',
};

export default function MapPage() {
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, string>>(
    Object.fromEntries(allNodes.map(n => [n.id, 'normal']))
  );
  const [routeStatuses, setRouteStatuses] = useState<Record<string, string>>(
    Object.fromEntries(routes.map(r => [r.id, r.status]))
  );
  const [activeDisaster, setActiveDisaster] = useState('');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodePos = Object.fromEntries(allNodes.map(n => [n.id, { x: n.x, y: n.y }]));

  const triggerDisaster = (type: string) => {
    setActiveDisaster(type);
    const effects = disasterEffects[type];
    if (!effects) return;
    setNodeStatuses(prev => ({ ...prev, ...effects.nodes }));
    setRouteStatuses(prev => ({ ...prev, ...effects.routes }));
  };

  const reset = () => {
    setActiveDisaster('');
    setNodeStatuses(Object.fromEntries(allNodes.map(n => [n.id, 'normal'])));
    setRouteStatuses(Object.fromEntries(routes.map(r => [r.id, r.status])));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d1117' }}>

      {/* HEADER */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.5rem 1rem', flexShrink: 0,
        borderBottom: '1px solid #253041',
        background: 'rgba(13,17,23,0.97)', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{
            padding: '0.3rem 0.8rem', borderRadius: 999, fontSize: '0.7rem',
            fontWeight: 600, border: '1px solid #253041',
            color: '#94a3b8', textDecoration: 'none',
          }}>← Dashboard</Link>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>LIFELINE</div>
            <div style={{ fontSize: '0.55rem', color: '#64748b', letterSpacing: '0.1em' }}>CITY OPERATIONS MAP</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {activeDisaster && (
            <span style={{
              padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '0.65rem',
              fontWeight: 700, border: '1px solid #ef444440',
              background: '#ef444410', color: '#ef4444',
            }}>⚠ {activeDisaster.toUpperCase()} ACTIVE</span>
          )}
          {[
            { type: 'flood',  label: 'FLOOD',           color: '#3b82f6' },
            { type: 'bridge', label: 'BRIDGE COLLAPSE',  color: '#ef4444' },
            { type: 'supply', label: 'SUPPLY FAILURE',   color: '#f59e0b' },
          ].map(btn => (
            <button key={btn.type} onClick={() => triggerDisaster(btn.type)} style={{
              padding: '0.3rem 0.75rem', borderRadius: 6, fontSize: '0.65rem',
              fontWeight: 700, border: `1px solid ${btn.color}40`,
              background: `${btn.color}12`, color: btn.color, cursor: 'pointer',
            }}>{btn.label}</button>
          ))}
          <button onClick={reset} style={{
            padding: '0.3rem 0.75rem', borderRadius: 6, fontSize: '0.65rem',
            fontWeight: 700, border: '1px solid #253041',
            background: 'transparent', color: '#64748b', cursor: 'pointer',
          }}>RESET</button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[['normal','#22c55e'],['warning','#f59e0b'],['critical','#ef4444'],['blocked','#6b7280']].map(([s,c]) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6rem', color: '#94a3b8' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
              {(s as string).charAt(0).toUpperCase() + (s as string).slice(1)}
            </div>
          ))}
        </div>
      </header>

      {/* MAP */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Full map image — objectFit fill so no zoom/crop */}
        <img
          src="/city-map.png"
          alt="City Map"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
        />

        {/* Slight overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.08)' }} />

        {/* SVG ROUTE LINES */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {routes.map(route => {
            const src = nodePos[route.from];
            const tgt = nodePos[route.to];
            if (!src || !tgt) return null;
            const status = routeStatuses[route.id] ?? 'active';
            const color = statusColor[status] ?? '#22c55e';
            return (
              <line
                key={route.id}
                x1={src.x} y1={src.y}
                x2={tgt.x} y2={tgt.y}
                stroke={color}
                strokeWidth="0.6"
                strokeDasharray={status === 'alternative' || status === 'warning' ? '2 1' : undefined}
                strokeLinecap="round"
                opacity={0.9}
              />
            );
          })}
        </svg>

        {/* NODES */}
        {allNodes.map(node => {
          const status = nodeStatuses[node.id];
          const color = statusColor[status] ?? node.color;
          const isHovered = hoveredNode === node.id;

          return (
            <motion.div
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ scale: 1.25 }}
              style={{
                position: 'absolute',
                left: `${node.x}%`, top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 2,
                cursor: 'pointer', zIndex: isHovered ? 20 : 2,
              }}
            >
              {status === 'critical' && (
                <motion.div style={{
                  position: 'absolute', width: 40, height: 40,
                  borderRadius: '50%', border: `2px solid ${color}`,
                  top: -4, left: '50%', transform: 'translateX(-50%)',
                }}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              )}

              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: color + '28',
                border: `2.5px solid ${color}`,
                boxShadow: `0 0 10px ${color}77`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>{node.icon}</div>

              <div style={{
                background: 'rgba(10,14,23,0.88)',
                border: `1px solid ${color}45`,
                borderRadius: 4, padding: '2px 6px',
                fontSize: '0.5rem', fontWeight: 700,
                color: color, whiteSpace: 'nowrap',
              }}>{node.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}