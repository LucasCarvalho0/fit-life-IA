"use client";

import Link from "next/link";

export default function SonoPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/configuracoes"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                Recuperação Anabólica
              </span>
              <h1 className="font-display text-base font-bold text-on-surface">Sono &amp; Prontidão</h1>
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Score 86/100
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-5">
        {/* Score Hero */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                Última Noite
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display text-3xl font-extrabold text-on-surface">7h 48m</span>
                <span className="text-xs text-on-surface-variant">/ Meta: 8h 00m</span>
              </div>
              <span className="text-xs text-positive font-bold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                97% da meta alcançada
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 flex flex-col items-center justify-center shrink-0">
              <span className="font-display text-lg font-extrabold leading-none">86</span>
              <span className="text-[9px] uppercase font-bold text-on-surface-variant">Score</span>
            </div>
          </div>

          {/* Sleep Phases breakdown */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-bold text-on-surface uppercase">Fases do Sono</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-surface-container-low p-2 rounded-xl border border-white/5 flex flex-col">
                <span className="text-[9px] uppercase text-primary font-bold">Profundo (N3)</span>
                <span className="font-display text-xs font-bold text-on-surface mt-0.5">1h 45m</span>
                <span className="text-[9px] text-on-surface-variant">GH &amp; Músculo</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-xl border border-white/5 flex flex-col">
                <span className="text-[9px] uppercase text-secondary font-bold">REM</span>
                <span className="font-display text-xs font-bold text-on-surface mt-0.5">1h 50m</span>
                <span className="text-[9px] text-on-surface-variant">Sistema Nervoso</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-xl border border-white/5 flex flex-col">
                <span className="text-[9px] uppercase text-on-surface-variant font-bold">Leve</span>
                <span className="font-display text-xs font-bold text-on-surface mt-0.5">4h 13m</span>
                <span className="text-[9px] text-on-surface-variant">Transição</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cronobiologia & Horários */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-on-surface">Horário Ideal de Dormir</h3>
            <span className="text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded-full font-bold">
              Ritmo Circadiano
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[22px]">nights_stay</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Janela de Repouso</span>
                <span className="text-[11px] text-on-surface-variant">Adormecer: 23:00 • Despertar: 07:00</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-primary">8h ideais</span>
          </div>
        </section>

        {/* Recomendações de Higiene do Sono */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tips_and_updates</span>
            <h3 className="font-display text-sm font-bold text-on-surface">Diretrizes para Hipertrofia</h3>
          </div>

          <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
            <div className="flex items-start gap-2 bg-surface-container-low p-2.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">coffee</span>
              <p>Evite cafeína após as <strong className="text-on-surface">15:00</strong> para manter a adenosina em níveis ideais de indução do sono profundo.</p>
            </div>
            <div className="flex items-start gap-2 bg-surface-container-low p-2.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">light_mode</span>
              <p>Reduza luzes azuis e telas <strong className="text-on-surface">60 minutos antes</strong> de deitar para proteger o pico de melatonina.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

