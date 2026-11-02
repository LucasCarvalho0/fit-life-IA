"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WorkoutSet {
  id: number;
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
}

export default function ModoTreinoAtivoPage() {
  const router = useRouter();

  // Elapsed workout time starts at 0 for fresh session
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Rest timer
  const totalRestSeconds = 90;
  const [restSeconds, setRestSeconds] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sets state (clean / uncompleted)
  const [sets, setSets] = useState<WorkoutSet[]>([
    { id: 1, weight: 16.0, reps: 12, rpe: 8, completed: false },
    { id: 2, weight: 16.0, reps: 10, rpe: 8.5, completed: false },
    { id: 3, weight: 16.0, reps: 10, rpe: 9, completed: false },
  ]);

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

  const toggleSetComplete = (id: number) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.completed;
          if (nextState) {
            setRestSeconds(totalRestSeconds);
            setIsTimerRunning(true);
          }
          return { ...s, completed: nextState };
        }
        return s;
      })
    );
  };

  const updateSet = (id: number, field: "weight" | "reps" | "rpe", value: number) => {
    setSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const timerRatio = restSeconds / totalRestSeconds;
  const strokeDashoffset = circumference - timerRatio * circumference;

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Fixed Header */}
      <header className="sticky top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/treino"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[22px]">pause_circle</span>
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Sessão Ativa</span>
              <h1 className="font-display text-sm font-bold text-on-surface truncate">Treino A: Peitoral</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-white/5">
              <span className="material-symbols-outlined text-primary text-[16px] animate-pulse">timer</span>
              <span className="text-xs font-mono font-bold text-on-surface">{formatTime(elapsedSeconds)}</span>
            </div>
            <Link
              href="/treino/resumo"
              className="px-3 py-1 rounded-xl bg-error/15 border border-error/30 text-error text-xs font-bold active:scale-95 transition-transform"
            >
              Finalizar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-10 flex flex-col gap-4">
        {/* Exercício em Foco Atual */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Exercício 1 de 5 • Banco Reto
              </span>
              <h2 className="font-display text-base font-bold text-on-surface truncate mt-0.5">
                Supino Reto com Halteres
              </h2>
              <p className="text-xs text-on-surface-variant">Pegada Pronada • Foco no Peitoral Maior</p>
            </div>
            <Link
              href="/treino/substituicao?exercise=Supino%20Reto"
              className="px-2.5 py-1.5 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary">swap_horiz</span>
              <span>Trocar</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface-variant text-[11px] border border-white/5">
              <span className="material-symbols-outlined text-[13px] text-primary">my_location</span>
              Estabilidade Escapular
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface-variant text-[11px] border border-white/5">
              <span className="material-symbols-outlined text-[13px] text-secondary">tune</span>
              Meta: 3x 10-12 reps
            </span>
          </div>
        </section>

        {/* Cronômetro de Descanso Imersivo */}
        <section className="bg-surface-container-low rounded-2xl p-4 border border-white/5 shadow-lg flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">timelapse</span>
              Intervalo de Descanso
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-white/5">
              <span className="material-symbols-outlined text-[16px] text-danger">favorite</span>
              <span className="text-xs font-mono font-bold text-on-surface">118 BPM</span>
              <span className="text-[10px] text-primary font-bold">Z2</span>
            </div>
          </div>

          {/* Visor Circular SVG */}
          <div className="relative w-44 h-44 flex items-center justify-center my-1">
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
                className="text-primary transition-all duration-500"
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
                {isTimerRunning ? `${restSeconds}s restantes` : "Aguardando 1ª série"}
              </span>
            </div>
          </div>

          {/* Controles Rápidos */}
          <div className="grid grid-cols-4 gap-2 w-full mt-2">
            <button
              onClick={() => adjustTimer(-15)}
              className="py-2 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold active:scale-95 transition-transform"
            >
              -15s
            </button>
            <button
              onClick={() => adjustTimer(30)}
              className="py-2 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold active:scale-95 transition-transform"
            >
              +30s
            </button>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="py-2 rounded-xl bg-surface-container-high border border-white/5 text-on-surface flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isTimerRunning ? "pause" : "play_arrow"}
              </span>
            </button>
            <button
              onClick={() => setRestSeconds(0)}
              className="py-2 rounded-xl bg-primary text-on-primary text-xs font-bold active:scale-95 transition-transform flex items-center justify-center gap-1"
            >
              <span>Pular</span>
              <span className="material-symbols-outlined text-[16px]">fast_forward</span>
            </button>
          </div>
        </section>

        {/* Logger de Séries Tátil */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-on-surface">Registro de Séries</h3>
            <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
              Meta: 3x 10-12 reps
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 gap-1 text-[10px] uppercase font-bold text-on-surface-variant px-2">
              <span className="col-span-2">Série</span>
              <span className="col-span-4 text-center">Carga (kg)</span>
              <span className="col-span-3 text-center">Reps</span>
              <span className="col-span-3 text-right">Status</span>
            </div>

            {sets.map((s) => (
              <div
                key={s.id}
                className={`grid grid-cols-12 items-center gap-2 p-2.5 rounded-xl border transition-all ${
                  s.completed
                    ? "bg-surface-container-high/40 border-primary/30"
                    : "bg-surface-container-low border-white/5"
                }`}
              >
                <div className="col-span-2 flex items-center gap-1">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                      s.completed ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface"
                    }`}
                  >
                    {s.id}
                  </span>
                </div>

                {/* Weight Input */}
                <div className="col-span-4 flex items-center justify-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    value={s.weight}
                    onChange={(e) => updateSet(s.id, "weight", parseFloat(e.target.value) || 0)}
                    className="w-16 bg-surface-container-high text-center font-display font-bold text-sm text-on-surface py-1 rounded-lg border border-white/10 focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-on-surface-variant">kg</span>
                </div>

                {/* Reps Input */}
                <div className="col-span-3 flex items-center justify-center gap-1">
                  <input
                    type="number"
                    value={s.reps}
                    onChange={(e) => updateSet(s.id, "reps", parseInt(e.target.value) || 0)}
                    className="w-12 bg-surface-container-high text-center font-display font-bold text-sm text-on-surface py-1 rounded-lg border border-white/10 focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-on-surface-variant">reps</span>
                </div>

                {/* Complete Button */}
                <div className="col-span-3 flex justify-end">
                  <button
                    onClick={() => toggleSetComplete(s.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-90 ${
                      s.completed
                        ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                        : "bg-surface-container-high border border-white/10 text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={s.completed ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      check
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Set Button */}
          <button
            onClick={() =>
              setSets((prev) => [
                ...prev,
                { id: prev.length + 1, weight: prev[prev.length - 1]?.weight || 16, reps: 10, rpe: 8, completed: false },
              ])
            }
            className="w-full py-2.5 rounded-xl bg-surface-container-high border border-white/5 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-variant active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Adicionar Nova Série</span>
          </button>
        </section>

        {/* Bottom Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Link
            href="/treino/resumo"
            className="flex-1 min-h-[46px] rounded-xl bg-primary text-on-primary font-display text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">flag</span>
            <span>Finalizar Treino &amp; Salvar Resumo</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
