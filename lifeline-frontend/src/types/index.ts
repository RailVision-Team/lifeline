export type NodeStatus = 'active' | 'blocked' | 'warning';
export type EdgeStatus = 'active' | 'blocked' | 'alternative';
export type AgentStatus = 'active' | 'rerouting' | 'blocked' | 'idle';

export interface CityNode {
  id: string;
  label: string;
  type: 'camp' | 'warehouse' | 'hospital' | 'depot' | 'command';
  status: NodeStatus;
  x: number;
  y: number;
}

export interface CityEdge {
  id: string;
  source: string;
  target: string;
  status: EdgeStatus;
}

export interface Agent {
  id: string;
  name: string;
  type: 'vehicle' | 'ambulance' | 'truck';
  location: string;
  destination: string;
  mission: string;
  status: AgentStatus;
}

export interface LogEvent {
  id: string;
  timestamp: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface Metrics {
  responseTime: number;
  activeRoutes: number;
  blockedRoutes: number;
  demandFulfilled: number;
  vehiclesActive: number;
}

export interface LifelineState {
  nodes: CityNode[];
  edges: CityEdge[];
  agents: Agent[];
  events: LogEvent[];
  metrics: Metrics;
  hardwareConnected: boolean;
}