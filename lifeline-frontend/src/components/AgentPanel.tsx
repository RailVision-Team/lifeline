'use client';
import { Agent } from '@/types';
import { motion } from 'framer-motion';
import { HeartPulse, Package, Truck } from 'lucide-react';
import { ReactNode } from 'react';

const typeMeta: Record<Agent['type'], { icon: ReactNode; label: string }> = {
  vehicle: { icon: <Truck className="h-4 w-4" />, label: 'Vehicle' },
  ambulance: { icon: <HeartPulse className="h-4 w-4" />, label: 'Ambulance' },
  truck: { icon: <Package className="h-4 w-4" />, label: 'Supply Truck' },
};

const statusTone: Record<Agent['status'], { label: string; text: string; border: string; background: string }> = {
  active: {
    label: 'Active',
    text: 'var(--accent-green)',
    border: 'rgba(34, 197, 94, 0.24)',
    background: 'rgba(34, 197, 94, 0.12)',
  },
  rerouting: {
    label: 'Rerouting',
    text: 'var(--accent-amber)',
    border: 'rgba(245, 158, 11, 0.24)',
    background: 'rgba(245, 158, 11, 0.12)',
  },
  blocked: {
    label: 'Blocked',
    text: 'var(--accent-red)',
    border: 'rgba(239, 68, 68, 0.24)',
    background: 'rgba(239, 68, 68, 0.12)',
  },
  idle: {
    label: 'Idle',
    text: 'var(--text-secondary)',
    border: 'rgba(148, 163, 184, 0.24)',
    background: 'rgba(148, 163, 184, 0.08)',
  },
};

export default function AgentPanel({ agents }: { agents: Agent[] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[rgba(17,24,39,0.95)]">
      <div className="panel-header border-b border-[var(--bg-panel-border)] bg-[rgba(255,255,255,0.02)] text-[0.8rem] uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        <span>◈</span> Vehicle Fleet
      </div>
      <div className="scroll-surface flex-1 overflow-y-auto p-0">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.22 }}
            whileHover={{ y: -2 }}
            className="border-b border-[var(--bg-panel-border)] px-3 py-3 transition-colors hover:bg-[rgba(255,255,255,0.03)] last:border-b-0"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--bg-panel-border)] bg-[rgba(255,255,255,0.04)] text-[var(--text-primary)] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                {typeMeta[agent.type].icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold text-white">{agent.name}</div>
                    <div className="mt-1 text-sm text-[var(--text-secondary)]">
                      {agent.location} → {agent.destination}
                    </div>
                  </div>

                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      color: statusTone[agent.status].text,
                      borderColor: statusTone[agent.status].border,
                      background: statusTone[agent.status].background,
                    }}
                  >
                    <span className="mr-1.5 h-2 w-2 rounded-full" style={{ background: statusTone[agent.status].text }} />
                    {statusTone[agent.status].label}
                  </span>
                </div>

                <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">{agent.mission}</div>
                <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="h-2 w-2 rounded-full" style={{ background: statusTone[agent.status].text }} />
                  {typeMeta[agent.type].label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}