"use client";

import { useState } from "react";
import Link from "next/link";

interface Exercise1RM {
  name: string;
  category: string;
  bestWeight: number;
  bestReps: number;
  estimated1RM: number;
  gain: string;
}

const EXERCISES_1RM: Exercise1RM[] = [
  {
    name: "Supino Reto com Barra",
    category: "Peitoral",
    bestWeight: 90,
    bestReps: 5,
    estimated1RM: 102.5,
    gain: "+5.0 kg",
  },
  {
    name: "Agachamento Livre",
    category: "Membros Inferiores",
    bestWeight: 120,
    bestReps: 4,
    estimated1RM: 133.3,
    gain: "+8.5 kg",
  },
  {
    name: "Levantamento Terra",
    category: "Cadeia Posterior",
    bestWeight: 145,
    bestReps: 4,
    estimated1RM: 161.1,
    gain: "+10.0 kg",
  },
  {
    name: "Puxada Alta na Polia",
    category: "Dorsal",
    bestWeight: 65,
    bestReps: 10,
    estimated1RM: 86.6,
    gain: "+4.2 kg",
  },
];

export default function Progresso1RMPage() {
  // Mini interactive calculator
  const [calcWeight, setCalcWeight] = useState(70);
  const [calcReps, setCalcReps] = useState(8);

  // Brzycki formula: weight / (1.0278 - 0.0278 * reps)
  const brzycki1RM = Math.round(calcWeight / (1.0278 - 0.0278 * calcReps));
  // Epley formula: weight * (1 + 0.0333 * reps)
  const epley1RM = Math.round(calcWeight * (1 + 0.0333 * calcReps));

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/evolucao"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Sobrecarga Progressiva
              </span>
              <h1 className="font-display text-base font-bold text-on-surface">1RM Analítico</h1>
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Brzycki &amp; Epley
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-5">
        {/* Intro */}
        <section className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-bold text-on-surface">Força Máxima Estimada</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Acompanhe a sua evolução de força máxima teórica (1RM) sem a necessidade de testes lesivos até a falha
            concêntrica de 1 repetição.
          </p>
        </section>

        {/* Exercises 1RM Cards */}
        <section className="flex flex-col gap-3">
          {EXERCISES_1RM.map((ex, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2.5 p-4 rounded-2xl bg-surface-container border border-white/5 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{ex.category}</span>
                  <h3 className="font-display text-sm font-bold text-on-surface">{ex.name}</h3>
                  <span className="text-[11px] text-on-surface-variant">
                    Melhor série recente: {ex.bestReps} reps @ {ex.bestWeight} kg
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-on-surface-variant font-medium">1RM Estimado</span>
                  <p className="font-display text-lg font-extrabold text-on-surface">{ex.estimated1RM} kg</p>
                  <span className="text-[10px] text-positive font-bold">{ex.gain}</span>
                </div>
              </div>

              {/* Intensity Spectrum */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                <div className="bg-surface-container-low p-1.5 rounded-xl border border-white/5">
                  <span className="text-[9px] uppercase text-on-surface-variant block">100% (1RM)</span>
                  <span className="text-xs font-bold text-on-surface">{ex.estimated1RM} kg</span>
                </div>
                <div className="bg-surface-container-low p-1.5 rounded-xl border border-white/5">
                  <span className="text-[9px] uppercase text-on-surface-variant block">85% (~6 reps)</span>
                  <span className="text-xs font-bold text-primary">{Math.round(ex.estimated1RM * 0.85)} kg</span>
                </div>
                <div className="bg-surface-container-low p-1.5 rounded-xl border border-white/5">
                  <span className="text-[9px] uppercase text-on-surface-variant block">80% (~8 reps)</span>
                  <span className="text-xs font-bold text-secondary">{Math.round(ex.estimated1RM * 0.8)} kg</span>
                </div>
                <div className="bg-surface-container-low p-1.5 rounded-xl border border-white/5">
                  <span className="text-[9px] uppercase text-on-surface-variant block">70% (~12 reps)</span>
                  <span className="text-xs font-bold text-on-surface-variant">
                    {Math.round(ex.estimated1RM * 0.7)} kg
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Calculadora Rápida Interativa */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">calculate</span>
            <h3 className="font-display text-sm font-bold text-on-surface">Calculadora Dinâmica de 1RM</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant">Carga Levantada (kg)</label>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                className="bg-surface-container-low px-3 py-2 rounded-xl text-center font-display font-bold text-base text-on-surface border border-white/5 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant">Repetições Válidas</label>
              <input
                type="number"
                max="15"
                min="1"
                value={calcReps}
                onChange={(e) => setCalcReps(parseInt(e.target.value) || 1)}
                className="bg-surface-container-low px-3 py-2 rounded-xl text-center font-display font-bold text-base text-on-surface border border-white/5 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-primary/20 mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">Fórmula Brzycki</span>
              <span className="font-display text-xl font-extrabold text-primary">{brzycki1RM} kg</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">Fórmula Epley</span>
              <span className="font-display text-xl font-extrabold text-secondary">{epley1RM} kg</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

