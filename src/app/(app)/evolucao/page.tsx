"use client";

import { useState } from "react";
import Link from "next/link";

interface MetricHistory {
  date: string;
  weight: number;
}

const INITIAL_HISTORY: MetricHistory[] = [
  { date: "Hoje (Dia 1)", weight: 75.0 },
];

export default function EvolucaoPage() {
  const [history, setHistory] = useState<MetricHistory[]>(INITIAL_HISTORY);
  const [currentWeight, setCurrentWeight] = useState(75.0);
  const [goalWeight] = useState(72.0);
  const [showLogModal, setShowLogModal] = useState(false);
  const [inputWeight, setInputWeight] = useState("");

  const handleSaveWeight = () => {
    const val = parseFloat(inputWeight);
    if (!isNaN(val) && val > 30 && val < 250) {
      setCurrentWeight(val);
      setHistory((prev) => [...prev, { date: "Hoje", weight: val }]);
      setShowLogModal(false);
      setInputWeight("");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">trending_up</span>
            <h1 className="font-display text-lg font-bold text-on-surface">Evolução &amp; Métricas</h1>
          </div>
          <button
            onClick={() => setShowLogModal(true)}
            className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Registrar</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-5">
        {/* Weight Trend Hero */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Ponto de Partida • Dia 1
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display text-3xl font-extrabold text-on-surface">
                  {currentWeight.toFixed(1)}
                </span>
                <span className="text-xs text-on-surface-variant">kg</span>
                <span className="text-xs text-secondary font-semibold ml-1">
                  Peso Inicial
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-on-surface-variant font-medium">Meta Final</span>
              <p className="font-display text-sm font-bold text-primary">{goalWeight.toFixed(1)} kg</p>
            </div>
          </div>

          {/* Gráfico Inicial Limpo */}
          <div className="w-full bg-surface-container-low p-3 rounded-xl border border-white/5 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] text-on-surface-variant">
              <span>Histórico de Pesagens</span>
              <span className="text-primary font-semibold">1º registro ativo</span>
            </div>

            <div className="h-24 w-full flex items-end justify-center pt-2">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-mono text-primary font-bold">{currentWeight.toFixed(1)} kg</span>
                <div className="w-16 h-12 rounded-t-lg bg-primary/40 border-t-2 border-primary" />
                <span className="text-[10px] text-on-surface-variant">Dia 1</span>
              </div>
            </div>
          </div>
        </section>

        {/* Composição Corporal Inicial */}
        <section className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col p-3.5 rounded-2xl bg-surface-container border border-white/5 shadow-sm">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" /> % Gordura Estimado
            </span>
            <span className="font-display text-xl font-extrabold text-on-surface mt-1">~15.0%</span>
            <span className="text-[10px] text-on-surface-variant mt-0.5">Base do Questionário</span>
          </div>

          <div className="flex flex-col p-3.5 rounded-2xl bg-surface-container border border-white/5 shadow-sm">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary" /> Massa Livre Estimada
            </span>
            <span className="font-display text-xl font-extrabold text-on-surface mt-1">63.7 kg</span>
            <span className="text-[10px] text-primary font-semibold mt-0.5">Potencial de Hipertrofia</span>
          </div>
        </section>

        {/* 1RM & Progressão de Cargas Link Card */}
        <Link
          href="/evolucao/1rm"
          className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex items-center justify-between hover:bg-surface-container-high active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">speed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Calculadora 1RM Analítico</span>
              <span className="text-[11px] text-on-surface-variant">
                Descubra sua força máxima teórica (Brzycki &amp; Epley)
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
        </Link>

        {/* Medidas de Circunferência Iniciais */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-on-surface">Medidas Corporais</h3>
            <span className="text-[10px] text-on-surface-variant">Linha de Base</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-white/5">
              <span className="text-xs text-on-surface-variant">Braço</span>
              <span className="font-display text-xs font-bold text-on-surface">36.0 cm</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-white/5">
              <span className="text-xs text-on-surface-variant">Tórax</span>
              <span className="font-display text-xs font-bold text-on-surface">98.0 cm</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-white/5">
              <span className="text-xs text-on-surface-variant">Cintura</span>
              <span className="font-display text-xs font-bold text-on-surface">80.0 cm</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-white/5">
              <span className="text-xs text-on-surface-variant">Coxa</span>
              <span className="font-display text-xs font-bold text-on-surface">56.0 cm</span>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Registro */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-surface-container p-5 border border-white/10 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-on-surface">Registrar Peso Atual</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 py-3">
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 75.0"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                autoFocus
                className="w-32 bg-surface-container-low text-center font-display text-2xl font-bold text-on-surface py-2 rounded-2xl border border-primary focus:outline-none"
              />
              <span className="font-display text-lg text-on-surface-variant">kg</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowLogModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveWeight}
                className="flex-1 py-2.5 rounded-xl bg-primary text-xs font-bold text-on-primary shadow-md shadow-primary/20"
              >
                Salvar Peso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
