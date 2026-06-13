'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLifelineState } from '@/hooks/useLifelineState';
import CityMapDashboard from '@/components/CityMapDashboard';
import { CityEdge, CityNode, EdgeStatus, NodeStatus } from '@/types';

export default function MapPage() {
  const { state, triggerDisaster } = useLifelineState(3000);
  const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});
  const [edgeStatuses, setEdgeStatuses] = useState<Record<string, EdgeStatus>>({});

  useEffect(() => {
    setNodeStatuses(Object.fromEntries(state.nodes.map(node => [node.id, node.status])) as Record<string, NodeStatus>);
    setEdgeStatuses(Object.fromEntries(state.edges.map(edge => [edge.id, edge.status])) as Record<string, EdgeStatus>);
  }, [state.nodes, state.edges]);

  const applyDisaster = (type: string) => {
    setNodeStatuses(prev => {
      const next = { ...prev };
      if (type === 'flood') {
        next['wh-b'] = 'warning';
        next['camp-a'] = 'warning';
      } else if (type === 'bridge') {
        next['depot-b'] = 'blocked';
        next['camp-b'] = 'warning';
      } else if (type === 'supply') {
        next['wh-a'] = 'warning';
        next['depot-a'] = 'warning';
      }
      return next;
    });

    setEdgeStatuses(prev => {
      const next = { ...prev };
      if (type === 'flood') {
        next['e3'] = 'blocked';
        next['e4'] = 'alternative';
      } else if (type === 'bridge') {
        next['e6'] = 'blocked';
        next['e8'] = 'alternative';
      } else if (type === 'supply') {
        next['e1'] = 'blocked';
        next['e2'] = 'alternative';
      }
      return next;
    });

    void triggerDisaster(type);
  };

  return (
    <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--bg-panel-border)] bg-[rgba(13,17,23,0.97)] px-5 py-4">
        <div>
          <div className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-white">City Map</div>
          <div className="mt-1 text-sm text-[var(--text-secondary)]">Full-screen operational awareness</div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <Link href="/" className="rounded-full border border-[var(--bg-panel-border)] px-3 py-1.5 text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-green)] hover:text-white">
            Dashboard
          </Link>
          <span className="rounded-full border border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.08)] px-3 py-1.5 text-[var(--accent-green)]">
            City Map
          </span>
          <Link href="/graph" className="rounded-full border border-[var(--bg-panel-border)] px-3 py-1.5 text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-green)] hover:text-white">
            Network Graph
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-end gap-2 border-b border-[var(--bg-panel-border)] bg-[rgba(15,19,24,0.94)] px-5 py-3">
        <button onClick={() => applyDisaster('flood')} className="rounded-lg border border-[rgba(59,130,246,0.28)] bg-[rgba(59,130,246,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-blue)]">
          Flood
        </button>
        <button onClick={() => applyDisaster('bridge')} className="rounded-lg border border-[rgba(239,68,68,0.28)] bg-[rgba(239,68,68,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-red)]">
          Bridge Collapse
        </button>
        <button onClick={() => applyDisaster('supply')} className="rounded-lg border border-[rgba(245,158,11,0.28)] bg-[rgba(245,158,11,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-amber)]">
          Supply Failure
        </button>
      </div>

      <main className="min-h-0 flex-1 p-4">
        <CityMapDashboard
          nodes={state.nodes as CityNode[]}
          edges={state.edges as CityEdge[]}
          agents={state.agents}
          nodeStatuses={nodeStatuses}
          edgeStatuses={edgeStatuses}
          title="Emergency Operations Map"
          subtitle="Live city overview with route and disaster overlays"
          className="h-full"
        />
      </main>
    </div>
  );
}
