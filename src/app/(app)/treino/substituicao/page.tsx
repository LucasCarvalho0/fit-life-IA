"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AlternativeOption {
  id: string;
  name: string;
  machine: string;
  matchScore: number;
  pattern: string;
  loadAdjustment: string;
  reason: string;
  available: boolean;
}

const ALTERNATIVES: AlternativeOption[] = [
  {
    id: "alt1",
    name: "Puxada Articulada Convergente",
    machine: "Aparelho Smart Fit #22 • Articulado",
    matchScore: 98,
    pattern: "Puxada Vertical • Perfil Descendente",
    loadAdjustment: "Use 35 kg cada lado (+5 kg compensando menor atrito)",
    reason: "Idêntico alinhamento das fibras do grande dorsal e excelente estabilidade de escápula.",
    available: true,
  },
  {
    id: "alt2",
    name: "Barra Fixa com Pegada Neutra (Graviton)",
    machine: "Graviton Smart Fit #07",
    matchScore: 94,
    pattern: "Puxada Vertical Fechada",
    loadAdjustment: "Configure contrapeso de 20 kg no Graviton",
    reason: "Grande ativação de grande dorsal e bíceps com preservação articular do ombro.",
    available: true,
  },
  {
    id: "alt3",
    name: "Pulldown com Barra Reta no Crossover",
    machine: "Crossover Central #03",
    matchScore: 88,
    pattern: "Isolamento da Grande Dorsal",
    loadAdjustment: "Use 40 kg no bloco de placas",
    reason: "Excelente curva de resistência no pico de encurtamento sem exigir polia dupla frontal.",
    available: true,
  },
];

export default function SubstituicaoBiomecanicaPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("alt1");
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      router.push("/treino/ativo");
    }, 800);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/treino"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                Motor Biomecânico FitLife
              </span>
              <h1 className="font-display text-base font-bold text-on-surface">Substituir Exercício</h1>
            </div>
          </div>
          <span className="text-[10px] bg-secondary-container/20 text-secondary font-bold px-2 py-0.5 rounded-full">
            Smart Fit Setup
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-4">
        {/* Aparelho Ocupado / Original */}
        <section className="rounded-2xl bg-surface-container-high/40 p-4 border border-warning/20 shadow-md flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-warning flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">report</span>
              Exercício Original • Aparelho Ocupado
            </span>
            <span className="text-xs text-on-surface-variant">Polia #14</span>
          </div>
          <h2 className="font-display text-base font-bold text-on-surface">Puxada Alta na Polia (Pronada)</h2>
          <p className="text-xs text-on-surface-variant">
            Padrão Motor: Puxada Vertical • Foco primário: Grande Dorsal &amp; Redondo Maior • Carga Alvo: 65.0 kg
          </p>
        </section>

        {/* Critérios da IA */}
        <section className="flex items-center gap-2 bg-surface-container px-3 py-2.5 rounded-xl border border-white/5 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">auto_awesome</span>
          <p className="text-[11px] leading-relaxed">
            As alternativas preservam exatamente o <strong className="text-on-surface">braço de momento</strong> e a{" "}
            <strong className="text-on-surface">faixa de hipertrofia</strong> prescrita no microciclo.
          </p>
        </section>

        {/* Lista de Alternativas */}
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-bold text-on-surface px-1">
            Opções Equivalentes Disponíveis na Academia
          </h3>

          <div className="flex flex-col gap-3">
            {ALTERNATIVES.map((alt) => {
              const isSelected = selectedId === alt.id;
              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedId(alt.id)}
                  className={`flex flex-col gap-2.5 p-3.5 rounded-2xl cursor-pointer transition-all border active:scale-98 ${
                    isSelected
                      ? "bg-surface-container border-primary shadow-lg shadow-primary/10"
                      : "bg-surface-container-low border-white/5 hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary bg-primary" : "border-on-surface-variant"
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-on-primary" />}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-xs font-bold text-on-surface">{alt.name}</h4>
                        <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-primary">location_on</span>
                          {alt.machine}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                      {alt.matchScore}% match
                    </span>
                  </div>

                  {/* Load conversion advice */}
                  <div className="flex items-center gap-2 bg-surface-container-high px-2.5 py-1.5 rounded-xl border border-white/5 text-[11px]">
                    <span className="material-symbols-outlined text-secondary text-[14px]">balance</span>
                    <span className="font-semibold text-secondary">{alt.loadAdjustment}</span>
                  </div>

                  <p className="text-[11px] text-on-surface-variant leading-relaxed">{alt.reason}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            className={`w-full min-h-[48px] rounded-xl font-display text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
              confirmed
                ? "bg-positive text-on-primary shadow-lg"
                : "bg-primary text-on-primary shadow-lg shadow-primary/20"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {confirmed ? "check_circle" : "swap_horiz"}
            </span>
            <span>{confirmed ? "Substituição Aplicada!" : "Substituir e Voltar ao Treino"}</span>
          </button>
        </div>
      </main>
    </div>
  );
}

