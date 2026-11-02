"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MealItem {
  name: string;
  weight: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  type: string;
  completed: boolean;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: MealItem[];
}

interface FoodSubstitution {
  targetCategory: string; // "protein" | "carb" | "fat" | "fruit"
  alternatives: {
    name: string;
    weight: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    reason: string;
  }[];
}

// Banco de substituições por similaridade de macros
const SUBSTITUTION_DATABASE: {
  default_protein: FoodSubstitution;
  default_carb: FoodSubstitution;
  default_breakfast: FoodSubstitution;
} = {
  default_protein: {
    targetCategory: "Proteína",
    alternatives: [
      { name: "Filé de Tilápia Grelhado", weight: "160g", calories: 210, protein: 42, carbs: 0, fat: 3, reason: "Mesma quantidade de proteína com menor teor de gordura saturada" },
      { name: "Patinho Moído Magro", weight: "140g", calories: 245, protein: 38, carbs: 0, fat: 7, reason: "Rico em creatina e ferro biodisponível" },
      { name: "Peito de Frango Desfiado", weight: "150g", calories: 235, protein: 40, carbs: 0, fat: 3.5, reason: "Fácil digestão e preparo rápido" },
      { name: "Whey Protein Concentrado + Água", weight: "40g", calories: 160, protein: 32, carbs: 3, fat: 2, reason: "Praticidade máxima pós/pré-treino" },
    ],
  },
  default_carb: {
    targetCategory: "Carboidrato",
    alternatives: [
      { name: "Batata Doce Cozida", weight: "180g", calories: 155, protein: 2, carbs: 36, fat: 0.2, reason: "Menor índice glicêmico e maior saciedade" },
      { name: "Mandioca / Aipim Cozido", weight: "130g", calories: 160, protein: 1.5, carbs: 38, fat: 0.3, reason: "Excelente densidade energética para treinos pesados" },
      { name: "Batata Inglesa Assada", weight: "190g", calories: 165, protein: 3.5, carbs: 38, fat: 0.2, reason: "Maior volume de comida e saciedade" },
      { name: "Macarrão Integral Cozido", weight: "130g", calories: 160, protein: 6, carbs: 33, fat: 1, reason: "Mais fibras para saúde intestinal" },
    ],
  },
  default_breakfast: {
    targetCategory: "Café da Manhã",
    alternatives: [
      { name: "Omelete de 3 Claras + 1 Ovo", weight: "140g", calories: 140, protein: 18, carbs: 1, fat: 6, reason: "Menos calorias preservando a alta proteína" },
      { name: "Tapioca com Frango e Queijo Cottage", weight: "120g", calories: 210, protein: 20, carbs: 24, fat: 3, reason: "Sem glúten com carboidrato de rápida absorção" },
      { name: "Iogurte Natural Desnatado c/ Whey", weight: "200g", calories: 180, protein: 25, carbs: 12, fat: 1, reason: "Saúde da microbiota e alta saciedade" },
    ],
  },
};

const INITIAL_MEALS: Meal[] = [
  {
    id: "meal-1",
    name: "Café da Manhã Energético",
    time: "08:00",
    type: "DESJEJUM",
    completed: false,
    totalCalories: 380,
    protein: 25,
    carbs: 40,
    fat: 12,
    items: [
      { name: "Ovos Mexidos (3 unidades)", weight: "150g", calories: 215, protein: 18, carbs: 2, fat: 15 },
      { name: "Pão Integral 100%", weight: "50g", calories: 120, protein: 5, carbs: 22, fat: 1.5 },
      { name: "Mamão Papaia c/ Chia", weight: "100g", calories: 45, protein: 2, carbs: 16, fat: 0.5 },
    ],
  },
  {
    id: "meal-2",
    name: "Almoço Equilibrado",
    time: "12:30",
    type: "ALMOÇO",
    completed: false,
    totalCalories: 550,
    protein: 45,
    carbs: 60,
    fat: 12,
    items: [
      { name: "Peito de Frango Grelhado", weight: "150g", calories: 240, protein: 39, carbs: 0, fat: 4 },
      { name: "Arroz Branco Cozido", weight: "140g", calories: 180, protein: 3.5, carbs: 40, fat: 0.4 },
      { name: "Feijão Carioca Cozido", weight: "90g", calories: 70, protein: 4.5, carbs: 13, fat: 0.4 },
      { name: "Salada Verde + Brócolis", weight: "80g", calories: 60, protein: 2, carbs: 7, fat: 2 },
    ],
  },
  {
    id: "meal-3",
    name: "Lanche da Tarde / Pré-Treino",
    time: "17:15",
    type: "PRÉ-TREINO",
    completed: false,
    totalCalories: 340,
    protein: 30,
    carbs: 45,
    fat: 5,
    items: [
      { name: "Mingau de Aveia em Flocos", weight: "40g", calories: 145, protein: 5, carbs: 26, fat: 2.5 },
      { name: "Whey Protein Isolado", weight: "30g", calories: 115, protein: 24, carbs: 2, fat: 1 },
      { name: "Banana Nanica Fatiada", weight: "80g", calories: 80, protein: 1, carbs: 17, fat: 0.2 },
    ],
  },
  {
    id: "meal-4",
    name: "Jantar Regenerativo",
    time: "20:30",
    type: "JANTAR",
    completed: false,
    totalCalories: 480,
    protein: 40,
    carbs: 50,
    fat: 10,
    items: [
      { name: "Patinho Moído Magro", weight: "140g", calories: 245, protein: 36, carbs: 0, fat: 7 },
      { name: "Batata Inglesa Assada", weight: "180g", calories: 160, protein: 3.5, carbs: 37, fat: 0.2 },
      { name: "Legumes Cozidos ao Vapor", weight: "100g", calories: 75, protein: 2, carbs: 13, fat: 1 },
    ],
  },
];

export default function AlimentacaoPage() {
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [userWeight, setUserWeight] = useState(75);
  const [waterGoal, setWaterGoal] = useState(3000);
  const [creatineDose, setCreatineDose] = useState(5.0);

  // Estado do Modal de Troca de Alimento
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [selectedAltIndex, setSelectedAltIndex] = useState<number>(0);

  // Carregar dados de peso e metas reais do atleta
  useEffect(() => {
    const profileStr = localStorage.getItem("fitlife_profile");
    if (profileStr) {
      try {
        const p = JSON.parse(profileStr);
        if (p.weight) {
          const w = Number(p.weight);
          setUserWeight(w);
          setWaterGoal(Math.round(w * 40)); // Fórmula Cariani: 40ml por kg de peso
          setCreatineDose(Math.max(3, Math.round(w * 0.07 * 10) / 10)); // 0.07g/kg
        }
      } catch {
        // fallback
      }
    }
  }, []);

  const activeMeal = meals.find((m) => m.id === activeMealId) ?? null;

  // Travar o scroll da página de trás quando o modal abrir (elimina a segunda barra de rolagem e oculta o bottom nav)
  useEffect(() => {
    if (swapModalOpen) {
      document.body.classList.add("modal-open");
      document.documentElement.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    };
  }, [swapModalOpen]);

  const toggleMealComplete = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleOpenSwapModal = (mealId: string) => {
    setActiveMealId(mealId);
    setSelectedItemIndex(0);
    setSelectedAltIndex(0);
    setSwapModalOpen(true);
  };

  const handleConfirmSwap = () => {
    if (!activeMeal) return;

    const currentItem = activeMeal.items[selectedItemIndex];
    if (!currentItem) return;

    const alternatives = getAlternativesForItem(currentItem.name);
    const chosen = alternatives[selectedAltIndex];
    if (!chosen) return;

    // Substituir item na refeição e recalcular os totais
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id !== activeMeal.id) return m;

        const newItems = [...m.items];
        newItems[selectedItemIndex] = {
          name: chosen.name,
          weight: chosen.weight,
          calories: chosen.calories,
          protein: chosen.protein,
          carbs: chosen.carbs,
          fat: chosen.fat,
        };

        const totalCalories = newItems.reduce((acc, i) => acc + i.calories, 0);
        const protein = newItems.reduce((acc, i) => acc + i.protein, 0);
        const carbs = newItems.reduce((acc, i) => acc + i.carbs, 0);
        const fat = newItems.reduce((acc, i) => acc + i.fat, 0);

        return {
          ...m,
          items: newItems,
          totalCalories,
          protein,
          carbs,
          fat,
        };
      })
    );

    setSwapModalOpen(false);
  };

  const getAlternativesForItem = (itemName: string) => {
    const lower = itemName.toLowerCase();
    if (lower.includes("frango") || lower.includes("patinho") || lower.includes("tilápia") || lower.includes("carne")) {
      return SUBSTITUTION_DATABASE.default_protein.alternatives;
    }
    if (lower.includes("arroz") || lower.includes("batata") || lower.includes("mandioca") || lower.includes("feijão") || lower.includes("aveia")) {
      return SUBSTITUTION_DATABASE.default_carb.alternatives;
    }
    return SUBSTITUTION_DATABASE.default_breakfast.alternatives;
  };

  const consumedCalories = meals
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.totalCalories, 0);

  const consumedProtein = meals
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.protein, 0);

  const consumedCarbs = meals
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.carbs, 0);

  const consumedFat = meals
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.fat, 0);

  const targetCalories = 2000;
  const targetProtein = 160;
  const targetCarbs = 200;
  const targetFat = 55;

  const remainingCalories = Math.max(0, targetCalories - consumedCalories);

  const proteinPct = Math.min(100, Math.round((consumedProtein / targetProtein) * 100));
  const carbsPct = Math.min(100, Math.round((consumedCarbs / targetCarbs) * 100));
  const fatPct = Math.min(100, Math.round((consumedFat / targetFat) * 100));

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">restaurant</span>
            <h1 className="font-display text-lg font-bold text-on-surface">Plano Alimentar</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/metas"
              className="px-2.5 py-1 rounded-xl bg-surface-container border border-white/5 text-[11px] font-semibold text-secondary flex items-center gap-1 hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Metas</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-5">
        {/* Metabolic Summary Banner */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Dia 1 • Início da Dieta
              </span>
              <h2 className="font-display text-lg font-bold text-on-surface">Consumo Diário</h2>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              Meta: {targetCalories} kcal
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-surface-container-low border border-white/5 text-center">
              <span className="text-[10px] uppercase text-on-surface-variant font-medium">Consumidas</span>
              <span className="font-display text-base font-bold text-on-surface mt-0.5">
                {consumedCalories} <span className="text-[10px] font-normal text-on-surface-variant">kcal</span>
              </span>
            </div>
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-surface-container-low border border-white/5 text-center">
              <span className="text-[10px] uppercase text-on-surface-variant font-medium">Restantes</span>
              <span className="font-display text-base font-bold text-secondary mt-0.5">
                {remainingCalories} <span className="text-[10px] font-normal text-on-surface-variant">kcal</span>
              </span>
            </div>
            <div className="flex flex-col items-center p-2.5 rounded-xl bg-surface-container-low border border-white/5 text-center">
              <span className="text-[10px] uppercase text-on-surface-variant font-medium">Gasto Treino</span>
              <span className="font-display text-base font-bold text-tertiary mt-0.5">
                0 <span className="text-[10px] font-normal text-on-surface-variant">kcal</span>
              </span>
            </div>
          </div>

          {/* Macro Progress Bars */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary" /> Proteína (2.0g/kg)
                </span>
                <span className="text-on-surface-variant">
                  <strong className="text-on-surface">{consumedProtein}g</strong> / {targetProtein}g{" "}
                  <span className="text-primary font-bold">({proteinPct}%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${proteinPct}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> Carboidratos
                </span>
                <span className="text-on-surface-variant">
                  <strong className="text-on-surface">{consumedCarbs}g</strong> / {targetCarbs}g{" "}
                  <span className="text-secondary font-bold">({carbsPct}%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-500"
                  style={{ width: `${carbsPct}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" /> Gorduras Boas
                </span>
                <span className="text-on-surface-variant">
                  <strong className="text-on-surface">{consumedFat}g</strong> / {targetFat}g{" "}
                  <span className="text-secondary-fixed-dim font-bold">({fatPct}%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary-fixed-dim transition-all duration-500"
                  style={{ width: `${fatPct}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Protocolo de Suplementação & Hidratação (Metodologia Cariani) */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">prescriptions</span>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-on-surface">Protocolo de Suplementação &amp; Água</h3>
                <p className="text-[10px] text-on-surface-variant">Calibrado para seu peso atual ({userWeight} kg)</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Estilo Cariani
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Água Diária */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">water_drop</span>
                  Água Diária
                </span>
                <span className="text-[10px] text-primary font-bold">40 ml/kg</span>
              </div>
              <span className="font-display text-base font-extrabold text-on-surface">
                {waterGoal.toLocaleString("pt-BR")} <span className="text-[10px] font-normal text-on-surface-variant">ml</span>
              </span>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                Fundamental para síntese proteica e rendimento no treino pesado.
              </p>
            </div>

            {/* Creatina Monoidratada */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
                  Creatina
                </span>
                <span className="text-[10px] text-secondary font-bold">0.07 g/kg</span>
              </div>
              <span className="font-display text-base font-extrabold text-secondary">
                {creatineDose} <span className="text-[10px] font-normal text-on-surface-variant">g / dia</span>
              </span>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                Tomar todos os dias (inclusive descanso) com carboidrato.
              </p>
            </div>

            {/* Whey Protein */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">nutrition</span>
                  Whey Protein
                </span>
                <span className="text-[10px] text-tertiary font-bold">Pós / Lanche</span>
              </div>
              <span className="font-display text-base font-extrabold text-tertiary">
                30 <span className="text-[10px] font-normal text-on-surface-variant">g (1 scoop)</span>
              </span>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                Proteína de rápida absorção para recuperação de fibras rompidas.
              </p>
            </div>

            {/* Multivitamínico + Ômega 3 */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary-fixed">medication</span>
                  Micronutrientes
                </span>
                <span className="text-[10px] text-secondary-fixed font-bold">Almoço</span>
              </div>
              <span className="font-display text-sm font-extrabold text-on-surface">
                Multi + Ômega 3
              </span>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                Ação antioxidante e anti-inflamatória nas articulações.
              </p>
            </div>
          </div>

          {/* Dica de Mentalidade Cariani */}
          <div className="bg-primary/5 p-3 rounded-xl border border-primary/20 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">psychology</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-primary">Diretriz de Alta Performance:</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                &ldquo;A constância supera o talento. Pese seus alimentos cru ou cozidos sempre no mesmo padrão, bata sua meta de água cedo e não pule refeições.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Refeições do Dia */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display text-sm font-bold text-on-surface">Refeições Programadas</h3>
            <span className="text-xs text-on-surface-variant">Marque conforme consumir</span>
          </div>

          <div className="flex flex-col gap-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${
                  meal.completed
                    ? "bg-surface-container/60 border-primary/20"
                    : "bg-surface-container border-white/5 shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleMealComplete(meal.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        meal.completed
                          ? "bg-primary text-on-primary shadow-sm"
                          : "bg-surface-container-high border border-white/10 text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {meal.completed ? "check" : "radio_button_unchecked"}
                      </span>
                    </button>
                    <div className="flex flex-col">
                      <h4
                        className={`text-xs font-bold ${
                          meal.completed ? "line-through text-on-surface-variant" : "text-on-surface"
                        }`}
                      >
                        {meal.name}
                      </h4>
                      <span className="text-[10px] text-on-surface-variant">
                        {meal.time} • {meal.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface font-mono">{meal.totalCalories} kcal</span>
                  </div>
                </div>

                {/* Meal Items List */}
                <div className="flex flex-col gap-1.5 pl-9">
                  {meal.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[11px] text-on-surface-variant py-0.5 border-b border-white/5 last:border-none"
                    >
                      <span className="truncate pr-2">
                        {item.name} <span className="text-[10px] opacity-70">({item.weight})</span>
                      </span>
                      <span className="font-mono shrink-0">
                        {item.calories} kcal • <strong className="text-primary">{item.protein}g P</strong>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Macro breakdown footer */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-primary">{meal.protein}g Proteína</span>
                    <span className="text-secondary">{meal.carbs}g Carbs</span>
                    <span className="text-on-surface-variant">{meal.fat}g Gordura</span>
                  </div>
                  {/* Botão funcional de Trocar alimento */}
                  <button
                    type="button"
                    onClick={() => handleOpenSwapModal(meal.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 text-[11px] font-bold transition-all active:scale-95 no-underline shadow-xs cursor-pointer select-none"
                  >
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span className="no-underline">Trocar alimento</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal de Substituição Inteligente de Alimento */}
      {swapModalOpen && activeMeal && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-surface-container rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[82vh] overflow-hidden my-auto">
            {/* Modal Header Fixo */}
            <div className="shrink-0 p-4 border-b border-white/5 flex items-center justify-between bg-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-on-surface">Substituição Inteligente</h3>
                  <p className="text-[10px] text-on-surface-variant">{activeMeal.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSwapModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Conteúdo Rolável Único */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {/* Passo 1: Qual alimento quer trocar? */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  1. Selecione o alimento que deseja trocar:
                </label>
                <div className="flex flex-col gap-1.5">
                  {activeMeal.items.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedItemIndex(idx);
                        setSelectedAltIndex(0);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        selectedItemIndex === idx
                          ? "bg-surface-container-high border-secondary shadow-md"
                          : "bg-surface-container-low border-white/5 text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface">{item.name}</span>
                        <span className="text-[10px] text-on-surface-variant">Porção: {item.weight}</span>
                      </div>
                      <span className="text-[11px] font-mono text-on-surface font-semibold">
                        {item.calories} kcal • {item.protein}g P
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Passo 2: Opções de equivalência calculadas pela IA */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  <span>2. Escolha o substituto equivalente:</span>
                </label>

                {activeMeal.items[selectedItemIndex] && (
                  <div className="flex flex-col gap-2">
                    {getAlternativesForItem(activeMeal.items[selectedItemIndex]?.name ?? "").map((alt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedAltIndex(idx)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                          selectedAltIndex === idx
                            ? "bg-surface-container-highest border-primary shadow-lg shadow-primary/10"
                            : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                selectedAltIndex === idx ? "border-primary bg-primary" : "border-white/20"
                              }`}
                            >
                              {selectedAltIndex === idx && (
                                <span className="material-symbols-outlined text-on-primary text-[10px]">check</span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-on-surface">{alt.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {alt.weight}
                          </span>
                        </div>

                        <p className="text-[10px] text-on-surface-variant pl-6">{alt.reason}</p>

                        <div className="flex items-center gap-3 text-[10px] font-mono pl-6 pt-1 text-on-surface-variant">
                          <span className="text-on-surface font-bold">{alt.calories} kcal</span>
                          <span className="text-primary font-semibold">{alt.protein}g P</span>
                          <span className="text-secondary font-semibold">{alt.carbs}g C</span>
                          <span className="text-on-surface-variant">{alt.fat}g G</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé Fixo — Botões Sempre Visíveis */}
            <div className="shrink-0 p-3.5 border-t border-white/10 bg-surface-container-high/95 backdrop-blur-md flex gap-2.5">
              <button
                type="button"
                onClick={() => setSwapModalOpen(false)}
                className="flex-1 min-h-[46px] rounded-xl bg-surface-container border border-white/10 text-on-surface text-xs font-bold hover:bg-surface-container-highest transition-colors active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSwap}
                className="flex-1 min-h-[46px] rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                <span>Confirmar Troca</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
