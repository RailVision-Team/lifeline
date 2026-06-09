'use client';
import { Agent } from '@/types';
import { motion } from 'framer-motion';

const typeIcon: Record<string, string> = {
  vehicle: '🚙', ambulance: '🚑', truck: '🚛'
};

export default function AgentPanel({ agents }: { agents: Agent[] }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div className="panel-header">
        <span>◈</span> Field Agents
      </div>
      <div className="flex-1 overflow-y-auto">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="px-3 py-2 border-b"
            style={{ borderColor: 'var(--bg-panel-border)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="status-dot" style={{
                background: agent.status === 'active' ? 'var(--accent-green)'
                  : agent.status === 'rerouting' ? 'var(--accent-amber)'
                  : agent.status === 'blocked' ? 'var(--accent-red)'
                  : 'var(--text-dim)',
                boxShadow: agent.status === 'active' ? '0 0 6px var(--accent-green)'
                  : agent.status === 'rerouting' ? '0 0 6px var(--accent-amber)'
                  : agent.status === 'blocked' ? '0 0 6px var(--accent-red)'
                  : 'none'
              }} />
              <span className="text-sm font-600" style={{ fontFamily: 'var(--font-condensed)', fontWeight: 600 }}>
                {typeIcon[agent.type]} {agent.name}
              </span>
            </div>
            <div className="text-xs mono" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <div>LOC: {agent.location}</div>
              <div>DST: {agent.destination}</div>
              <div style={{ color: 'var(--text-dim)', marginTop: 2 }}>{agent.mission}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}