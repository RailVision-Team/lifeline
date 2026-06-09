'use client';
import { useCallback } from 'react';
import ReactFlow, {
  Background, Controls,
  Node, Edge, Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CityNode, CityEdge } from '@/types';

const nodeTypeColor: Record<string, string> = {
  camp: '#ef4444',
  warehouse: '#3b82f6',
  hospital: '#22c55e',
  command: '#a855f7',
  depot: '#64748b',
};

const edgeStatusColor: Record<string, string> = {
  active: '#22c55e',
  blocked: '#ef4444',
  alternative: '#f97316',
};

interface Props {
  nodes: CityNode[];
  edges: CityEdge[];
}

export default function CityMap({ nodes, edges }: Props) {
  const rfNodes: Node[] = nodes.map(n => ({
    id: n.id,
    position: { x: n.x, y: n.y },
    data: { label: n.label },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
      background: nodeTypeColor[n.type] + '22',
      border: `1px solid ${nodeTypeColor[n.type]}`,
      color: nodeTypeColor[n.type],
      fontSize: '0.65rem',
      fontFamily: 'var(--font-mono)',
      padding: '6px 10px',
      borderRadius: 2,
      boxShadow: `0 0 12px ${nodeTypeColor[n.type]}33`,
      minWidth: 90,
      textAlign: 'center' as const,
    },
  }));

  const rfEdges: Edge[] = edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: e.status === 'active',
    style: {
      stroke: edgeStatusColor[e.status],
      strokeWidth: e.status === 'blocked' ? 2 : 1.5,
      strokeDasharray: e.status === 'alternative' ? '6 3' : undefined,
    },
  }));

  return (
    <div className="w-full h-full" style={{ background: 'var(--bg-primary)' }}>
      <div className="panel-header">
        <span>⊞</span> Network Topology — Live View
        <span className="ml-auto flex items-center gap-3 text-xs">
          <span style={{ color: 'var(--accent-green)' }}>● Active</span>
          <span style={{ color: 'var(--accent-red)' }}>● Blocked</span>
          <span style={{ color: 'var(--accent-orange)' }}>● Alt Route</span>
        </span>
      </div>
      <div style={{ height: 'calc(100vh - 120px)' }}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          panOnDrag={true}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e2530" gap={24} size={1} />
          <Controls style={{ background: 'var(--bg-panel)', border: '1px solid var(--bg-panel-border)' }} />
        </ReactFlow>
      </div>
    </div>
  );
}