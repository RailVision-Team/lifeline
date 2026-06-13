'use client';

import Image from 'next/image';

interface Props {
  nodes: unknown[];
}

export default function CityImageMap({ nodes }: Props) {
  return (
    <div className="relative h-full min-h-0 overflow-hidden rounded-2xl border border-[var(--bg-panel-border)] bg-[#0f1318] shadow-[0_18px_40px_rgba(2,6,23,0.24)]">
      <div className="absolute inset-0">
        <Image src="/city-map.png" alt="City map" fill className="object-cover" priority />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,17,23,0.12),rgba(13,17,23,0.08))]" />

      <div className="absolute left-4 top-4 z-10 rounded-xl border border-[var(--bg-panel-border)] bg-[rgba(15,19,24,0.92)] px-3 py-2 shadow-[0_12px_28px_rgba(2,6,23,0.28)]">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">CITY MAP</div>
        <div className="mt-1 text-sm text-white">Overview of the operational grid</div>
      </div>

      <div className="absolute right-4 top-4 z-10 rounded-full border border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.08)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-green)] shadow-[0_12px_28px_rgba(2,6,23,0.22)]">
        Live image view
      </div>

      <div className="absolute inset-x-4 bottom-4 z-10 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(15,19,24,0.7)] px-3 py-2 text-xs text-[var(--text-secondary)] shadow-[0_12px_28px_rgba(2,6,23,0.2)]">
        The dashboard now shows the city image directly. Open the full city view for interactive controls.
      </div>
    </div>
  );
}
