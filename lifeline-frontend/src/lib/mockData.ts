import { LifelineState } from '@/types';

export const mockState: LifelineState = {
  nodes: [
  {
    id: 'hospital',
    label: 'Hospital',
    type: 'hospital',
    status: 'active',
    x: 160,
    y: 120,
  },

  {
    id: 'cmd',
    label: 'Command Center',
    type: 'command',
    status: 'active',
    x: 560,
    y: 120,
  },

  {
    id: 'camp-a',
    label: 'Camp',
    type: 'camp',
    status: 'active',
    x: 780,
    y: 120,
  },

  {
    id: 'wh-b',
    label: 'Warehouse B',
    type: 'warehouse',
    status: 'active',
    x: 1180,
    y: 120,
  },

  {
    id: 'camp-b',
    label: 'Camp Beta',
    type: 'camp',
    status: 'warning',
    x: 1220,
    y: 320,
  },

  {
    id: 'depot-a',
    label: 'Depot A',
    type: 'depot',
    status: 'active',
    x: 260,
    y: 620,
  },

  {
    id: 'wh-a',
    label: 'Warehouse A',
    type: 'warehouse',
    status: 'active',
    x: 650,
    y: 620,
  },

  {
    id: 'depot-b',
    label: 'Depot B',
    type: 'depot',
    status: 'active',
    x: 1220,
    y: 620,
  },
],
  edges: [
    { id: 'e1', source: 'wh-a', target: 'camp-a', status: 'active' },
    { id: 'e2', source: 'wh-a', target: 'depot-a', status: 'active' },
    { id: 'e3', source: 'wh-b', target: 'camp-b', status: 'active' },
    { id: 'e4', source: 'wh-b', target: 'depot-b', status: 'active' },
    { id: 'e5', source: 'depot-a', target: 'hospital', status: 'active' },
    { id: 'e6', source: 'depot-b', target: 'hospital', status: 'active' },
    { id: 'e7', source: 'cmd', target: 'depot-a', status: 'active' },
    { id: 'e8', source: 'cmd', target: 'depot-b', status: 'active' },
    { id: 'e9', source: 'wh-a', target: 'camp-b', status: 'alternative' },
  ],
  agents: [
    { id: 'v1', name: 'Vehicle 1', type: 'vehicle', location: 'Warehouse A', destination: 'Camp Alpha', mission: 'Supply delivery', status: 'active' },
    { id: 'v2', name: 'Vehicle 2', type: 'vehicle', location: 'Depot B', destination: 'Camp Beta', mission: 'Rerouting via WH-A', status: 'rerouting' },
    { id: 'amb', name: 'Ambulance', type: 'ambulance', location: 'Hospital', destination: 'Camp Alpha', mission: 'Medical evacuation', status: 'active' },
    { id: 'truck', name: 'Supply Truck', type: 'truck', location: 'Warehouse B', destination: 'Hospital', mission: 'Critical supplies', status: 'active' },
  ],
  events: [
    { id: 'ev1', timestamp: '14:32:01', message: 'System initialized. All routes nominal.', severity: 'info' },
    { id: 'ev2', timestamp: '14:32:05', message: 'Agent Vehicle 1 assigned to Camp Alpha supply run.', severity: 'info' },
    { id: 'ev3', timestamp: '14:32:18', message: 'WARNING: Camp Beta reporting low food reserves.', severity: 'warning' },
    { id: 'ev4', timestamp: '14:32:22', message: 'Vehicle 2 rerouting — direct route evaluation in progress.', severity: 'warning' },
  ],
  metrics: {
    responseTime: 4.2,
    activeRoutes: 7,
    blockedRoutes: 0,
    demandFulfilled: 84,
    vehiclesActive: 4,
  },
  hardwareConnected: true,
};