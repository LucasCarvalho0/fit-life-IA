"use client";

import { useState } from "react";
import Link from "next/link";

interface GymEquipment {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  notes: string;
}

const INITIAL_EQUIPMENT: GymEquipment[] = [
  { id: "eq1", name: "Polia Dupla com Regulagem de Altura", category: "Cabos / Polias", enabled: true, notes: "Smart Fit #14" },
  { id: "eq2", name: "Crossover Angular Completo", category: "Cabos / Polias", enabled: true, notes: "Smart Fit #03" },
  { id: "eq3", name: "Graviton com Placas Selecionáveis", category: "Máquinas", enabled: true, notes: "Smart Fit #07" },
  { id: "eq4", name: "Remada Baixa Sentada com Triângulo", category: "Máquinas", enabled: true, notes: "Smart Fit #08" },
  { id: "eq5", name: "Puxada Articulada Convergente (Hammer)", category: "Articulados", enabled: true, notes: "Smart Fit #22" },
  { id: "eq6", name: "Leg Press 45 Graus", category: "Pernas", enabled: true, notes: "Smart Fit #31" },
  { id: "eq7", name: "Cadeira Extensora Bilateral", category: "Pernas", enabled: true, notes: "Smart Fit #33" },
  { id: "eq8", name: "Mesa Flexora Deitada", category: "Pernas", enabled: true, notes: "Smart Fit #35" },
  { id: "eq9", name: "Smith Machine / Barra Guiada", category: "Barras", enabled: true, notes: "Smart Fit #12" },
  { id: "eq10", name: "Halteres de 1 kg até 40 kg", category: "Pesos Livres", enabled: true, notes: "Rack Central" },
];

export default function EquipamentosPage() {
  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT);
  const [filter, setFilter] = useState("TODOS");

  const toggleEquipment = (id: string) => {
    setEquipmentList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    );
  };

  const activeCount = equipmentList.filter((e) => e.enabled).length;

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
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Setup de Academia
              </span>
              <h1 className="font-display text-base font-bold text-on-surface">Aparelhos Mapeados</h1>
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {activeCount}/{equipmentList.length} Ativos
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-4">
        {/* Info Box */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-on-surface">Smart Fit Consolação</h2>
            <span className="text-[10px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full font-bold">
              Unidade Principal
            </span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            O algoritmo de treino só prescreve exercícios para os aparelhos que estiverem marcados como disponíveis.
            Se algum aparelho quebrar ou estiver em manutenção, basta desativá-lo aqui.
          </p>
        </section>

        {/* Equipment List */}
        <section className="flex flex-col gap-2">
          {equipmentList.map((eq) => (
            <div
              key={eq.id}
              onClick={() => toggleEquipment(eq.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all active:scale-98 ${
                eq.enabled
                  ? "bg-surface-container border-white/5"
                  : "bg-surface-container-low/50 border-white/5 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    eq.enabled ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-bold text-on-surface truncate">{eq.name}</h4>
                  <span className="text-[10px] text-on-surface-variant">
                    {eq.category} • {eq.notes}
                  </span>
                </div>
              </div>

              {/* Toggle switch visual */}
              <div
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  eq.enabled ? "bg-primary" : "bg-surface-container-highest"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-surface transition-transform shadow-md ${
                    eq.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

