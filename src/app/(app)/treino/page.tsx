"use client";

import { useState } from "react";
import Link from "next/link";

interface Exercise {
  id: string;
  name: string;
  category: string;
  machine: string;
  sets: string;
  reps: string;
  rir: string;
  rest: string;
  lastWeight: string;
  targetWeight: string;
  tips: string;
}

const WORKOUT_SPLITS = [
  { id: "A", name: "Treino A", focus: "Peitoral, Deltoides & Tríceps", status: "Hoje", tag: "HOJE", current: true },
  { id: "B", name: "Treino B", focus: "Dorsal, Trapézio & Bíceps", status: "Próximo", tag: "Amanhã" },
  { id: "C", name: "Treino C", focus: "Quadríceps, Posterior & Panturrilhas", status: "Próximo", tag: "Quinta" },
  { id: "D", name: "Treino D", focus: "Ombros Completo & Abdômen", status: "Próximo", tag: "Sexta" },
];

const EXERCISES: Record<string, Exercise[]> = {
  A: [
    {
      id: "ex1",
      name: "Supino Reto com Halteres",
      category: "Peitoral Maior",
      machine: "Banco Reto + Halteres",
      sets: "3 séries",
      reps: "10-12 reps",
      rir: "RIR 2",
      rest: "90s",
      lastWeight: "A definir",
      targetWeight: "16.0 kg",
      tips: "Ajuste a escápula em adução e desça com os cotovelos a 45-60 graus do tronco.",
    },
    {
      id: "ex2",
      name: "Supino Inclinado Articulado",
      category: "Porção Clavicular (Superior)",
      machine: "Máquina Hammer / Inclinada #18",
      sets: "3 séries",
      reps: "10-12 reps",
      rir: "RIR 1-2",
      rest: "90s",
      lastWeight: "A definir",
      targetWeight: "20.0 kg / lado",
      tips: "Movimento contínuo mantendo os ombros para trás sem perder contato com o encosto.",
    },
    {
      id: "ex3",
      name: "Desenvolvimento com Halteres",
      category: "Deltoide Anterior / Lateral",
      machine: "Banco a 75 graus",
      sets: "3 séries",
      reps: "10-12 reps",
      rir: "RIR 1",
      rest: "75s",
      lastWeight: "A definir",
      targetWeight: "12.0 kg",
      tips: "Empurre alinhando o peso acima da cabeça sem hiperextender a coluna lombar.",
    },
    {
      id: "ex4",
      name: "Elevação Lateral na Polia",
      category: "Deltoide Lateral",
      machine: "Crossover / Polia Baixa",
      sets: "3 séries",
      reps: "12-15 reps",
      rir: "RIR 0-1",
      rest: "60s",
      lastWeight: "A definir",
      targetWeight: "7.5 kg",
      tips: "Puxe na diagonal do plano escapular com leve inclinação do tronco.",
    },
    {
      id: "ex5",
      name: "Tríceps na Polia com Corda",
      category: "Tríceps - Cabeça Lateral & Longa",
      machine: "Polia Alta + Corda",
      sets: "3 séries",
      reps: "12-15 reps",
      rir: "RIR 0-1",
      rest: "60s",
      lastWeight: "A definir",
      targetWeight: "25.0 kg",
      tips: "Abra a corda no final da extensão com contração de pico de 1 segundo.",
    },
  ],
  B: [
    {
      id: "ex6",
      name: "Puxada Alta na Polia (Pronada)",
      category: "Costas - Largura",
      machine: "Polia Dupla #14",
      sets: "4 séries",
      reps: "8-10 reps",
      rir: "RIR 1-2",
      rest: "90s",
      lastWeight: "A definir",
      targetWeight: "50.0 kg",
      tips: "Foque em puxar com os cotovelos direcionados ao quadril.",
    },
    {
      id: "ex7",
      name: "Remada Baixa Triângulo",
      category: "Costas - Densidade",
      machine: "Remada Sentada #08",
      sets: "4 séries",
      reps: "8-10 reps",
      rir: "RIR 1",
      rest: "90s",
      lastWeight: "A definir",
      targetWeight: "55.0 kg",
      tips: "Tronco firme a 80 graus, evite balanço excessivo da lombar.",
    },
  ],
};

export default function TreinoPage() {
  const [activeSplit, setActiveSplit] = useState("A");
  const exercises: Exercise[] = EXERCISES[activeSplit] ?? EXERCISES["A"] ?? [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h1 className="font-display text-lg font-bold text-on-surface">Ficha de Treino</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/equipamentos"
              className="px-2.5 py-1 rounded-xl bg-surface-container border border-white/5 text-[11px] font-semibold text-primary flex items-center gap-1 hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span>Aparelhos</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-5">
        {/* Context & Periodização */}
        <section className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Dia 1 • Início do Ciclo
            </span>
            <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
              Treino Inicial
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-on-surface">Divisão Muscular Prescrita</h2>
          <p className="text-xs text-on-surface-variant">
            Seu treino de hoje foca em peitoral, deltoides e tríceps para estabelecer as cargas de referência.
          </p>
        </section>

        {/* Workout Split Switcher */}
        <section className="w-full">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {WORKOUT_SPLITS.map((split) => {
              const isSelected = activeSplit === split.id;
              return (
                <button
                  key={split.id}
                  onClick={() => setActiveSplit(split.id)}
                  className={`flex-shrink-0 flex flex-col gap-1 p-3 rounded-2xl text-left min-w-[145px] transition-all border active:scale-95 ${
                    isSelected
                      ? "bg-surface-container-high border-primary/40 shadow-lg shadow-primary/5"
                      : "bg-surface-container-low border-white/5 text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-display text-sm font-bold ${
                        isSelected ? "text-primary" : "text-on-surface-variant"
                      }`}
                    >
                      {split.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        split.tag === "HOJE"
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {split.tag}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface line-clamp-1">{split.focus}</p>
                  <span className="text-[10px] text-on-surface-variant">
                    {split.id === "A" ? "5 exercícios • 15 séries" : "Exercícios calibrados"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Metodologia de Execução (Estilo Renato Cariani) */}
        <section className="p-3.5 rounded-2xl bg-surface-container border border-primary/20 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">fitness_center</span>
              <span className="text-xs font-bold text-on-surface">Diretrizes de Treino Cariani</span>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
              Alta Sobrecarga
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-0.5">
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Cadência 3-0-1
              </span>
              <span className="text-[10px] text-on-surface-variant">3s na descida controlada; subida explosiva.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-0.5">
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                RIR 1-2 (Reserva)
              </span>
              <span className="text-[10px] text-on-surface-variant">Pare a 1 ou 2 reps da falha real do músculo.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-0.5">
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                Descanso Sério
              </span>
              <span className="text-[10px] text-on-surface-variant">60s a 90s para recuperar o ATP muscular.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-0.5">
              <span className="font-bold text-on-surface flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
                Feeder Sets
              </span>
              <span className="text-[10px] text-on-surface-variant">1 série de aquecimento antes da carga total.</span>
            </div>
          </div>
        </section>

        {/* Workout Hero Overview Card */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Treino de Hoje
              </span>
              <h3 className="font-display text-lg font-bold text-on-surface">Treino A: Peitoral, Deltoides &amp; Tríceps</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Estimativa: 45 min • 15 séries • 5 exercícios
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-white/5 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[24px]">fitness_center</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/treino/ativo"
              className="flex-1 min-h-[46px] rounded-xl bg-primary text-on-primary font-display text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
              <span>Iniciar Modo de Treino Ativo</span>
            </Link>
            <Link
              href="/treino/substituicao"
              className="min-h-[46px] px-3 rounded-xl bg-surface-container-high border border-white/5 text-secondary text-xs font-semibold flex items-center justify-center gap-1 hover:bg-surface-variant active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              <span>Aparelho Ocupado?</span>
            </Link>
          </div>
        </section>

        {/* Exercise List */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display text-sm font-bold text-on-surface">Sequência de Exercícios</h3>
            <span className="text-xs text-on-surface-variant">{exercises.length} movimentos</span>
          </div>

          <div className="flex flex-col gap-3">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-surface-container border border-white/5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-surface-container-high border border-white/5 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-xs font-bold text-on-surface truncate">{exercise.name}</h4>
                      <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] text-secondary">tune</span>
                        {exercise.machine}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/treino/substituicao?exercise=${encodeURIComponent(exercise.name)}`}
                    className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                  </Link>
                </div>

                {/* Target Chips */}
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="bg-surface-container-low p-1.5 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase text-on-surface-variant block">Séries</span>
                    <span className="text-xs font-bold text-on-surface">{exercise.sets}</span>
                  </div>
                  <div className="bg-surface-container-low p-1.5 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase text-on-surface-variant block">Reps</span>
                    <span className="text-xs font-bold text-on-surface">{exercise.reps}</span>
                  </div>
                  <div className="bg-surface-container-low p-1.5 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase text-on-surface-variant block">Carga Alvo</span>
                    <span className="text-xs font-bold text-primary">{exercise.targetWeight}</span>
                  </div>
                  <div className="bg-surface-container-low p-1.5 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase text-on-surface-variant block">Descanso</span>
                    <span className="text-xs font-bold text-secondary">{exercise.rest}</span>
                  </div>
                </div>

                {/* Technical Tip */}
                <div className="flex items-start gap-2 bg-surface-container-low/70 px-2.5 py-2 rounded-xl text-[11px] text-on-surface-variant border border-white/5">
                  <span className="material-symbols-outlined text-primary text-[14px] shrink-0 mt-0.5">
                    tips_and_updates
                  </span>
                  <p className="line-clamp-2 leading-relaxed">{exercise.tips}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
