"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
type Gender = "male" | "female";
type Goal = "recomp" | "hypertrophy" | "cutting" | "strength";
type Experience = "beginner" | "intermediate" | "advanced";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active";
type GymType = "smartfit" | "bluefit" | "neighborhood" | "homegym";

interface OnboardingData {
  firstName: string;
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
  experience: Experience;
  activity: ActivityLevel;
  gym: GymType;
  daysPerWeek: number;
  trainingDays: number[]; // 0=Dom, 1=Seg … 6=Sáb
  startDate: string; // ISO date string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 9;

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  recomp: -200,
  hypertrophy: 300,
  cutting: -400,
  strength: 100,
};

// ─── Caloric Calculation (Mifflin-St Jeor) ────────────────────────────────────
function calculateNutrition(data: OnboardingData) {
  const { age, weight, height, gender, activity, goal } = data;
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
  const target = tdee + GOAL_ADJUSTMENTS[goal];
  const protein = Math.round(weight * 2.1);
  const fat = Math.round((target * 0.25) / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
  return { bmr: Math.round(bmr), tdee, target, protein, fat, carbs };
}

// ─── Training split suggestion ─────────────────────────────────────────────────
function getSplitLabel(days: number): string {
  if (days <= 3) return "Full Body 3x";
  if (days === 4) return "Upper / Lower";
  if (days === 5) return "Push Pull Legs + Upper Lower";
  return "PPL Duplo (6x)";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [generating, setGenerating] = useState(false);

  // Form state
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState<Goal>("recomp");
  const [experience, setExperience] = useState<Experience>("intermediate");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [gym, setGym] = useState<GymType>("smartfit");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [trainingDays, setTrainingDays] = useState<number[]>([1, 2, 3, 4]); // Mon–Thu default
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split("T")[0] ?? "";
  });

  // Load user's first name from Supabase session
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.first_name) {
        setFirstName(data.user.user_metadata.first_name as string);
      } else if (data?.user?.user_metadata?.full_name) {
        const parts = (data.user.user_metadata.full_name as string).split(" ");
        setFirstName(parts[0] ?? "");
      } else if (data?.user?.email) {
        setFirstName(data.user.email.split("@")[0] ?? "");
      }
    };
    loadUser();
  }, []);

  const progressPercent = Math.round((step / TOTAL_STEPS) * 100);

  // Toggle a training day
  const toggleDay = (dayIndex: number) => {
    setTrainingDays((prev) => {
      if (prev.includes(dayIndex)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter((d) => d !== dayIndex);
      }
      return [...prev, dayIndex].sort((a, b) => a - b);
    });
  };

  // Quick start date presets
  const nextMonday = (): string => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? 1 : 8 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split("T")[0] ?? "";
  };

  const today = new Date().toISOString().split("T")[0] ?? "";

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setGenerating(true);

    const data: OnboardingData = {
      firstName,
      gender,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      goal,
      experience,
      activity,
      gym,
      daysPerWeek,
      trainingDays,
      startDate,
    };

    const nutrition = calculateNutrition(data);

    // Persist to localStorage for dashboard use
    localStorage.setItem(
      "fitlife_profile",
      JSON.stringify({ ...data, ...nutrition, completedAt: new Date().toISOString() })
    );

    // Try to update Supabase user_metadata
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { onboarding_completed: true, profile: data },
      });
    } catch {
      // non-blocking
    }

    setTimeout(() => router.push("/dashboard"), 1200);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen w-full bg-surface text-on-surface">
      {/* Sticky Header */}
      <header className="sticky top-0 w-full z-40 bg-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="h-14 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Questionário Inteligente
              </span>
              <span className="font-display text-sm font-bold text-on-surface">
                Passo {step} de {TOTAL_STEPS}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-primary font-mono">{progressPercent}%</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-surface-container-high overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-6 pb-10 flex flex-col justify-between gap-6">
        {/* ── Step 1: Boas-vindas ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-200">
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-[40px]">waving_hand</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-on-surface">
                Bem-vindo ao Fit Life IA{firstName ? `, ${firstName}!` : "!"}
              </h2>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xs mx-auto">
                Vou te fazer algumas perguntas rápidas para montar seu plano personalizado de treino e nutrição. Leva menos de 2 minutos!
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-col gap-2">
              {[
                { icon: "calculate", label: "Cálculo do déficit calórico", color: "text-primary" },
                { icon: "fitness_center", label: "Treino montado nos seus dias", color: "text-secondary" },
                { icon: "auto_awesome", label: "IA adaptativa ao seu nível", color: "text-tertiary" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-white/5"
                >
                  <span className={`material-symbols-outlined text-[22px] ${f.color}`}>{f.icon}</span>
                  <span className="text-xs font-semibold text-on-surface">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Dados Biométricos ────────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Dados Biométricos</span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">Suas medidas corporais</h2>
              <p className="text-xs text-on-surface-variant mt-1">Usados para calcular seu metabolismo basal e metas calóricas precisas.</p>
            </div>

            {/* Sexo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Sexo biológico</label>
              <div className="grid grid-cols-2 gap-2">
                {(["male", "female"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                      gender === g
                        ? "bg-primary text-on-primary border-transparent shadow-lg shadow-primary/20"
                        : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {g === "male" ? "man" : "woman"}
                    </span>
                    <span className="font-display text-xs font-bold">
                      {g === "male" ? "Masculino" : "Feminino"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Idade */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="age">Idade (anos)</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">cake</span>
                <input
                  id="age"
                  type="number"
                  min="14"
                  max="80"
                  required
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-sm font-bold pl-11 pr-14 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                />
                <span className="absolute right-4 text-xs text-on-surface-variant font-semibold pointer-events-none">anos</span>
              </div>
            </div>

            {/* Peso + Altura */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="weight">Peso atual</label>
                <div className="relative flex items-center">
                  <input
                    id="weight"
                    type="number"
                    min="30"
                    max="250"
                    step="0.1"
                    required
                    placeholder="75"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-surface-container-highest text-on-surface text-sm font-bold px-3 pr-10 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="absolute right-3 text-xs text-on-surface-variant font-semibold pointer-events-none">kg</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="height">Altura</label>
                <div className="relative flex items-center">
                  <input
                    id="height"
                    type="number"
                    min="100"
                    max="230"
                    required
                    placeholder="175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-surface-container-highest text-on-surface text-sm font-bold px-3 pr-10 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="absolute right-3 text-xs text-on-surface-variant font-semibold pointer-events-none">cm</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Objetivo ─────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Foco Metabólico</span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">Qual é o seu objetivo principal?</h2>
              <p className="text-xs text-on-surface-variant mt-1">Calibra suas calorias, macros e volume de treino.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {(
                [
                  { id: "recomp", title: "Recomposição Corporal", desc: "Ganhar massa magra enquanto queima gordura (déficit leve)", icon: "transform", adj: "-200 kcal" },
                  { id: "hypertrophy", title: "Hipertrofia Pura (Bulking)", desc: "Máximo volume muscular com superávit controlado", icon: "fitness_center", adj: "+300 kcal" },
                  { id: "cutting", title: "Definição Máxima (Cutting)", desc: "Queima acelerada de gordura preservando massa magra", icon: "local_fire_department", adj: "-400 kcal" },
                  { id: "strength", title: "Força e Performance", desc: "Elevar cargas nos movimentos básicos multiarticulares", icon: "speed", adj: "+100 kcal" },
                ] as const
              ).map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 active:scale-[0.98] ${
                    goal === opt.id
                      ? "bg-surface-container border-primary shadow-lg shadow-primary/10"
                      : "bg-surface-container-low border-white/5 hover:bg-surface-container"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${goal === opt.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs font-bold text-on-surface">{opt.title}</h3>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">{opt.adj}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Experiência ───────────────────────────────────────────── */}
        {step === 4 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Tempo de Prática</span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">Qual é sua experiência na musculação?</h2>
              <p className="text-xs text-on-surface-variant mt-1">Define a taxa de recuperação e o volume semanal ideal.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {(
                [
                  { id: "beginner", title: "Iniciante (0 a 1 ano)", desc: "Foco no aprendizado motor e ganhos rápidos", badge: "Ganhos Rápidos" },
                  { id: "intermediate", title: "Intermediário (1 a 3 anos)", desc: "Movimentos básicos consolidados, familiaridade com RPE/RIR", badge: "Periodização" },
                  { id: "advanced", title: "Avançado (mais de 3 anos)", desc: "Exige sobrecarga milimétrica e periodização em blocos", badge: "Alta Sobrecarga" },
                ] as const
              ).map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setExperience(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1 active:scale-[0.98] ${
                    experience === opt.id
                      ? "bg-surface-container border-secondary shadow-lg shadow-secondary/10"
                      : "bg-surface-container-low border-white/5 hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-on-surface">{opt.title}</h3>
                    <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{opt.badge}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 5: Nível de Atividade ────────────────────────────────────── */}
        {step === 5 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Dia a Dia</span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">Como é sua rotina diária fora da academia?</h2>
              <p className="text-xs text-on-surface-variant mt-1">Determina o multiplicador do seu gasto calórico total (TDEE).</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {(
                [
                  { id: "sedentary", title: "Sedentário", desc: "Trabalho sentado, pouca movimentação no dia a dia", multi: "×1.2", icon: "chair" },
                  { id: "light", title: "Levemente Ativo", desc: "Caminhadas leves ou trabalho em pé parte do dia", multi: "×1.375", icon: "directions_walk" },
                  { id: "moderate", title: "Moderadamente Ativo", desc: "Trabalho físico leve ou exercícios fora da academia", multi: "×1.55", icon: "directions_run" },
                  { id: "very_active", title: "Muito Ativo", desc: "Trabalho físico intenso ou atleta em preparação", multi: "×1.725", icon: "sprint" },
                ] as const
              ).map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setActivity(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 active:scale-[0.98] ${
                    activity === opt.id
                      ? "bg-surface-container border-tertiary shadow-lg shadow-tertiary/10"
                      : "bg-surface-container-low border-white/5 hover:bg-surface-container"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activity === opt.id ? "bg-tertiary text-on-tertiary" : "bg-surface-container-high text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-on-surface">{opt.title}</h3>
                      <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">{opt.multi}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 6: Academia ─────────────────────────────────────────────── */}
        {step === 6 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Estrutura & Aparelhos</span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">Onde você treina normalmente?</h2>
              <p className="text-xs text-on-surface-variant mt-1">Mapeamos os aparelhos disponíveis para criar fichas sem exercícios impossíveis.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {(
                [
                  { id: "smartfit", title: "Smart Fit", desc: "Polias duplas, máquinas articuladas e graviton Smart Fit", devices: "48 aparelhos" },
                  { id: "bluefit", title: "Bluefit / Skyfit", desc: "Musculação comercial de alto padrão e polias integradas", devices: "44 aparelhos" },
                  { id: "neighborhood", title: "Academia de Bairro", desc: "Foco em pesos livres: halteres, barras e bancos", devices: "Pesos livres" },
                  { id: "homegym", title: "Home Gym / Calistenia", desc: "Halteres ajustáveis, barras de porta e peso corporal", devices: "Adaptado para casa" },
                ] as const
              ).map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setGym(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1 active:scale-[0.98] ${
                    gym === opt.id
                      ? "bg-surface-container border-primary shadow-lg shadow-primary/10"
                      : "bg-surface-container-low border-white/5 hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-on-surface">{opt.title}</h3>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{opt.devices}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 7: Quantidade de Dias ───────────────────────────────────── */}
        {step === 7 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Frequência Semanal</span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">Quantos dias por semana você pode treinar?</h2>
              <p className="text-xs text-on-surface-variant mt-1">A IA distribuirá a divisão muscular ideal.</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5, 6].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setDaysPerWeek(days);
                    // Reset selected days to first N weekdays
                    const defaults: number[][] = [
                      [], [], [1, 4], [1, 3, 5], [1, 2, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6],
                    ];
                    setTrainingDays(defaults[days] ?? [1, 2, 3, 4]);
                  }}
                  className={`col-span-1 p-3.5 rounded-2xl border text-center transition-all ${
                    daysPerWeek === days
                      ? "bg-primary text-on-primary font-bold shadow-lg shadow-primary/20"
                      : "bg-surface-container border-white/5 text-on-surface-variant"
                  }`}
                >
                  <span className="font-display text-xl font-extrabold block">{days}</span>
                  <span className="text-[10px] uppercase font-semibold">dias</span>
                </button>
              ))}
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">auto_awesome</span>
              <div>
                <p className="text-xs font-bold text-on-surface">Divisão recomendada para {daysPerWeek} dias:</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{getSplitLabel(daysPerWeek)}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 8: Quais Dias da Semana ─────────────────────────────────── */}
        {step === 8 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Agenda Semanal</span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">Quais dias você vai treinar?</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Escolha exatamente {daysPerWeek} dias. Você pode ajustar depois.
              </p>
            </div>

            {/* Day picker grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {DAY_LABELS.map((label, idx) => {
                const isSelected = trainingDays.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`flex flex-col items-center py-3 rounded-2xl border transition-all active:scale-95 ${
                      isSelected
                        ? "bg-secondary text-on-secondary border-transparent shadow-lg shadow-secondary/20"
                        : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <span className="text-[10px] font-bold">{label}</span>
                    {isSelected ? (
                      <span className="material-symbols-outlined text-[14px] mt-1">fitness_center</span>
                    ) : (
                      <span className="material-symbols-outlined text-[14px] mt-1 opacity-30">bed</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5">
              <p className="text-xs font-bold text-on-surface mb-2">Sua semana de treinos:</p>
              <div className="flex flex-wrap gap-1.5">
                {trainingDays.map((d) => (
                  <span key={d} className="text-[11px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                    {["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][d]}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2">
                {trainingDays.length} treino{trainingDays.length !== 1 ? "s" : ""} por semana — {getSplitLabel(trainingDays.length)}
              </p>
            </div>
          </div>
        )}

        {/* ── Step 9: Data de Início ────────────────────────────────────────── */}
        {step === 9 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Data de Início</span>
              <h2 className="font-display text-xl font-bold text-on-surface mt-0.5">A partir de quando você quer começar?</h2>
              <p className="text-xs text-on-surface-variant mt-1">Seu plano será montado a partir dessa data.</p>
            </div>

            {/* Quick options */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStartDate(today)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-start gap-1 ${
                  startDate === today
                    ? "bg-primary text-on-primary border-transparent shadow-lg shadow-primary/20"
                    : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">today</span>
                <span className="font-display text-sm font-bold">Hoje</span>
                <span className="text-[11px] opacity-80">Começar agora!</span>
              </button>
              <button
                type="button"
                onClick={() => setStartDate(nextMonday())}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-start gap-1 ${
                  startDate === nextMonday()
                    ? "bg-primary text-on-primary border-transparent shadow-lg shadow-primary/20"
                    : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                <span className="font-display text-sm font-bold">Próxima Segunda</span>
                <span className="text-[11px] opacity-80">Começar organizado</span>
              </button>
            </div>

            {/* Custom date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Ou escolha uma data personalizada:</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">event</span>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-sm font-bold pl-11 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Preview summary */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Resumo do seu plano</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Início",
                    value: new Date(startDate + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }),
                    icon: "event",
                  },
                  { label: "Frequência", value: `${trainingDays.length}x / semana`, icon: "repeat" },
                  { label: "Split", value: getSplitLabel(trainingDays.length), icon: "view_week" },
                  {
                    label: "Objetivo",
                    value: { recomp: "Recomposição", hypertrophy: "Hipertrofia", cutting: "Cutting", strength: "Força" }[goal],
                    icon: "flag",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant">{item.label}</p>
                      <p className="text-xs font-bold text-on-surface">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleNext}
            disabled={
              generating ||
              (step === 2 && (!age || !weight || !height))
            }
            className="w-full min-h-[52px] rounded-xl bg-primary text-on-primary font-display text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                <span>Gerando seu plano com IA...</span>
              </>
            ) : step === TOTAL_STEPS ? (
              <>
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                <span>Concluir e Ver Meu Plano</span>
              </>
            ) : (
              <>
                <span>{step === 1 ? "Começar Questionário" : "Continuar"}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i + 1 === step
                    ? "w-5 h-1.5 bg-primary"
                    : i + 1 < step
                    ? "w-1.5 h-1.5 bg-primary/50"
                    : "w-1.5 h-1.5 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
