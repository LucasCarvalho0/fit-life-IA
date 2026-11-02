"use client";

import Link from "next/link";

export default function ResumoPosTreinoPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">emoji_events</span>
            <h1 className="font-display text-lg font-bold text-on-surface">Resumo Pós-Treino</h1>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Pular
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-10 flex flex-col gap-5">
        {/* Hero Celebration */}
        <section className="relative overflow-hidden rounded-3xl bg-surface-container p-5 border border-primary/20 shadow-2xl flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Sessão Registrada no Banco
            </span>
            <h2 className="font-display text-2xl font-extrabold text-on-surface mt-1">
              Excelente Treino! 💪
            </h2>
            <p className="text-xs text-on-surface-variant max-w-xs mt-1">
              Treino B: Dorsal, Trapézio &amp; Bíceps finalizado com sobrecarga progressiva validada.
            </p>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 gap-2 w-full mt-2">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-high/60 border border-white/5">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">Volume Total</span>
              <span className="font-display text-xl font-extrabold text-on-surface mt-0.5">12.450 <span className="text-xs font-normal text-on-surface-variant">kg</span></span>
              <span className="text-[10px] text-positive font-bold mt-0.5">+4.8% vs semana ant.</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-high/60 border border-white/5">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">Duração Total</span>
              <span className="font-display text-xl font-extrabold text-on-surface mt-0.5">54 <span className="text-xs font-normal text-on-surface-variant">min</span></span>
              <span className="text-[10px] text-primary font-bold mt-0.5">18 séries concluídas</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-high/60 border border-white/5">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">Gasto Calórico</span>
              <span className="font-display text-xl font-extrabold text-tertiary mt-0.5">365 <span className="text-xs font-normal text-on-surface-variant">kcal</span></span>
              <span className="text-[10px] text-on-surface-variant mt-0.5">Metabolismo elevado</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-high/60 border border-white/5">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">Intensidade Média</span>
              <span className="font-display text-xl font-extrabold text-secondary mt-0.5">RPE 8.5</span>
              <span className="text-[10px] text-secondary font-bold mt-0.5">Zona Hipertrófica</span>
            </div>
          </div>
        </section>

        {/* PRs & Recordes Pessoais */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">stars</span>
            <h3 className="font-display text-sm font-bold text-on-surface">Recordes Batidos Hoje (PRs)</h3>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  🏆
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Puxada Alta na Polia</span>
                  <span className="text-[10px] text-on-surface-variant">4x 10 reps @ 65.0 kg (+2.5 kg)</span>
                </div>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Novo PR
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">
                  📈
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">1RM Estimado (Costas)</span>
                  <span className="text-[10px] text-on-surface-variant">De 82.0 kg para 86.6 kg (Brzycki)</span>
                </div>
              </div>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                +5.6%
              </span>
            </div>
          </div>
        </section>

        {/* Recomendações de Recuperação IA */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">healing</span>
            <h3 className="font-display text-sm font-bold text-on-surface">Próximos Passos &amp; Recuperação</h3>
          </div>

          <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
            <div className="flex items-start gap-2 bg-surface-container-low p-2.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">restaurant</span>
              <p>Consuma pelo menos <strong className="text-on-surface">35g a 40g de proteína</strong> na próxima refeição para otimizar a síntese proteica (MPS).</p>
            </div>
            <div className="flex items-start gap-2 bg-surface-container-low p-2.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">bedtime</span>
              <p>Janela de recuperação de dorsal: <strong className="text-on-surface">48h a 72h</strong>. Próximo treino focado em membros inferiores (Pernas).</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="w-full min-h-[48px] rounded-xl bg-primary text-on-primary font-display text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <span>Salvar e Voltar ao Início</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

