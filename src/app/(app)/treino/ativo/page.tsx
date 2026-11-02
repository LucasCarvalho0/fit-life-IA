"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ModoTreinoAtivoPage() {
  const router = useRouter();

  // Elapsed workout time
  const [elapsedSeconds, setElapsedSeconds] = useState(1458); // 24:18

  // Rest timer
  const totalRestSeconds = 75;
  const [restSeconds, setRestSeconds] = useState(72); // 01:12
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Active set state (Série 3)
  const [serie3Weight, setSerie3Weight] = useState(65.0);
  const [serie3Reps, setSerie3Reps] = useState(10);
  const [serie3Completed, setSerie3Completed] = useState(false);

  // Timer intervals
  useEffect(() => {
    const elapsedInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(elapsedInterval);
  }, []);

  useEffect(() => {
    if (!isTimerRunning) return;
    const restInterval = setInterval(() => {
      setRestSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(restInterval);
  }, [isTimerRunning]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const adjustTimer = (delta: number) => {
    setRestSeconds((prev) => Math.max(0, prev + delta));
  };

  const adjustWeight = (delta: number) => {
    setSerie3Weight((prev) => Math.max(0, Math.round((prev + delta) * 10) / 10));
  };

  const adjustReps = (delta: number) => {
    setSerie3Reps((prev) => Math.max(1, prev + delta));
  };

  const handleCompleteSerie3 = () => {
    setSerie3Completed(true);
    setRestSeconds(90);
    setIsTimerRunning(true);
  };

  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const timerRatio = Math.min(1, Math.max(0, restSeconds / totalRestSeconds));
  const strokeDashoffset = circumference - timerRatio * circumference;

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface text-on-surface">
      {/* 1. Header Oficial Fixo */}
      <header className="sticky top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/treino"
              aria-label="Pausar ou Sair do Treino"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[26px]">pause_circle</span>
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Sessão Ativa</span>
              <h1 className="font-display text-sm font-bold text-on-surface truncate">Active Workout</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-white/5">
              <span className="material-symbols-outlined text-primary text-[16px] animate-pulse">timer</span>
              <span className="text-xs font-mono font-bold text-on-surface">34:12</span>
            </div>
            <Link
              href="/configuracoes"
              className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Treino Ativo */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-12 flex flex-col gap-4">
        {/* Top Header de Treino Ativo */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold uppercase tracking-wider border border-white/5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                AO VIVO
              </span>
              <span className="text-xs text-on-surface-variant font-mono">{formatTime(elapsedSeconds)} decorridos</span>
            </div>
            <Link
              href="/treino/resumo"
              className="px-3 py-1 rounded-full bg-surface-container-high border border-error/30 text-error text-xs font-bold active:scale-95 transition-transform flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">stop_circle</span>
              <span>Finalizar</span>
            </Link>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-on-surface tracking-tight">
              Treino B: Dorsal, Trapézio &amp; Bíceps
            </h2>
            <div className="flex items-center justify-between mt-1 mb-1.5 text-xs">
              <span className="text-on-surface-variant font-medium">Exercício 1 de 6 • 8/18 séries</span>
              <span className="text-primary font-bold">44%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "44%" }} />
            </div>
          </div>
        </section>

        {/* 2. Exercício em Foco Atual (Card Principal de Destaque) */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Aparelho Smart Fit #14 • Polia Dupla
              </span>
              <h3 className="font-display text-base font-bold text-on-surface truncate mt-0.5">
                Puxada Alta na Polia
              </h3>
              <p className="text-xs text-on-surface-variant">Pegada Pronada Aberta</p>
            </div>
            <Link
              href="/treino/substituicao?exercise=Puxada%20Alta"
              className="shrink-0 px-3 py-1.5 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold active:scale-95 transition-transform flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary">swap_horiz</span>
              <span>Trocar</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface-variant text-[11px] border border-white/5">
              <span className="material-symbols-outlined text-[14px] text-primary">my_location</span>
              <span>Foco: Largura Dorsal (Tensão Máxima)</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface-variant text-[11px] border border-white/5">
              <span className="material-symbols-outlined text-[14px] text-secondary">history</span>
              <span>Semana ant: 62.5 kg</span>
            </span>
          </div>
        </section>

        {/* 3. Cronômetro de Descanso Gigante & Frequência Cardíaca */}
        <section className="bg-surface-container-low rounded-2xl p-4 border border-white/5 shadow-lg flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">timelapse</span>
              Intervalo de Recuperação
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-white/5">
              <span className="material-symbols-outlined text-[16px] text-error animate-pulse">favorite</span>
              <span className="text-xs font-mono font-bold text-on-surface">138 BPM</span>
              <span className="text-[10px] text-primary font-bold">Z3</span>
            </div>
          </div>

          {/* Visor Circular Imersivo SVG */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                className="text-surface-container-highest"
                cx="80"
                cy="80"
                fill="none"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-primary transition-all duration-1000"
                cx="80"
                cy="80"
                fill="none"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display text-3xl font-extrabold text-on-surface font-mono tracking-tight">
                {formatTime(restSeconds)}
              </span>
              <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider mt-0.5">
                {restSeconds}s Restantes
              </span>
            </div>
          </div>

          {/* Controles Rápidos Ergonômicos */}
          <div className="grid grid-cols-4 gap-2 w-full mt-1">
            <button
              type="button"
              onClick={() => adjustTimer(-15)}
              className="py-2.5 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold active:scale-95 transition-transform flex items-center justify-center"
            >
              -15s
            </button>
            <button
              type="button"
              onClick={() => adjustTimer(30)}
              className="py-2.5 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold active:scale-95 transition-transform flex items-center justify-center"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="py-2.5 rounded-xl bg-surface-container-high border border-white/5 text-on-surface flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isTimerRunning ? "pause" : "play_arrow"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRestSeconds(0)}
              className="py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs active:scale-95 transition-transform flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Pular</span>
              <span className="material-symbols-outlined text-[16px]">fast_forward</span>
            </button>
          </div>

          {/* AI Telemetry Alert Box */}
          <div className="w-full mt-3 p-3 rounded-xl bg-surface-container border border-white/5 flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">psychology</span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface font-semibold">Sugestão FitLife IA:</strong> Tempo ideal para restabelecimento de fosfocreatina (CP) antes do set de alta intensidade.
            </p>
          </div>
        </section>

        {/* 4. Tabela Interativa de Séries do Exercício Atual */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h4 className="font-display text-sm font-bold text-on-surface">Séries da Puxada</h4>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Meta: 4 Séries</span>
          </div>

          {/* Série 1: Concluída */}
          <div className="bg-surface-container rounded-2xl p-3.5 border border-white/5 flex items-center justify-between opacity-80">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <div>
                <span className="text-xs font-bold text-on-surface">1 • Aquecimento</span>
                <p className="text-[11px] text-on-surface-variant font-mono">45 kg × 15 reps</p>
              </div>
            </div>
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Concluída</span>
          </div>

          {/* Série 2: Concluída */}
          <div className="bg-surface-container rounded-2xl p-3.5 border border-white/5 flex items-center justify-between opacity-80">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <div>
                <span className="text-xs font-bold text-on-surface">2 • Trabalho</span>
                <p className="text-[11px] text-on-surface-variant font-mono">65 kg × 10 reps</p>
              </div>
            </div>
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Concluída</span>
          </div>

          {/* Série 3: ATIVA / EM ANDAMENTO */}
          <div className="bg-surface-container rounded-2xl p-4 border-2 border-primary shadow-xl relative overflow-hidden flex flex-col gap-3">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
            <div className="flex items-center justify-between pl-1">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold animate-pulse">
                  3
                </span>
                <div>
                  <span className="text-xs font-bold text-on-surface">
                    {serie3Completed ? "Série 3 (Concluída)" : "Série 3 (Ativa)"}
                  </span>
                  <span className="text-[10px] text-primary ml-1.5 uppercase font-bold tracking-wider">
                    Trabalho Pesado
                  </span>
                </div>
              </div>
              <div className="px-2.5 py-0.5 rounded-md bg-surface-container-high border border-white/5 text-on-surface text-[10px] font-semibold">
                RPE 8.5
              </div>
            </div>

            {/* Ajuste de Carga e Reps */}
            <div className="grid grid-cols-2 gap-3 pl-1">
              {/* Carga */}
              <div className="bg-surface-container-high rounded-xl p-2.5 border border-white/5 flex flex-col items-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Carga</span>
                <div className="flex items-center justify-between w-full">
                  <button
                    type="button"
                    onClick={() => adjustWeight(-2.5)}
                    className="w-9 h-9 rounded-lg bg-surface-container-highest text-on-surface active:scale-95 flex items-center justify-center font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-on-surface font-mono">
                    {serie3Weight} <span className="text-[10px] font-normal text-on-surface-variant">kg</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustWeight(2.5)}
                    className="w-9 h-9 rounded-lg bg-surface-container-highest text-on-surface active:scale-95 flex items-center justify-center font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                {/* Quick add pills */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => adjustWeight(2.5)}
                    className="px-2.5 py-0.5 rounded-md bg-surface-container-lowest text-primary text-[10px] font-bold font-mono border border-white/5 active:scale-95"
                  >
                    +2.5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustWeight(5.0)}
                    className="px-2.5 py-0.5 rounded-md bg-surface-container-lowest text-primary text-[10px] font-bold font-mono border border-white/5 active:scale-95"
                  >
                    +5.0
                  </button>
                </div>
              </div>

              {/* Repetições */}
              <div className="bg-surface-container-high rounded-xl p-2.5 border border-white/5 flex flex-col items-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Repetições</span>
                <div className="flex items-center justify-between w-full">
                  <button
                    type="button"
                    onClick={() => adjustReps(-1)}
                    className="w-9 h-9 rounded-lg bg-surface-container-highest text-on-surface active:scale-95 flex items-center justify-center font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-on-surface font-mono">
                    {serie3Reps} <span className="text-[10px] font-normal text-on-surface-variant">reps</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustReps(1)}
                    className="w-9 h-9 rounded-lg bg-surface-container-highest text-on-surface active:scale-95 flex items-center justify-center font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                {/* Quick add pills */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => adjustReps(1)}
                    className="px-2.5 py-0.5 rounded-md bg-surface-container-lowest text-primary text-[10px] font-bold font-mono border border-white/5 active:scale-95"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustReps(2)}
                    className="px-2.5 py-0.5 rounded-md bg-surface-container-lowest text-primary text-[10px] font-bold font-mono border border-white/5 active:scale-95"
                  >
                    +2
                  </button>
                </div>
              </div>
            </div>

            {/* Botão Primário Largo de Conclusão */}
            <button
              type="button"
              onClick={handleCompleteSerie3}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
                serie3Completed
                  ? "bg-surface-container-highest text-primary border border-primary/20"
                  : "bg-primary text-on-primary shadow-primary/20"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {serie3Completed ? "task_alt" : "check_circle"}
              </span>
              <span>
                {serie3Completed ? "Série 3 Concluída ✓" : "Concluir Série 3 & Iniciar Descanso"}
              </span>
            </button>
          </div>

          {/* Série 4: Pendente */}
          <div className="bg-surface-container-low rounded-2xl p-3.5 border border-white/5 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-xs">
                ○
              </span>
              <div>
                <span className="text-xs font-bold text-on-surface">4 • Top Set</span>
                <p className="text-[11px] text-on-surface-variant font-mono">Alvo: 70 kg × 8-10 reps</p>
              </div>
            </div>
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Pendente</span>
          </div>
        </section>

        {/* 5. Navegação Inferior de Exercício */}
        <footer className="flex items-center justify-between pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-surface-container-high border border-white/5 text-on-surface-variant text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            <span>Anterior</span>
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">A Seguir</span>
            <span className="text-xs font-bold text-on-surface">2. Remada Curvada</span>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span>Próximo</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
