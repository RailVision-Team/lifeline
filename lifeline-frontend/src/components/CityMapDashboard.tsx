'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { Agent, CityEdge, CityNode, EdgeStatus, NodeStatus } from '@/types';
import { Boxes, HeartPulse, Hospital, MapPinned, Package, ShieldCheck, Truck, Warehouse } from 'lucide-react';

const MAP_WIDTH = 1365;
const MAP_HEIGHT = 768;

const nodeMeta: Record<CityNode['type'], { icon: ReactNode; label: string; tint: string }> = {
  camp: { icon: <MapPinned className="h-4 w-4" />, label: 'Camp', tint: '#ef4444' },
  warehouse: { icon: <Warehouse className="h-4 w-4" />, label: 'Warehouse', tint: '#3b82f6' },
  hospital: { icon: <Hospital className="h-4 w-4" />, label: 'Hospital', tint: '#22c55e' },
  command: { icon: <ShieldCheck className="h-4 w-4" />, label: 'Command', tint: '#8b5cf6' },
  depot: { icon: <Boxes className="h-4 w-4" />, label: 'Depot', tint: '#64748b' },
};

const edgeMeta: Record<EdgeStatus, { stroke: string; dash?: string; glow: string; label: string }> = {
  active: { stroke: '#22c55e', dash: '10 8', glow: 'rgba(34,197,94,0.22)', label: 'Active route' },
  blocked: { stroke: '#ef4444', glow: 'rgba(239,68,68,0.22)', label: 'Blocked route' },
  alternative: { stroke: '#f59e0b', dash: '8 8', glow: 'rgba(245,158,11,0.18)', label: 'Alternative route' },
};

const locationAliases: Array<{ match: RegExp; nodeId: string; icon: ReactNode; accent: string }> = [
  { match: /warehouse a/i, nodeId: 'wh-a', icon: <Truck className="h-3.5 w-3.5" />, accent: '#3b82f6' },
  { match: /warehouse b/i, nodeId: 'wh-b', icon: <Package className="h-3.5 w-3.5" />, accent: '#3b82f6' },
  { match: /camp alpha/i, nodeId: 'camp-a', icon: <MapPinned className="h-3.5 w-3.5" />, accent: '#ef4444' },
  { match: /camp beta/i, nodeId: 'camp-b', icon: <MapPinned className="h-3.5 w-3.5" />, accent: '#ef4444' },
  { match: /depot a/i, nodeId: 'depot-a', icon: <Boxes className="h-3.5 w-3.5" />, accent: '#64748b' },
  { match: /depot b/i, nodeId: 'depot-b', icon: <Boxes className="h-3.5 w-3.5" />, accent: '#64748b' },
  { match: /hospital/i, nodeId: 'hospital', icon: <HeartPulse className="h-3.5 w-3.5" />, accent: '#22c55e' },
  { match: /command center/i, nodeId: 'cmd', icon: <ShieldCheck className="h-3.5 w-3.5" />, accent: '#8b5cf6' },
];

interface Props {
  nodes: CityNode[];
  edges: CityEdge[];
  agents?: Agent[];
  nodeStatuses?: Partial<Record<string, NodeStatus>>;
  edgeStatuses?: Partial<Record<string, EdgeStatus>>;
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  className?: string;
}

function toPctX(value: number) {
  return `${(value / MAP_WIDTH) * 100}%`;
}

function toPctY(value: number) {
  return `${(value / MAP_HEIGHT) * 100}%`;
}

function getNodeStatus(status?: NodeStatus) {
  if (status === 'blocked') return { label: 'BLOCKED', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
  if (status === 'warning') return { label: 'WATCH', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
  return { label: 'READY', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
}

function matchVehicleLocation(agent: Agent, nodes: CityNode[]) {
  const lower = agent.location.toLowerCase();
  const alias = locationAliases.find(item => item.match.test(lower));
  if (alias) {
    return nodes.find(node => node.id === alias.nodeId);
  }

  return nodes.find(node => agent.location.toLowerCase().includes(node.label.toLowerCase()));
}

export default function CityMapDashboard({
  nodes,
  edges,
  agents,
  nodeStatuses,
  edgeStatuses,
  title = 'City Operations Map',
  subtitle = 'Live disaster-response coordination',
  showLegend = true,
  className = '',
}: Props) {
  const nodeById = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);
  const vehiclePlacements = useMemo(
    () =>
      (agents ?? [])
        .map(agent => {
          const node = matchVehicleLocation(agent, nodes);
          return node ? { agent, node } : null;
        })
        .filter((item): item is { agent: Agent; node: CityNode } => Boolean(item)),
    [agents, nodes],
  );

  const vehiclesByNode = useMemo(() => {
    const grouped = new Map<string, { agent: Agent; icon: ReactNode; accent: string }[]>();

    vehiclePlacements.forEach(({ agent, node }) => {
      const alias = locationAliases.find(item => item.nodeId === node.id);
      const current = grouped.get(node.id) ?? [];
      current.push({
        agent,
        icon: alias?.icon ?? <Truck className="h-3.5 w-3.5" />,
        accent: alias?.accent ?? '#22c55e',
      });
      grouped.set(node.id, current);
    });

    return grouped;
  }, [vehiclePlacements]);

  return (
  <div
    className="relative h-full min-h-0 overflow-hidden rounded-2xl border border-[var(--bg-panel-border)]"
    style={{
      minHeight: '700px'
    }}
  >
      <div
  className="absolute inset-0 z-0"
  style={{
    backgroundImage: "url('/city-map.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
/>

      <svg className="absolute inset-0 z-10 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <marker id="routeArrowGreen" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="routeArrowRed" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="routeArrowAmber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {edges.map(edge => {
          const source = nodeById.get(edge.source);
          const target = nodeById.get(edge.target);
          if (!source || !target) return null;

          const status = edgeStatuses?.[edge.id] ?? edge.status;
          const meta = edgeMeta[status];
          const x1 = Number(toPctX(source.x).replace('%', ''));
          const y1 = Number(toPctY(source.y).replace('%', ''));
          const x2 = Number(toPctX(target.x).replace('%', ''));
          const y2 = Number(toPctY(target.y).replace('%', ''));
          const markerEnd = status === 'blocked' ? 'url(#routeArrowRed)' : status === 'alternative' ? 'url(#routeArrowAmber)' : 'url(#routeArrowGreen)';

          return (
            <motion.line
              key={edge.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              initial={false}
              animate={status === 'active' ? { strokeDashoffset: [0, -30] } : undefined}
              transition={status === 'active' ? { repeat: Infinity, duration: 1.2, ease: 'linear' } : undefined}
              stroke={meta.stroke}
              strokeWidth={status === 'blocked' ? 0.55 : 0.4}
              strokeLinecap="round"
              strokeDasharray={meta.dash}
              markerEnd={markerEnd}
              style={{ filter: `drop-shadow(0 0 6px ${meta.glow})` }}
            />
          );
        })}
      </svg>

      {nodes.map((node, index) => {
        const status = nodeStatuses?.[node.id] ?? node.status;
        const statusTone = getNodeStatus(status);
        const nodeVehicles = vehiclesByNode.get(node.id) ?? [];
        const meta = nodeMeta[node.type];

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: toPctX(node.x), top: toPctY(node.y) }}
          >
            {(status === 'warning' || status === 'blocked') && (
              <div
                className="absolute rounded-full blur-2xl"
                style={{
                  width: 110,
                  height: 110,
                  background: status === 'blocked' ? 'rgba(239,68,68,0.14)' : 'rgba(245,158,11,0.14)',
                }}
              />
            )}

            <div
  className="relative flex w-[120px] items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.18)] bg-white px-2 py-2 shadow-md"
  style={{ borderLeft: `4px solid ${meta.tint}` }}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ color: meta.tint, background: 'rgba(15,19,24,0.04)' }}>
                {meta.icon}
              </span>

              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-semibold text-slate-900">{node.label}</div>
                <div className="text-[8px] uppercase text-slate-500">{meta.label}</div>
                {/* {nodeVehicles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {nodeVehicles.slice(0, 2).map(entry => (
                      <span
                        key={entry.agent.id}
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                        style={{ borderColor: `${entry.accent}40`, background: `${entry.accent}12` }}
                      >
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full" style={{ color: entry.accent, background: 'rgba(255,255,255,0.6)' }}>
                          {entry.icon}
                        </span>
                        {entry.agent.name}
                      </span>
                    ))}
                  </div>
                )} */}
              </div>

              {/* <span className="self-start rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white" style={{ background: statusTone.bg, color: statusTone.color }}>
                {statusTone.label}
              </span> */}
            </div>
          </motion.div>
        );
      })}

      {showLegend && (
        <div className="absolute left-4 bottom-4 z-20 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,19,24,0.9)] px-3 py-2 shadow-[0_12px_28px_rgba(2,6,23,0.24)]">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">Route Legend</div>
          <div className="mt-2 grid gap-1.5 text-xs text-[var(--text-secondary)]">
            {Object.values(edgeMeta).map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.stroke, boxShadow: `0 0 8px ${item.glow}` }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute left-4 top-4 z-20 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,19,24,0.9)] px-3 py-2 shadow-[0_12px_28px_rgba(2,6,23,0.24)]">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">{title}</div>
        <div className="mt-1 text-sm text-white">{subtitle}</div>
      </div>
    </div>
  );
}