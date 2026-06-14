'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CityNode, CityEdge } from '@/types';

// Positions matched to the actual city-map.png image
const nodePositions: Record<string, { x: number; y: number }> = {
  // Frontend IDs
  'cmd':       { x: 48, y: 52 },
  'wh-a':      { x: 22, y: 32 },
  'wh-b':      { x: 78, y: 20 },
  'camp-a':    { x: 52, y: 16 },
  'camp-b':    { x: 72, y: 52 },
  'hospital':  { x: 22, y: 20 },
  'depot-a':   { x: 33, y: 56 },
  'depot-b':   { x: 60, y: 56 },
  // Backend IDs
  'camp1':          { x: 52, y: 16 },
  'camp2':          { x: 72, y: 52 },
  'warehouse1':     { x: 22, y: 32 },
  'warehouse2':     { x: 78, y: 20 },
  'hospital1':      { x: 22, y: 20 },
  'depot1':         { x: 33, y: 56 },
  'depot2':         { x: 60, y: 56 },
  'command_center': { x: 48, y: 52 },
};

// Extra static nodes from the full map image
const extraNodes = [
  { id: 'north-warehouse', label: 'North Warehouse', icon: '🏭', color: '#3b82f6', x: 84, y: 20 },
  { id: 'camp-bravo',      label: 'Camp Bravo',      icon: '⛺', color: '#22c55e', x: 90, y: 52 },
  { id: 'camp-charlie',    label: 'Camp Charlie',    icon: '⛺', color: '#22c55e', x: 90, y: 70 },
  { id: 'south-warehouse', label: 'South Warehouse', icon: '🏭', color: '#3b82f6', x: 8,  y: 80 },
  { id: 'fuel-station',    label: 'Fuel Station',    icon: '⛽', color: '#f97316', x: 32, y: 80 },
  { id: 'warehouse',       label: 'Warehouse',       icon: '🏭', color: '#3b82f6', x: 50, y: 80 },
  { id: 'relief',          label: 'Relief Supply',   icon: '📦', color: '#f59e0b', x: 86, y: 82 },
  { id: 'police',          label: 'Police Station',  icon: '🚔', color: '#6366f1', x: 36, y: 18 },
  { id: 'firestation',     label: 'Fire Station',    icon: '🚒', color: '#ef4444', x: 36, y: 38 },
  { id: 'clinic',          label: 'Clinic',          icon: '🏥', color: '#22c55e', x: 68, y: 38 },
];

const nodeColors: Record<string, string> = {
  camp:      '#ef4444',
  warehouse: '#3b82f6',
  hospital:  '#22c55e',
  command:   '#8b5cf6',
  depot:     '#94a3b8',
};

const nodeIcons: Record<string, string> = {
  camp:      '⛺',
  warehouse: '🏭',
  hospital:  '🏥',
  command:   '🛡️',
  depot:     '📦',
};

const edgeColors: Record<string, string> = {
  active:      '#22c55e',
  blocked:     '#ef4444',
  alternative: '#f59e0b',
};

interface Props {
  nodes: CityNode[];
  edges: CityEdge[];
}

function NodeDot({ id, label, icon, color, x, y, pulse }: {
  id: string; label: string; icon: string;
  color: string; x: number; y: number; pulse?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.2 }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        zIndex: hovered ? 20 : 2,
        cursor: 'pointer',
      }}
    >
      {/* Pulse ring */}
      {pulse && (
        <motion.div
          style={{
            position: 'absolute',
            width: 36, height: 36,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            top: -4, left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Circle */}
      <div style={{
        width: 28, height: 28,
        borderRadius: '50%',
        background: color + '30',
        border: `2.5px solid ${color}`,
        boxShadow: `0 0 8px ${color}88`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13,
      }}>
        {icon}
      </div>

      {/* Label — only show on hover or always for key nodes */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(10,14,23,0.92)',
            border: `1px solid ${color}50`,
            borderRadius: 5,
            padding: '2px 7px',
            fontSize: '0.55rem',
            fontWeight: 700,
            color: color,
            whiteSpace: 'nowrap',
            letterSpacing: '0.04em',
            pointerEvents: 'none',
          }}
        >
          {label}
        </motion.div>
      )}

      {/* Always-visible small label for key nodes */}
      {!hovered && (
        <div style={{
          background: 'rgba(10,14,23,0.75)',
          border: `1px solid ${color}30`,
          borderRadius: 4,
          padding: '1px 5px',
          fontSize: '0.5rem',
          fontWeight: 600,
          color: color,
          whiteSpace: 'nowrap',
        }}>
          {label}
        </div>
      )}
    </motion.div>
  );
}

export default function CityMap({ nodes, edges }: Props) {
  // Build position map for dynamic nodes
  const posMap: Record<string, { x: number; y: number }> = {};
  nodes.forEach(n => {
    posMap[n.id] = nodePositions[n.id] ?? { x: 50, y: 50 };
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12 }}>

      {/* Map image */}
      <img
        src="/city-map.png"
        alt="City Map"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Slight dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)' }} />

      {/* SVG edges */}
      <svg
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {edges.map(edge => {
          const src = posMap[edge.source];
          const tgt = posMap[edge.target];
          if (!src || !tgt) return null;
          const color = edgeColors[edge.status] ?? '#22c55e';
          return (
            <line
              key={edge.id}
              x1={src.x} y1={src.y}
              x2={tgt.x} y2={tgt.y}
              stroke={color}
              strokeWidth="0.8"
              strokeDasharray={edge.status === 'alternative' ? '3 1.5' : undefined}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </svg>

      {/* Dynamic nodes from state */}
      {nodes.map(node => {
        const pos = posMap[node.id];
        if (!pos) return null;
        return (
          <NodeDot
            key={node.id}
            id={node.id}
            label={node.label}
            icon={nodeIcons[node.type] ?? '📍'}
            color={nodeColors[node.type] ?? '#64748b'}
            x={pos.x}
            y={pos.y}
            pulse={node.status === 'active'}
          />
        );
      })}

      {/* Extra static nodes matching the full map */}
      {extraNodes.map(node => (
        <NodeDot
          key={node.id}
          id={node.id}
          label={node.label}
          icon={node.icon}
          color={node.color}
          x={node.x}
          y={node.y}
          pulse={false}
        />
      ))}

      {/* Top-left label */}
      <div style={{
        position: 'absolute', top: 8, left: 8,
        background: 'rgba(10,14,23,0.88)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, padding: '5px 10px',
      }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>
          CITY OPERATIONS MAP
        </div>
        <div style={{ fontSize: '0.55rem', color: '#64748b', marginTop: 1 }}>
          Live disaster-response coordination
        </div>
      </div>

      {/* Legend bottom-right */}
      <div style={{
        position: 'absolute', bottom: 8, right: 8,
        background: 'rgba(10,14,23,0.88)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, padding: '6px 10px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {[
          { color: '#22c55e', label: 'Active route' },
          { color: '#ef4444', label: 'Blocked route' },
          { color: '#f59e0b', label: 'Alternative route' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 16, height: 2.5, background: l.color, borderRadius: 2 }} />
            <span style={{ fontSize: '0.55rem', color: '#94a3b8' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}