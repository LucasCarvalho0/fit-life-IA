"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MetasFisicasPage() {
  const router = useRouter();

  const [goal, setGoal] = useState<"cut" | "recomp" | "bulk">("recomp");
  const [targetWeight, setTargetWeight] = useState(73.0);
  const [activityFactor, setActivityFactor] = useState(1.375);
  const [proteinPerKg, setProteinPerKg] = useState(2.2);

  // Mifflin-St Jeor calculations
  // Weight: 76.4kg, Height: 178cm, Age: 26
  const bmr = Math.round(10 * 76.4 + 6.25 * 178 - 5 * 26 + 5); // ~1751 kcal
  const tdee = Math.round(bmr * activityFactor); // ~2408 kcal

  // Deficit / Surplus based on goal
  let targetCalories = tdee;
  if (goal === "cut") targetCalories = tdee - 500;
  if (goal === "recomp") targetCalories = tdee - 250;
  if (goal === "bulk") targetCalories = tdee + 300;

  // Macros
  const proteinGrams = Math.round(76.4 * proteinPerKg); // ~168g
  const fatGrams = Math.round(76.4 * 0.8); // ~61g
  const carbCalories = Math.max(0, targetCalories - proteinGrams * 4 - fatGrams * 9);
  const carbGrams = Math.round(carbCalories / 4);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      router.push("/alimentacao");
    }, 700);
  };

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
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                Parâmetros Fisiológicos
              </span>
              <h1 className="font-display text-base font-bold text-on-surface">Metas Físicas &amp; Calorias</h1>
            </div>
          </div>
          <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
            Mifflin-St Jeor
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-5">
        {/* Goal Selector */}
        <section className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider px-1">
            Objetivo Primário do Ciclo
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setGoal("cut")}
              className={`p-3 rounded-2xl border text-center transition-all ${
                goal === "cut"
                  ? "bg-primary/10 border-primary text-primary font-bold shadow-md"
                  : "bg-surface-container border-white/5 text-on-surface-variant"
              }`}
            >
              <span className="block text-xs font-bold">Cutting</span>
              <span className="text-[10px] opacity-80">-500 kcal</span>
            </button>
            <button
              onClick={() => setGoal("recomp")}
              className={`p-3 rounded-2xl border text-center transition-all ${
                goal === "recomp"
                  ? "bg-primary/10 border-primary text-primary font-bold shadow-md"
                  : "bg-surface-container border-white/5 text-on-surface-variant"
              }`}
            >
              <span className="block text-xs font-bold">Recomposição</span>
              <span className="text-[10px] opacity-80">-250 kcal</span>
            </button>
            <button
              onClick={() => setGoal("bulk")}
              className={`p-3 rounded-2xl border text-center transition-all ${
                goal === "bulk"
                  ? "bg-primary/10 border-primary text-primary font-bold shadow-md"
                  : "bg-surface-container border-white/5 text-on-surface-variant"
              }`}
            >
              <span className="block text-xs font-bold">Bulking</span>
              <span className="text-[10px] opacity-80">+300 kcal</span>
            </button>
          </div>
        </section>

        {/* Metabolic Calculations Card */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-on-surface">Cálculo de Demanda Energética</h3>
            <span className="text-[10px] text-on-surface-variant">Peso Atual: 76.4 kg</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-container-low p-3 rounded-xl border border-white/5 flex flex-col">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">Taxa Basal (BMR)</span>
              <span className="font-display text-lg font-bold text-on-surface mt-0.5">{bmr} kcal</span>
              <span className="text-[9px] text-on-surface-variant">Gasto em repouso</span>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-white/5 flex flex-col">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">Gasto Total (TDEE)</span>
              <span className="font-display text-lg font-bold text-secondary mt-0.5">{tdee} kcal</span>
              <span className="text-[9px] text-on-surface-variant">Fator 1.375x</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-high border border-primary/20">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Meta Diária Recomendada
              </span>
              <span className="font-display text-2xl font-extrabold text-on-surface mt-0.5">
                {targetCalories} <span className="text-xs font-normal text-on-surface-variant">kcal/dia</span>
              </span>
            </div>
            <span className="text-xs font-bold text-positive bg-positive/10 px-2.5 py-1 rounded-full">
              Déficit Seguro
            </span>
          </div>
        </section>

        {/* Macro Distribution */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-on-surface">Macronutrientes Prescritos</h3>
            <span className="text-xs text-on-surface-variant">Divisão Otilizada</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-surface-container-low p-3 rounded-xl border border-white/5 flex flex-col">
              <span className="text-[10px] uppercase text-primary font-bold">Proteína</span>
              <span className="font-display text-lg font-bold text-on-surface mt-0.5">{proteinGrams}g</span>
              <span className="text-[9px] text-on-surface-variant">{proteinPerKg}g/kg</span>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-white/5 flex flex-col">
              <span className="text-[10px] uppercase text-secondary font-bold">Carboidrato</span>
              <span className="font-display text-lg font-bold text-on-surface mt-0.5">{carbGrams}g</span>
              <span className="text-[9px] text-on-surface-variant">Energia glicolítica</span>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-white/5 flex flex-col">
              <span className="text-[10px] uppercase text-secondary-fixed-dim font-bold">Gorduras</span>
              <span className="font-display text-lg font-bold text-on-surface mt-0.5">{fatGrams}g</span>
              <span className="text-[9px] text-on-surface-variant">0.8g/kg (Hormonal)</span>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className={`w-full min-h-[48px] rounded-xl font-display text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
              saved ? "bg-positive text-on-primary" : "bg-primary text-on-primary shadow-lg shadow-primary/20"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {saved ? "check_circle" : "save"}
            </span>
            <span>{saved ? "Metas Salvas no Perfil!" : "Salvar Metas Fisiológicas"}</span>
          </button>
        </div>
      </main>
    </div>
  );
}

