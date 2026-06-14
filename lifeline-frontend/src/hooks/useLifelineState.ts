import { useState, useEffect } from 'react';
import { LifelineState, CityNode, CityEdge, Agent, LogEvent } from '@/types';
import { mockState } from '@/lib/mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// Maps backend node IDs to display labels and types
const nodeMetaMap: Record<string, { label: string; type: CityNode['type']; x: number; y: number }> = {
  'camp1':          { label: 'Camp Alpha',     type: 'camp',      x: 150, y: 400 },
  'camp2':          { label: 'Camp Beta',      type: 'camp',      x: 700, y: 400 },
  'warehouse1':     { label: 'Warehouse A',    type: 'warehouse', x: 150, y: 100 },
  'warehouse2':     { label: 'Warehouse B',    type: 'warehouse', x: 650, y: 100 },
  'hospital1':      { label: 'Hospital',       type: 'hospital',  x: 400, y: 450 },
  'depot1':         { label: 'Depot A',        type: 'depot',     x: 200, y: 280 },
  'depot2':         { label: 'Depot B',        type: 'depot',     x: 600, y: 280 },
  'command_center': { label: 'Command Center', type: 'command',   x: 400, y: 250 },
};

// Maps backend agent type to frontend type
const agentTypeMap: Record<string, Agent['type']> = {
  'vehicle':     'vehicle',
  'ambulance':   'ambulance',
  'supply_truck': 'truck',
};

// Maps backend agent status to frontend status
const agentStatusMap: Record<string, Agent['status']> = {
  'active':    'active',
  'rerouting': 'rerouting',
  'blocked':   'blocked',
  'idle':      'idle',
};

function mapBackendToFrontend(data: any): LifelineState {
  // Map nodes
  const nodes: CityNode[] = (data.graph?.nodes ?? []).map((nodeId: string) => {
    const meta = nodeMetaMap[nodeId] ?? { label: nodeId, type: 'depot', x: 300, y: 300 };
    const isBlocked = data.disaster?.blocked_roads?.some((road: string) =>
      road.includes(nodeId)
    );
    return {
      id: nodeId,
      label: meta.label,
      type: meta.type,
      status: isBlocked ? 'blocked' : 'active',
      x: meta.x,
      y: meta.y,
    };
  });

  // Map edges
  const blockedRoads: string[] = data.disaster?.blocked_roads ?? [];
  const edges: CityEdge[] = (data.graph?.edges ?? []).map((edge: any[]) => {
    const source = edge[0];
    const target = edge[1];
    const edgeId = `${source}-${target}`;
    const reverseId = `${target}-${source}`;
    const isBlocked = blockedRoads.includes(edgeId) || blockedRoads.includes(reverseId);
    return {
      id: edgeId,
      source,
      target,
      status: isBlocked ? 'blocked' : 'active',
    };
  });

  // Map agents
  const agents: Agent[] = (data.agents ?? []).map((agent: any) => {
    const meta = nodeMetaMap[agent.current_location];
    return {
      id: agent.id,
      name: agent.id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      type: agentTypeMap[agent.type] ?? 'vehicle',
      location: meta?.label ?? agent.current_location,
      destination: 'En route',
      mission: agent.mission ?? 'On standby',
      status: agentStatusMap[agent.status] ?? 'idle',
    };
  });

  // Map events from event_log strings
const rawEvents = data.event_log ?? [];

const defaultEvents: LogEvent[] = [
  { id: 'sys-1', timestamp: new Date().toLocaleTimeString(), message: 'System operational. All agents on standby.', severity: 'info' },
  { id: 'sys-2', timestamp: new Date().toLocaleTimeString(), message: `Monitoring ${(data.graph?.nodes ?? []).length} network nodes.`, severity: 'info' },
  { id: 'sys-3', timestamp: new Date().toLocaleTimeString(), message: `${(data.agents ?? []).length} autonomous agents active and ready.`, severity: 'info' },
  { id: 'sys-4', timestamp: new Date().toLocaleTimeString(), message: 'Route optimization engine running.', severity: 'info' },
];

const events: LogEvent[] = rawEvents.length > 0
  ? rawEvents.map((msg: string, i: number) => {
      const severity: LogEvent['severity'] =
        msg.includes('blocked') || msg.includes('Disaster') ? 'critical'
        : msg.includes('AGENT') || msg.includes('AUTO') ? 'warning'
        : 'info';
      const timeMatch = msg.match(/\[(\d{2}:\d{2}:\d{2})\]/);
      const timestamp = timeMatch ? timeMatch[1] : new Date().toLocaleTimeString();
      const message = msg.replace(/\[\d{2}:\d{2}:\d{2}\]\s*/, '').trim();
      return { id: `ev-${i}`, timestamp, message, severity };
    }).reverse()
  : defaultEvents;

  // Map metrics
  const metrics = {
    responseTime: 4.2,
    activeRoutes: edges.filter(e => e.status === 'active').length,
    blockedRoutes: blockedRoads.length,
    demandFulfilled: data.metrics?.active_agents
      ? Math.round((data.metrics.active_agents / data.metrics.total_agents) * 100)
      : 84,
    vehiclesActive: data.metrics?.total_agents ?? 4,
  };

  return {
    nodes,
    edges,
    agents,
    events,
    metrics,
    hardwareConnected: true,
  };
}

function simulateDisaster(type: string, setState: React.Dispatch<React.SetStateAction<LifelineState>>) {
  if (type === 'reset') {
    setState(mockState);
    return;
  }

  setState(prev => {
    const newEvent: LogEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      message: type === 'flood'
        ? 'FLOOD DETECTED. Route Warehouse A → Camp Alpha submerged. Agents recalculating.'
        : type === 'bridge'
        ? 'BRIDGE COLLAPSE on Depot B → Hospital corridor. Emergency reroute initiated.'
        : 'SUPPLY CHAIN FAILURE at Warehouse B. Redistributing to Warehouse A.',
      severity: 'critical',
    };

    const updatedEdges = prev.edges.map(e => {
      if (type === 'flood' && e.id === 'warehouse1-depot1') return { ...e, status: 'blocked' as const };
      if (type === 'bridge' && e.id === 'hospital1-depot2') return { ...e, status: 'blocked' as const };
      return e;
    });

    const blockedCount = updatedEdges.filter(e => e.status === 'blocked').length;
    const activeCount = updatedEdges.filter(e => e.status === 'active').length;

    return {
      ...prev,
      edges: updatedEdges,
      events: [newEvent, ...prev.events].slice(0, 50),
      metrics: {
        ...prev.metrics,
        blockedRoutes: blockedCount,
        activeRoutes: activeCount,
      },
    };
  });
}

export function useLifelineState(intervalMs = 3000) {
  const [state, setState] = useState<LifelineState>(mockState);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      if (!API_BASE) return;
      try {
        const res = await fetch(`${API_BASE}/simulation/status`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setState(mapBackendToFrontend(data));
        setUsingMock(false);
      } catch {
        // silently fall back to mock
      }
    };

    fetchState();
    const interval = setInterval(fetchState, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  const triggerDisaster = async (type: string) => {
    if (!API_BASE) {
      simulateDisaster(type, setState);
      return;
    }
    setLoading(true);
    try {
      if (type === 'reset') {
        await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
      } else {
        await fetch(`${API_BASE}/disaster/trigger?disaster_type=${type}`, { method: 'POST' });
      }
      // Fetch updated state after trigger
      const res = await fetch(`${API_BASE}/simulation/status`);
      const data = await res.json();
      setState(mapBackendToFrontend(data));
      setUsingMock(false);
    } catch {
      simulateDisaster(type, setState);
    } finally {
      setLoading(false);
    }
  };

  return { state, loading, usingMock, triggerDisaster };
}