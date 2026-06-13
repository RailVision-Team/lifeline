'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CityNode, CityEdge } from '@/types';

const nodePositions: Record<string, { x: number; y: number }> = {
  'hospital':  { x: 22, y: 22 },
  'wh-a':      { x: 22, y: 30 },
  'wh-b':      { x: 78, y: 22 },
  'camp-a':    { x: 52, y: 18 },
  'camp-b':    { x: 72, y: 52 },
  'cmd':       { x: 46, y: 52 },
  'depot-a':   { x: 33, y: 58 },
  'depot-b':   { x: 62, y: 58 },
};

const nodeColors: Record<string, string> = {
  camp:      '#ef4444',
  warehouse: '#3b82f6',
  hospital:  '#22c55e',
  command:   '#8b5cf6',
  depot:     '#64748b',
};

const nodeIcons: Record<string, string> = {
  camp:      '⛺',
  warehouse: '🏭',
  hospital:  '🏥',
  command:   '🛡️',
  depot:     '📦',
};

const statusColors: Record<string, string> = {
  active:      '#22c55e',
  blocked:     '#ef4444',
  alternative: '#f59e0b',
};

interface Props {
  nodes: CityNode[];
  edges: CityEdge[];
}

export default function CityMap({ nodes, edges }: Props) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Build a position lookup from node id
  const posMap: Record<string, { x: number; y: number }> = {};
  nodes.forEach(n => {
    posMap[n.id] = nodePositions[n.id] ?? { x: 50, y: 50 };
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 14 }}>

      {/* City map image as background */}
      <img
        src="/city-map.png"
        alt="City Map"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)' }} />

      {/* SVG layer for edges */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {edges.map(edge => {
          const src = posMap[edge.source];
          const tgt = posMap[edge.target];
          if (!src || !tgt) return null;
          const color = statusColors[edge.status] ?? '#22c55e';
          return (
            <line
              key={edge.id}
              x1={src.x} y1={src.y}
              x2={tgt.x} y2={tgt.y}
              stroke={color}
              strokeWidth="0.4"
              strokeDasharray={edge.status === 'alternative' ? '2 1' : undefined}
              opacity={0.7}
            />
          );
        })}
      </svg>

      {/* Node overlays */}
      {nodes.map(node => {
        const pos = posMap[node.id];
        if (!pos) return null;
        const color = nodeColors[node.type] ?? '#64748b';
        const isHovered = hoveredNode === node.id;

        return (
          <motion.div
            key={node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            whileHover={{ scale: 1.15 }}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
              zIndex: isHovered ? 10 : 1,
            }}
          >
            {/* Pulse ring for active */}
            {node.status === 'active' && (
              <motion.div
                style={{
                  position: 'absolute',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: `2px solid ${color}`,
                  top: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            )}

            {/* Icon circle */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: color + '33',
              border: `2px solid ${color}`,
              boxShadow: `0 0 10px ${color}66`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}>
              {nodeIcons[node.type]}
            </div>

            {/* Label */}
            <div style={{
              background: 'rgba(0,0,0,0.82)',
              border: `1px solid ${color}40`,
              borderRadius: 5,
              padding: '2px 6px',
              fontSize: '0.55rem',
              fontWeight: 600,
              color: color,
              whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
            }}>
              {node.label}
            </div>
          </motion.div>
        );
      })}

      {/* Top-left label */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(13,17,23,0.88)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '6px 10px',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>CITY OPERATIONS MAP</div>
        <div style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', marginTop: 2 }}>Live disaster-response coordination</div>
      </div>

      {/* Legend bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        background: 'rgba(13,17,23,0.88)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '6px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {[
          { color: '#22c55e', label: 'Active route' },
          { color: '#ef4444', label: 'Blocked route' },
          { color: '#f59e0b', label: 'Alternative route' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 18, height: 2, background: l.color, borderRadius: 2 }} />
            <span style={{ fontSize: '0.58rem', color: 'var(--text-secondary)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}