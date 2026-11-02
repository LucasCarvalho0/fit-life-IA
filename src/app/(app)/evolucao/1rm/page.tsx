"use client";

import { useState } from "react";
import Link from "next/link";

interface ExerciseZone {
  pct: number;
  label: string;
  weight: number;
  reps: string;
  rpe: string;
  badge?: string;
  color: string;
}

export default function Progresso1RMPage() {
  const [selectedExercise, setSelectedExercise] = useState("Puxada Alta na Polia");
  const [activeTab, setActiveTab] = useState("3m");
  const [showSimulator, setShowSimulator] = useState(false);
  const [simWeight, setSimWeight] = useState("70");
  const [simReps, setSimReps] = useState("8");
  const [simRPE, setSimRPE] = useState("9");
  const [calculated1RM, setCalculated1RM] = useState(104);

  const calculateSimulator = (w: number, r: number) => {
    // Brzycki + Epley ponderada
    const brzycki = w * (36 / (37 - r));
    const epley = w * (1 + 0.0333 * r);
    return Math.round((brzycki * 0.5 + epley * 0.5) * 10) / 10;
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(simWeight);
    const r = parseInt(simReps, 10);
    if (!isNaN(w) && !isNaN(r) && w > 0 && r > 0) {
      setCalculated1RM(Math.round(calculateSimulator(w, r)));
    }
  };

  const zones: ExerciseZone[] = [
    {
      pct: 100,
      label: "Força Máxima",
      weight: 104,
      reps: "1 rep",
      rpe: "RPE 10",
      color: "border-error/40 text-error",
    },
    {
      pct: 90,
      label: "Potência / Força Pura",
      weight: 94,
      reps: "3-4 reps",
      rpe: "RPE 9.0 - 9.5",
      color: "border-secondary/40 text-secondary",
    },
    {
      pct: 80,
      label: "Hipertrofia Funcional",
      weight: 83,
      reps: "6-8 reps",
      rpe: "RPE 8.0 - 8.5",
      badge: "Faixa Ideal • Tensão Mecânica Ótima",
      color: "border-primary text-primary bg-primary/5",
    },
    {
      pct: 70,
      label: "Hipertrofia Metabólica",
      weight: 73,
      reps: "10-12 reps",
      rpe: "RPE 7.5 - 8.0",
      color: "border-tertiary/40 text-tertiary",
    },
    {
      pct: 60,
      label: "Resistência / Deload",
      weight: 62,
      reps: "15-20 reps",
      rpe: "RPE 6.0 - 7.0",
      color: "border-white/10 text-on-surface-variant",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface text-on-surface antialiased pb-24">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/evolucao"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:text-primary active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </Link>
            <h1 className="font-display text-sm font-bold text-on-surface truncate">
              Progressão &amp; 1RM Analítico
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSimulator(true)}
              className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">calculate</span>
            </button>
            <Link
              href="/configuracoes"
              className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 flex flex-col gap-4">
        {/* Active Exercise Overview Card */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Dorsais &amp; Bíceps
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-medium">
                  Cadeia Posterior
                </span>
              </div>
              <h2 className="font-display text-lg font-bold text-on-surface mt-1 truncate">
                {selectedExercise}
              </h2>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-primary">fitness_center</span>
                Polia Superior / Pegada Pronada Aberta
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSimulator(true)}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold active:scale-95 transition-all"
            >
              <span>Trocar</span>
              <span className="material-symbols-outlined text-[16px] text-primary">swap_horiz</span>
            </button>
          </div>

          {/* Quick Switch Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {[
              "Puxada Alta na Polia",
              "Supino Reto com Barra",
              "Agachamento Livre",
              "Levantamento Terra",
              "Desenvolvimento",
            ].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedExercise(name)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedExercise === name
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {name.split(" ")[0]} {name.split(" ")[1]}
              </button>
            ))}
          </div>
        </section>

        {/* Timeframe Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-white/5">
          {[
            { id: "1m", label: "1 Mês" },
            { id: "3m", label: "3 Meses (Ativo)" },
            { id: "6m", label: "6 Meses" },
            { id: "1y", label: "1 Ano" },
            { id: "all", label: "Tudo" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap text-center ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hero Metric: 1RM Estimado Atual */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
              <span className="text-xs font-bold text-on-surface">1RM Estimado Atual</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
              <span className="material-symbols-outlined text-[13px]">bolt</span>
              Novo Recorde Pessoal
            </span>
          </div>

          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-black text-on-surface font-mono">{calculated1RM}</span>
              <span className="font-display text-lg font-bold text-on-surface-variant">kg</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high border border-white/5">
              <span className="material-symbols-outlined text-primary text-[18px]">trending_up</span>
              <span className="text-xs font-bold text-primary font-mono">+12 kg (+13.0%)</span>
              <span className="text-[10px] text-on-surface-variant ml-1 font-mono">em 60d</span>
            </div>
          </div>

          <div className="bg-surface-container-high rounded-xl p-3 border border-white/5 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-secondary-container/40 text-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">Brzycki + Epley (Ponderada)</span>
                <span className="text-[10px] font-bold text-primary">Alta Precisão</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                Calculado com base em <strong className="text-on-surface">70 kg × 8 reps</strong> com esforço percebido <strong className="text-on-surface">RPE 9.0</strong> (1 repetição em reserva validada).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-surface-container-low rounded-xl p-2.5 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Carga de Trabalho</span>
              <div className="mt-1">
                <span className="text-sm font-bold text-on-surface font-mono">70 kg</span>
                <span className="text-[10px] text-on-surface-variant block">× 8 reps</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-2.5 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Volume / Treino</span>
              <div className="mt-1">
                <span className="text-sm font-bold text-on-surface font-mono">2.140 kg</span>
                <span className="text-[10px] text-primary font-bold block">+8% microciclo</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-2.5 border border-white/5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Sobrecarga Semanal</span>
              <div className="mt-1">
                <span className="text-sm font-bold text-on-surface font-mono">+2.5%</span>
                <span className="text-[10px] text-on-surface-variant block">Densidade alta</span>
              </div>
            </div>
          </div>
        </section>

        {/* Curva de Progressão de 1RM */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold text-on-surface">Curva de Progressão de 1RM</h3>
              <p className="text-[10px] text-on-surface-variant">Evolução contínua nas últimas 12 semanas</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" /> 1RM Real
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-secondary" /> Meta Linear
              </span>
            </div>
          </div>

          <div className="bg-surface-container-high rounded-xl p-2.5 flex items-center justify-between gap-2 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant">Semana 12 (Último Registro)</span>
                <span className="text-xs font-bold text-on-surface">70 kg × 8 reps • RPE 9.0</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-primary font-mono">1RM: 104 kg</span>
              <span className="text-[9px] text-on-surface-variant font-mono">+2.0 kg vs Sem 11</span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="w-full relative mt-1">
            <svg className="w-full h-36 overflow-visible" preserveAspectRatio="none" viewBox="0 0 360 170">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line stroke="#31353e" strokeDasharray="3,3" strokeWidth="1" x1="20" x2="350" y1="20" y2="20" />
              <text fill="#86948a" fontSize="9" textAnchor="end" x="15" y="23">110</text>
              <line stroke="#31353e" strokeDasharray="3,3" strokeWidth="1" x1="20" x2="350" y1="60" y2="60" />
              <text fill="#86948a" fontSize="9" textAnchor="end" x="15" y="63">100</text>
              <line stroke="#31353e" strokeDasharray="3,3" strokeWidth="1" x1="20" x2="350" y1="100" y2="100" />
              <text fill="#86948a" fontSize="9" textAnchor="end" x="15" y="103">90</text>
              <line stroke="#31353e" strokeDasharray="3,3" strokeWidth="1" x1="20" x2="350" y1="140" y2="140" />
              <text fill="#86948a" fontSize="9" textAnchor="end" x="15" y="143">80</text>

              {/* Meta Linear (Indigo) */}
              <path d="M 28 112 L 340 38" fill="none" opacity="0.85" stroke="#c0c1ff" strokeDasharray="4,4" strokeWidth="1.8" />

              {/* Área preenchida verde */}
              <path
                d="M 28 108 C 45 106, 65 102, 84 100 C 98 98, 105 103, 112 102 C 126 100, 133 96, 140 94 C 154 90, 161 88, 168 86 C 182 82, 189 80, 196 78 C 210 77, 217 77, 224 76 C 238 72, 245 68, 252 66 C 266 62, 273 60, 280 58 C 294 55, 301 53, 308 52 C 322 48, 330 45, 336 44 L 336 148 L 28 148 Z"
                fill="url(#chartGradient)"
              />
              {/* Linha real */}
              <path
                d="M 28 108 C 45 106, 65 102, 84 100 C 98 98, 105 103, 112 102 C 126 100, 133 96, 140 94 C 154 90, 161 88, 168 86 C 182 82, 189 80, 196 78 C 210 77, 217 77, 224 76 C 238 72, 245 68, 252 66 C 266 62, 273 60, 280 58 C 294 55, 301 53, 308 52 C 322 48, 330 45, 336 44"
                fill="none"
                stroke="#4edea3"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <circle cx="28" cy="108" fill="#4edea3" r="3" />
              <circle cx="84" cy="100" fill="#4edea3" r="3" />
              <circle cx="140" cy="94" fill="#4edea3" r="3" />
              <circle cx="196" cy="78" fill="#4edea3" r="3" />
              <circle cx="252" cy="66" fill="#4edea3" r="3" />
              <circle cx="308" cy="52" fill="#4edea3" r="3" />
              <circle cx="336" cy="44" fill="#4edea3" r="5" />

              <text fill="#86948a" fontSize="9" textAnchor="middle" x="28" y="162">S1</text>
              <text fill="#86948a" fontSize="9" textAnchor="middle" x="84" y="162">S3</text>
              <text fill="#86948a" fontSize="9" textAnchor="middle" x="140" y="162">S5</text>
              <text fill="#86948a" fontSize="9" textAnchor="middle" x="196" y="162">S7</text>
              <text fill="#86948a" fontSize="9" textAnchor="middle" x="252" y="162">S9</text>
              <text fill="#86948a" fontSize="9" textAnchor="middle" x="308" y="162">S11</text>
              <text fill="#4edea3" fontSize="9" fontWeight="bold" textAnchor="middle" x="336" y="162">S12</text>
            </svg>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
            <span className="text-on-surface-variant">Taxa média de ganho: <strong className="text-on-surface">+1.3 kg/sem</strong></span>
            <span className="text-primary font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Linearidade 94%
            </span>
          </div>
        </section>

        {/* Diagnóstico Adaptativo AI */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Diagnóstico Adaptativo AI</span>
                <span className="text-[10px] text-secondary font-medium">Motor Biomecânico FitLife</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-secondary text-[9px] font-bold">
              Ativo
            </span>
          </div>

          <div className="bg-surface-container-high rounded-xl p-3 border border-white/5 flex flex-col gap-2">
            <p className="text-xs text-on-surface leading-relaxed">
              Sua progressão no exercício estabilizou nas últimas 3 semanas na faixa de <strong className="text-primary font-semibold">70 kg</strong>. A relação de velocidade de barra e RPE (9.0) indica <strong className="text-on-surface font-semibold">prontidão neural para sobrecarga</strong> sem risco de falha mecânica.
            </p>
            <div className="bg-surface-container-lowest/70 rounded-lg p-2.5 flex items-center gap-2 border border-white/5">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0">recommend</span>
              <div className="text-[11px] text-on-surface">
                <strong className="text-primary font-semibold">Próxima sessão:</strong> 72.5 kg para 6–8 reps na 1ª série de trabalho (+3.5% sobrecarga planejada).
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-white/5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-medium">Recuperação Neural</span>
                <span className="text-xs font-bold text-on-surface">100% (Pronto)</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-white/5 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">trending_flat</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant font-medium">Risco de Platô</span>
                <span className="text-xs font-bold text-on-surface">Baixo (&lt; 15%)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Zonas de Treino & %1RM */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-on-surface">Zonas de Treino &amp; %1RM</h3>
              <p className="text-[10px] text-on-surface-variant">Distribuição tática de carga para 104 kg</p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">tune</span>
          </div>

          <div className="flex flex-col gap-2">
            {zones.map((zone) => (
              <div
                key={zone.pct}
                className={`p-3 rounded-xl border flex items-center justify-between ${zone.color}`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono">{zone.pct}% • {zone.label}</span>
                    {zone.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary">
                        {zone.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] opacity-80">{zone.reps} • {zone.rpe}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-base font-black font-mono">{zone.weight}</span>
                  <span className="text-[10px] font-normal">kg</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Histórico de Sessões Recentes */}
        <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-on-surface">Histórico de Sessões Recentes</h3>
              <p className="text-[10px] text-on-surface-variant">Logs de sobrecarga e volume acumulado</p>
            </div>
            <span className="text-[10px] text-on-surface-variant font-mono">3 sessões</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="p-3 rounded-xl bg-surface-container-high border border-white/5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Hoje, 24 Out • Treino B
                </span>
                <span className="text-[10px] font-bold text-primary font-mono">1RM: 104 kg</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-mono">
                4 Séries: 45kg×15 • 65kg×10 • 65kg×10 • 70kg×8 (Top Set)
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                <span className="text-on-surface font-mono">Volume Total: 2.140 kg</span>
                <span className="text-primary font-bold font-mono">+8% vs ant.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">17 Out • Treino B</span>
                <span className="text-[10px] font-bold text-on-surface-variant font-mono">1RM: 102 kg</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-mono">
                4 Séries: 45kg×15 • 62.5kg×10 • 65kg×10 • 67.5kg×8
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                <span className="text-on-surface-variant font-mono">Volume Total: 2.070 kg</span>
                <span className="text-on-surface-variant font-mono">RPE 8.5</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowSimulator(true)}
            className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
            <span>Simular Nova Carga no Calculador 1RM</span>
          </button>

          <button
            type="button"
            className="w-full py-3 rounded-xl bg-surface-container-high border border-white/10 text-on-surface text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">ios_share</span>
            <span>Exportar Gráfico de Sobrecarga</span>
          </button>
        </div>
      </main>

      {/* Modal Simulador 1RM */}
      {showSimulator && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-surface-container p-5 border border-white/10 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">calculate</span>
                Calculador Científico de 1RM
              </h3>
              <button
                type="button"
                onClick={() => setShowSimulator(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSimulate} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant">Carga Levantada (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={simWeight}
                  onChange={(e) => setSimWeight(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-base font-mono font-bold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant">Repetições Executadas</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={simReps}
                  onChange={(e) => setSimReps(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-base font-mono font-bold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant">Esforço Percebido (RPE)</label>
                <select
                  value={simRPE}
                  onChange={(e) => setSimRPE(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-xs font-bold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-primary"
                >
                  <option value="10">RPE 10 (Falha absoluta, 0 reps na reserva)</option>
                  <option value="9.5">RPE 9.5 (Talvez fizesse +1 rep)</option>
                  <option value="9">RPE 9.0 (1 repetição sólida em reserva)</option>
                  <option value="8.5">RPE 8.5 (1-2 reps em reserva)</option>
                  <option value="8">RPE 8.0 (2 reps em reserva)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between mt-1">
                <span className="text-xs text-primary font-medium">1RM Ponderado:</span>
                <span className="font-display text-xl font-black text-primary font-mono">
                  {calculateSimulator(parseFloat(simWeight) || 0, parseInt(simReps, 10) || 1)} kg
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSimulator(false)}
                  className="flex-1 py-3 rounded-xl bg-surface-container-high text-on-surface text-xs font-bold"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  onClick={() => setShowSimulator(false)}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md shadow-primary/20"
                >
                  Aplicar Carga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
