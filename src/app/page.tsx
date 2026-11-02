import Link from "next/link";
import { FitLifeLogo } from "@/components/brand/logo";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 py-10 bg-surface text-on-surface">
      {/* Top Brand com Logo Oficial */}
      <div className="flex flex-col items-center text-center pt-4">
        <FitLifeLogo size="xl" className="mb-4" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-[10px] font-bold border border-white/5 mb-2">
          <span>DIA 1 • INICIE SUA TRANSFORMAÇÃO</span>
        </div>
        <p className="mt-1 text-sm text-on-surface-variant max-w-xs leading-relaxed">
          Treino, nutrição e recomposição corporal guiados por algoritmos fisiológicos e IA adaptativa.
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-col gap-2.5 my-8">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Questionário Inteligente</span>
            <span className="text-[11px] text-on-surface-variant">Calibração inicial de metas, dieta e treino</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">fitness_center</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Treino Personalizado</span>
            <span className="text-[11px] text-on-surface-variant">Prescrito para os aparelhos da sua academia</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">restaurant</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Nutrição &amp; TDEE Determinístico</span>
            <span className="text-[11px] text-on-surface-variant">Cálculo Mifflin-St Jeor calibrado</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2.5">
        <Link
          href="/onboarding"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 font-display text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
        >
          <span>Iniciar Questionário (Dia 1)</span>
          <span className="material-symbols-outlined text-[18px] ml-1.5">arrow_forward</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex-1 inline-flex min-h-11 items-center justify-center rounded-xl bg-surface-container border border-white/5 px-4 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Ir ao Dashboard
          </Link>
          <Link
            href="/login"
            className="flex-1 inline-flex min-h-11 items-center justify-center rounded-xl bg-surface-container border border-white/5 px-4 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
