import { useState, useEffect } from 'react';
import { LifelineState } from '@/types';
import { mockState } from '@/lib/mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export function useLifelineState(intervalMs = 3000) {
  const [state, setState] = useState<LifelineState>(mockState);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      if (!API_BASE) return; // use mock if no backend URL set
      try {
        const res = await fetch(`${API_BASE}/state`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setState(data);
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
      // Simulate locally
      simulateDisaster(type, setState);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/disaster/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      setState(data);
    } finally {
      setLoading(false);
    }
  };

  return { state, loading, usingMock, triggerDisaster };
}

// Local simulation when backend isn't ready
function simulateDisaster(type: string, setState: React.Dispatch<React.SetStateAction<LifelineState>>) {
  if (type === 'reset') {
    setState(mockState);
    return;
  }

  setState(prev => {
    const newEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      message: type === 'flood'
        ? 'FLOOD DETECTED. Route Warehouse A → Camp Alpha submerged. Agents recalculating.'
        : type === 'bridge'
        ? 'BRIDGE COLLAPSE on Depot B → Hospital corridor. Emergency reroute initiated.'
        : 'SUPPLY CHAIN FAILURE at Warehouse B. Redistributing to Warehouse A.',
      severity: 'critical' as const,
    };

    const updatedEdges = prev.edges.map(e => {
      if (type === 'flood' && e.id === 'e1') return { ...e, status: 'blocked' as const };
      if (type === 'bridge' && e.id === 'e6') return { ...e, status: 'blocked' as const };
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