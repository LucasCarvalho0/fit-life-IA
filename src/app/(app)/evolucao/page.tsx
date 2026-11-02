"use client";

import { useState } from "react";
import Link from "next/link";

interface WeighIn {
  date: string;
  type: string;
  weight: number;
  delta: string;
}

const INITIAL_HISTORY: WeighIn[] = [
  { date: "Hoje, 24 Out", type: "Jejum • Bioimpedância Inteligente", weight: 76.4, delta: "-0.3 kg" },
  { date: "20 Out", type: "Jejum • Pesagem manual", weight: 76.7, delta: "-0.4 kg" },
  { date: "15 Out", type: "Jejum • Bioimpedância Inteligente", weight: 77.1, delta: "-0.5 kg" },
];

export default function EvolucaoPage() {
  const [activeTab, setActiveTab] = useState<"1m" | "3m" | "6m" | "1y" | "all">("3m");
  const [history, setHistory] = useState<WeighIn[]>(INITIAL_HISTORY);
  const [currentWeight, setCurrentWeight] = useState(76.4);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newWeight, setNewWeight] = useState("76.4");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (!isNaN(val) && val > 30 && val < 250) {
      setCurrentWeight(val);
      setHistory((prev) => [
        {
          date: "Hoje, Agora",
          type: "Jejum • Registro Manual",
          weight: val,
          delta: `${(val - currentWeight) > 0 ? "+" : ""}${(val - currentWeight).toFixed(1)} kg`,
        },
        ...prev,
      ]);
      setShowLogModal(false);
      setToastMessage("Peso registrado com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface text-on-surface antialiased pb-24">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              PRO ATHLETE
            </span>
            <span className="text-xs text-on-surface-variant">• Início</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-surface-container-high border border-white/5 text-[11px] font-mono font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              <span>14 dias</span>
            </div>
            <Link
              href="/notificacoes"
              className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center relative active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </Link>
            <Link
              href="/configuracoes"
              className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 flex flex-col gap-4">
        {/* Title & Top Action */}
        <section className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Motor Biométrico V3.4
            </span>
            <h1 className="font-display text-xl font-extrabold text-on-surface tracking-tight">
              Evolução Corporal
            </h1>
            <p className="text-[11px] text-on-surface-variant font-medium">Plano de Recomposição Ativo</p>
          </div>

          <button
            type="button"
            onClick={() => setShowLogModal(true)}
            className="px-3.5 py-2 rounded-xl bg-surface-container-high border border-white/10 text-on-surface text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">add</span>
            <span>Pesar</span>
          </button>
        </section>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-white/5">
          {[
            { id: "1m", label: "1 Mês" },
            { id: "3m", label: "3 Meses" },
            { id: "6m", label: "6 Meses" },
            { id: "1y", label: "1 Ano" },
            { id: "all", label: "Tudo" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. Resumo da Recomposição (Grau A+) */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
              <span className="text-xs font-bold text-on-surface">Resumo da Recomposição</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
              Grau A+
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Peso Atual</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display text-3xl font-black text-on-surface font-mono">{currentWeight.toFixed(1)}</span>
                <span className="text-xs font-semibold text-on-surface-variant">kg</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold text-primary bg-primary/15 font-mono">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                -3.4 kg
              </span>
              <span className="text-[10px] text-on-surface-variant mt-1 font-mono">
                Meta: 73.0 kg (-3.4 kg restantes)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase font-bold">
                <span>Gordura (BF)</span>
                <span className="material-symbols-outlined text-[16px] text-tertiary">water_drop</span>
              </div>
              <div className="my-1">
                <span className="font-display text-2xl font-black text-on-surface font-mono">14.8%</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                <span className="material-symbols-outlined text-[13px]">trending_down</span>
                <span>-2.2% no período</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase font-bold">
                <span>Massa Magra</span>
                <span className="material-symbols-outlined text-[16px] text-primary">fitness_center</span>
              </div>
              <div className="my-1 flex items-baseline gap-1">
                <span className="font-display text-2xl font-black text-on-surface font-mono">38.6</span>
                <span className="text-xs text-on-surface-variant">kg</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                <span>+1.8 kg seco</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-high border border-white/5 flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">verified</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-on-surface">Taxa de Recomposição: Excelente</span>
              <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                Ganho simultâneo de hipertrofia funcional com oxidação lipídica controlada.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Curva de Tendência (12 Semanas) */}
        <section className="p-4 rounded-2xl bg-surface-container border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-xs font-bold text-on-surface">Curva de Tendência (12 Semanas)</h2>
              <span className="text-[10px] text-on-surface-variant">Média ponderada da pesagem matinal</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" /> Real
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-outline-variant" /> Meta
              </span>
            </div>
          </div>

          <div className="relative w-full h-44 flex flex-col justify-end pt-2">
            {/* Linhas de grade de peso */}
            <div className="absolute inset-x-0 top-3 flex items-center justify-between pointer-events-none text-[9px] text-on-surface-variant font-mono">
              <span>80kg</span>
              <div className="w-full mx-2 h-px bg-surface-container-highest" />
            </div>
            <div className="absolute inset-x-0 top-16 flex items-center justify-between pointer-events-none text-[9px] text-on-surface-variant font-mono">
              <span>76kg</span>
              <div className="w-full mx-2 h-px bg-surface-container-highest" />
            </div>
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-between pointer-events-none text-[9px] text-primary font-mono">
              <span>73kg</span>
              <div className="w-full mx-2 border-t border-dashed border-primary/40" />
              <span className="uppercase text-[8px] font-bold">META</span>
            </div>

            {/* SVG Curva Neon Esmeralda */}
            <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 340 140">
              <defs>
                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10,20 L 40,28 L 70,36 L 100,42 L 130,55 L 160,52 L 190,68 L 220,74 L 250,82 L 280,88 L 310,95 L 330,102 L 330,135 L 10,135 Z"
                fill="url(#trendGradient)"
              />
              <path
                d="M 10,20 L 40,28 L 70,36 L 100,42 L 130,55 L 160,52 L 190,68 L 220,74 L 250,82 L 280,88 L 310,95 L 330,102"
                fill="none"
                stroke="#4edea3"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line stroke="#86948a" strokeDasharray="4 4" strokeOpacity="0.5" strokeWidth="1.5" x1="10" x2="330" y1="120" y2="120" />
              <circle cx="10" cy="20" r="3.5" fill="#4edea3" />
              <circle cx="130" cy="55" r="3.5" fill="#4edea3" />
              <circle cx="220" cy="74" r="3.5" fill="#4edea3" />
              <circle cx="330" cy="102" r="4.5" fill="#4edea3" />
              <circle cx="330" cy="102" r="7" fill="#4edea3" opacity="0.3" className="animate-ping" />
            </svg>

            {/* Tooltip de Peso Atual */}
            <div className="absolute right-0 top-12 bg-surface-container-highest/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-xl flex items-center gap-1.5 text-left pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-surface">Hoje: 76.4 kg</span>
                <span className="text-[9px] text-primary font-bold">-0.3 kg essa semana</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-mono pt-1 border-t border-white/5">
            <span>Sem 1 (79.8kg)</span>
            <span>Sem 4</span>
            <span>Sem 8</span>
            <span className="text-on-surface font-bold">Sem 12 (76.4kg)</span>
          </div>
        </section>

        {/* 3. Diagnóstico Biométrico FitLife AI */}
        <section className="p-4 rounded-2xl bg-surface-container-high border border-white/5 shadow-lg flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary-fixed flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[22px]">neurology</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-on-surface">Diagnóstico Biométrico FitLife AI</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-secondary-container/40 text-secondary-fixed">
                Ativo
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Sua relação de sobrecarga progressiva nos treinos está preservando sua massa magra em déficit calórico moderado de 300 kcal. Projeção de atingir <span className="text-primary font-bold">12% BF em 8 semanas</span> se o ritmo atual for mantido.
            </p>
            <div className="mt-2.5 flex items-center gap-4 text-[10px] text-on-surface font-semibold">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[15px]">check_circle</span>
                <span>Aderência: 94%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[15px]">bolt</span>
                <span>Metabolismo: Elevado</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Antropometria & Medidas */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold text-on-surface">Antropometria &amp; Medidas</h3>
              <span className="text-[10px] text-on-surface-variant">Circunferências musculares</span>
            </div>
            <span className="text-[11px] font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">straighten</span>
              <span>Com Fita</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-surface-container border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase font-bold">
                <span>Tórax / Peitoral</span>
                <span className="material-symbols-outlined text-[15px] text-primary">accessibility_new</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold text-on-surface">104</span>
                  <span className="text-[10px] text-on-surface-variant">cm</span>
                </div>
                <span className="text-[10px] text-primary font-bold">+3.0 cm</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase font-bold">
                <span>Braço Direito</span>
                <span className="material-symbols-outlined text-[15px] text-primary">fitness_center</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold text-on-surface">38.5</span>
                  <span className="text-[10px] text-on-surface-variant">cm</span>
                </div>
                <span className="text-[10px] text-primary font-bold">+1.2 cm</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase font-bold">
                <span>Cintura / Abdômen</span>
                <span className="material-symbols-outlined text-[15px] text-tertiary">tune</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold text-on-surface">81.0</span>
                  <span className="text-[10px] text-on-surface-variant">cm</span>
                </div>
                <span className="text-[10px] text-primary font-bold">-5.0 cm</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase font-bold">
                <span>Coxa Direita</span>
                <span className="material-symbols-outlined text-[15px] text-primary">directions_run</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold text-on-surface">60.0</span>
                  <span className="text-[10px] text-on-surface-variant">cm</span>
                </div>
                <span className="text-[10px] text-primary font-bold">+1.5 cm</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Comparativo Fotográfico */}
        <section className="p-4 rounded-2xl bg-surface-container border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-on-surface">Comparativo Fotográfico</h3>
              <span className="text-[10px] text-on-surface-variant">Registro visual de recomposição</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full border border-white/5">
              <span className="material-symbols-outlined text-[12px] text-primary">lock</span>
              <span>Privado</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest flex flex-col aspect-[4/5] border border-white/10 group">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/images/gym-banner.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[9px] font-bold text-white/70 uppercase">Início</span>
                  <span className="text-xs font-bold text-white">24 Jul • 79.8 kg</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest flex flex-col aspect-[4/5] border-2 border-primary group">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/images/gym-banner.jpg')" }}
              >
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary text-on-primary text-[9px] font-bold">
                  Atual
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-[9px] font-bold text-primary uppercase font-mono">-3.4 KG &amp; +MÚSCULO</span>
                  <span className="text-xs font-bold text-white">Hoje • 76.4 kg</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/configuracoes"
            className="w-full py-2.5 rounded-xl bg-surface-container-high border border-white/10 text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">add_a_photo</span>
            <span>Adicionar Foto de Progresso</span>
          </Link>
        </section>

        {/* 6. Histórico Recente */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-on-surface">Histórico Recente</h3>
            <span className="text-[10px] text-primary font-bold">Ver todos</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">scale</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">{item.date}</span>
                    <span className="text-[10px] text-on-surface-variant">{item.type}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold font-mono text-on-surface">{item.weight.toFixed(1)} kg</span>
                  <span className="text-[10px] font-bold text-primary font-mono">{item.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Link para 1RM Analítico */}
        <Link
          href="/evolucao/1rm"
          className="p-3.5 rounded-2xl bg-surface-container-high border border-primary/30 flex items-center justify-between active:scale-98 transition-all hover:border-primary"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">fitness_center</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Progressão &amp; 1RM Analítico</span>
              <span className="text-[10px] text-on-surface-variant">Cálculo de força máxima por exercício</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-primary">chevron_right</span>
        </Link>

        {/* Botão Inferior Primário */}
        <button
          type="button"
          onClick={() => setShowLogModal(true)}
          className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">scale</span>
          <span>Registrar Peso ou Medidas de Hoje</span>
        </button>
      </main>

      {/* Modal de Registro de Peso */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-surface-container p-5 border border-white/10 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">scale</span>
                Registrar Pesagem
              </h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-on-surface-variant">Peso Atual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-lg font-mono font-bold px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-3 rounded-xl bg-surface-container-high text-on-surface text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md shadow-primary/20"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary px-4 py-2 rounded-full font-bold text-xs shadow-xl animate-in slide-in-from-bottom duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
