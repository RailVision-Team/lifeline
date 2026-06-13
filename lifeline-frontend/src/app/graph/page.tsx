'use client';

import Link from 'next/link';
import { useLifelineState } from '@/hooks/useLifelineState';
import CityMap from '@/components/CityMap';

export default function GraphPage() {
  const { state } = useLifelineState(3000);

  return (
    <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--bg-panel-border)] bg-[rgba(13,17,23,0.97)] px-5 py-4">
        <div>
          <div className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-white">Network Topology Analysis</div>
          <div className="mt-1 text-sm text-[var(--text-secondary)]">Technical routing and autonomous graph inspection</div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <Link href="/" className="rounded-full border border-[var(--bg-panel-border)] px-3 py-1.5 text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-green)] hover:text-white">
            Dashboard
          </Link>
          <Link href="/map" className="rounded-full border border-[var(--bg-panel-border)] px-3 py-1.5 text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-green)] hover:text-white">
            City Map
          </Link>
          <span className="rounded-full border border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.08)] px-3 py-1.5 text-[var(--accent-green)]">
            Network Graph
          </span>
        </div>
      </header>

      <main className="min-h-0 flex-1 p-4">
        <div className="h-full min-h-0 overflow-hidden rounded-2xl border border-[var(--bg-panel-border)] bg-[rgba(17,24,39,0.9)] shadow-[0_18px_40px_rgba(2,6,23,0.24)]">
          <CityMap nodes={state.nodes} edges={state.edges} />
        </div>
      </main>
    </div>
  );
}