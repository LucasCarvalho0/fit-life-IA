"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Tipos do Onboarding ──────────────────────────────────────────────────────
type Gender = "male" | "female";
type Goal = "hypertrophy" | "cutting" | "recomp" | "conditioning";
type Experience = "beginner" | "intermediate" | "advanced";
type WorkWindow = "commercial" | "night" | "flexible";
type WorkoutTime = "morning" | "lunch" | "afternoon" | "night";
type GymType = "smartfit" | "bluefit" | "neighborhood" | "homegym";

interface CalculatedPlan {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  creatineGrams: number;
}

export default function OnboardingPage() {
  const router = useRouter();

  // Etapa atual (1 a 5)
  const [step, setStep] = useState(2); // Inicia na Etapa 2 (Biometria) ou 1 se não tiver nome
  const [generating, setGenerating] = useState(false);

  // Etapa 1: Boas-vindas
  const [firstName, setFirstName] = useState("");

  // Etapa 2: Biometria & Metabolismo (Image 7)
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(76.4);
  const [experience, setExperience] = useState<Experience>("intermediate");

  // Etapa 3: Objetivos & Metas Físicas (Image 9)
  const [goal, setGoal] = useState<Goal>("recomp");
  const [targetWeight, setTargetWeight] = useState(73.0);
  const [evolutionRate, setEvolutionRate] = useState<"conservative" | "moderate" | "accelerated">("moderate");
  const [frequencyDays, setFrequencyDays] = useState(5);

  // Etapa 4: Rotina Diária & Ritmo Circadiano (Image 8)
  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [workWindow, setWorkWindow] = useState<WorkWindow>("commercial");
  const [workoutTime, setWorkoutTime] = useState<WorkoutTime>("afternoon");
  const [mealCount, setMealCount] = useState<number>(4);

  // Etapa 5: Equipamentos & Estrutura
  const [gym, setGym] = useState<GymType>("smartfit");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Seg-Sex

  // Carregar dados salvos ou sessão
  useEffect(() => {
    const loadSession = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const meta = data.user.user_metadata || {};
          if (meta.first_name) setFirstName(meta.first_name);
          else if (data.user.email) setFirstName(data.user.email.split("@")[0] ?? "");
        }
      } catch {
        // fallback
      }
    };
    loadSession();
  }, []);

  // Cálculo da TMB Mifflin-St Jeor em tempo real
  const calculateLiveBMR = () => {
    const s = gender === "male" ? 5 : -161;
    return Math.round(10 * weight + 6.25 * height - 5 * age + s);
  };

  const liveBMR = calculateLiveBMR();

  // Função para salvar e concluir onboarding
  const handleFinishOnboarding = async () => {
    setGenerating(true);

    // Cálculos metabólicos determinísticos
    const bmr = liveBMR;
    const activityMultipliers = { 1: 1.2, 2: 1.3, 3: 1.4, 4: 1.5, 5: 1.6, 6: 1.7, 7: 1.8 };
    const mult = activityMultipliers[frequencyDays as keyof typeof activityMultipliers] || 1.5;
    const tdee = Math.round(bmr * mult);

    let targetCalories = tdee;
    if (goal === "hypertrophy") targetCalories = tdee + 400;
    else if (goal === "cutting") targetCalories = tdee - 450;
    else if (goal === "recomp") targetCalories = tdee - 150;

    const protein = Math.round(weight * 2.1);
    const fat = Math.round((targetCalories * 0.25) / 9);
    const carbs = Math.max(50, Math.round((targetCalories - protein * 4 - fat * 9) / 4));
    const waterMl = Math.round(weight * 40);
    const creatineGrams = Math.max(3, Math.round(weight * 0.07 * 10) / 10);

    const plan: CalculatedPlan = {
      bmr,
      tdee,
      targetCalories,
      protein,
      carbs,
      fat,
      waterMl,
      creatineGrams,
    };

    const profileData = {
      firstName: firstName || "Atleta",
      gender,
      age,
      height,
      weight,
      targetWeight,
      goal,
      experience,
      frequencyDays,
      wakeTime,
      sleepTime,
      workWindow,
      workoutTime,
      mealCount,
      gym,
      selectedDays,
      plan,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    // Salvar no localStorage para acesso offline-first imediato
    localStorage.setItem("fitlife_profile", JSON.stringify(profileData));
    localStorage.setItem("fitlife_avatar", "/brand/logo-icon.jpg");

    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          onboarding_completed: true,
          profile: profileData,
        },
      });
    } catch {
      // offline fallback
    }

    setTimeout(() => {
      setGenerating(false);
      router.replace("/dashboard");
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-surface text-on-surface antialiased">
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 flex flex-col justify-between">
        {/* ========================================================================= */}
        {/* ETAPA 1: Boas-vindas & Nome */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="flex flex-col flex-1 justify-between gap-6 animate-in fade-in duration-200">
            <header className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">1 / 5</span>
                <span className="text-xs text-primary font-bold">20% concluído</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "20%" }} />
              </div>
            </header>

            <div className="flex flex-col items-center text-center gap-4 my-auto">
              <div className="w-20 h-20 rounded-3xl bg-surface-container-high border border-white/10 flex items-center justify-center p-3 shadow-2xl">
                <span className="material-symbols-outlined text-[44px] text-primary">fitness_center</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-on-surface">
                Bem-vindo ao <span className="text-primary font-display">Fit Life IA</span>
              </h1>
              <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
                Vamos personalizar sua periodização muscular, nutrição cronobiológica e substituições inteligentes.
              </p>

              <div className="w-full mt-4 flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="nameInput">
                  Como quer ser chamado?
                </label>
                <input
                  id="nameInput"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="w-full bg-surface-container-highest text-on-surface text-sm px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continuar para Biometria</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 2: Biometria & Metabolismo (Fiel a Image 7) */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="flex flex-col flex-1 gap-5 animate-in fade-in duration-200">
            {/* Top Navigation & Progress Header */}
            <header className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-white/5 text-primary text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">science</span>
                  <span className="text-on-surface-variant uppercase tracking-wider">Mifflin-St Jeor • Cálculo Preciso</span>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">2/5</span>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary font-semibold">Etapa 2: Biometria &amp; Metabolismo</span>
                  <span className="text-on-surface-variant">40% concluído</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: "40%" }} />
                </div>
              </div>
            </header>

            {/* Title & Context */}
            <section className="flex flex-col gap-1">
              <h1 className="font-display text-xl font-extrabold text-on-surface tracking-tight">
                Conte-nos sobre seu corpo
              </h1>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Essas medidas calibram o motor de inteligência e dividem seus macronutrientes com rigor matemático.
              </p>
            </section>

            {/* Sexo Biológico */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface">Sexo Biológico</label>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Premissa TMB</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Masculino */}
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all active:scale-95 ${
                    gender === "male"
                      ? "bg-surface-container-high border-primary text-on-surface shadow-md"
                      : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface opacity-80"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center mb-1 transition-colors ${
                      gender === "male" ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">male</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">Masculino</span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5 font-medium">Equação +5 kcal</span>
                  {gender === "male" && (
                    <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                  )}
                </button>

                {/* Feminino */}
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all active:scale-95 ${
                    gender === "female"
                      ? "bg-surface-container-high border-primary text-on-surface shadow-md"
                      : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface opacity-80"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center mb-1 transition-colors ${
                      gender === "female" ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">female</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">Feminino</span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5 font-medium">Equação -161 kcal</span>
                  {gender === "female" && (
                    <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-tertiary">info</span>
                <span>Essencial para o cálculo de TMB basal validado clinicamente.</span>
              </p>
            </section>

            {/* Biometrics Grid: Idade e Altura */}
            <div className="grid grid-cols-2 gap-3">
              {/* Idade */}
              <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-surface-container border border-white/5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Idade</span>
                  <span className="material-symbols-outlined text-[18px] text-primary">cake</span>
                </div>
                <div className="my-2 flex items-baseline justify-center gap-1">
                  <span className="font-display text-2xl font-black text-on-surface">{age}</span>
                  <span className="text-xs text-on-surface-variant">anos</span>
                </div>
                <div className="flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAge((prev) => Math.max(14, prev - 1))}
                    className="flex-1 h-8 rounded-lg bg-surface-container-high text-on-surface active:scale-95 flex items-center justify-center font-bold text-base border border-white/5"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setAge((prev) => Math.min(80, prev + 1))}
                    className="flex-1 h-8 rounded-lg bg-surface-container-high text-on-surface active:scale-95 flex items-center justify-center font-bold text-base border border-white/5"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Altura */}
              <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-surface-container border border-white/5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Altura</span>
                  <span className="material-symbols-outlined text-[18px] text-primary">straighten</span>
                </div>
                <div className="my-2 flex items-baseline justify-center gap-1">
                  <span className="font-display text-2xl font-black text-on-surface">{height}</span>
                  <span className="text-xs text-on-surface-variant">cm</span>
                </div>
                <div className="flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHeight((prev) => Math.max(120, prev - 1))}
                    className="flex-1 h-8 rounded-lg bg-surface-container-high text-on-surface active:scale-95 flex items-center justify-center font-bold text-base border border-white/5"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeight((prev) => Math.min(220, prev + 1))}
                    className="flex-1 h-8 rounded-lg bg-surface-container-high text-on-surface active:scale-95 flex items-center justify-center font-bold text-base border border-white/5"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Peso Corporal Atual com TMB Preliminar */}
            <div className="p-4 rounded-2xl bg-surface-container border border-white/5 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">scale</span>
                  <span>Peso Corporal Atual</span>
                </div>
                <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                  Decimais
                </span>
              </div>

              <div className="flex items-center justify-between px-2 py-1">
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Math.max(35, Math.round((prev - 0.2) * 10) / 10))}
                  className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface active:scale-95 flex items-center justify-center font-bold text-xl border border-white/5"
                >
                  -
                </button>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black text-primary font-mono">{weight.toFixed(1)}</span>
                  <span className="text-sm font-semibold text-on-surface-variant">kg</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Math.min(200, Math.round((prev + 0.2) * 10) / 10))}
                  className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface active:scale-95 flex items-center justify-center font-bold text-xl border border-white/5"
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                <span className="text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                  TMB Estimada Preliminar
                </span>
                <span className="font-mono font-bold text-on-surface">~{liveBMR.toLocaleString("pt-BR")} kcal/dia</span>
              </div>
            </div>

            {/* Experiência em Musculação */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface">Experiência em Musculação</label>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Ajuste de Cargas</span>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  {
                    id: "beginner",
                    label: "Iniciante",
                    time: "< 6 meses",
                    desc: "Foco em consistência, adaptação neuromuscular e padrões posturais.",
                    icon: "open_in_full",
                  },
                  {
                    id: "intermediate",
                    label: "Intermediário",
                    time: "6m - 2 anos",
                    desc: "Domínio dos exercícios básicos, hipertrofia ativa e sobrecarga progressiva.",
                    icon: "trending_up",
                  },
                  {
                    id: "advanced",
                    label: "Avançado",
                    time: "> 2 anos",
                    desc: "Periodização de intensidade, autorregulação por RPE/RIR e foco em detalhes.",
                    icon: "military_tech",
                  },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperience(exp.id as Experience)}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border text-left transition-all active:scale-98 ${
                      experience === exp.id
                        ? "bg-surface-container-high border-primary shadow-md"
                        : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          experience === exp.id ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{exp.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-on-surface">{exp.label}</span>
                          <span className="text-[10px] text-on-surface-variant font-mono">{exp.time}</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">{exp.desc}</p>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        experience === exp.id ? "border-primary bg-primary" : "border-white/20"
                      }`}
                    >
                      {experience === exp.id && (
                        <span className="material-symbols-outlined text-on-primary text-[10px]">check</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Algoritmo Personalizado Box */}
            <div className="p-3 rounded-2xl bg-surface-container border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Algoritmo Personalizado</span>
                <p className="text-[10px] text-on-surface-variant leading-tight mt-0.5">
                  Seu plano gerará volume de treino individualizado para máxima recuperação.
                </p>
              </div>
            </div>

            {/* Botão de Próxima Etapa */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Continuar para Objetivos</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <p className="text-[10px] text-center text-on-surface-variant flex items-center justify-center gap-1 opacity-70">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                <span>Seus dados físicos e biométricos protegidos com total privacidade</span>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 3: Objetivos & Metas Físicas (Fiel a Image 9) */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="flex flex-col flex-1 gap-5 animate-in fade-in duration-200">
            {/* Header */}
            <header className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-white/5 text-primary text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">tune</span>
                  <span className="text-on-surface-variant uppercase tracking-wider">Periodização &amp; Recomposição</span>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">3/5</span>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary font-semibold">Etapa 3: Objetivos &amp; Metas Físicas</span>
                  <span className="text-on-surface-variant">60% concluído</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: "60%" }} />
                </div>
              </div>
            </header>

            {/* Title */}
            <section className="flex flex-col gap-1">
              <h1 className="font-display text-xl font-extrabold text-on-surface tracking-tight">
                Qual é o seu objetivo principal?
              </h1>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                O motor metabólico calibra o balanço calórico diário (superávit, déficit controlado ou normocalórica) e a divisão de treinos com precisão atlética.
              </p>
            </section>

            {/* Cards de Objetivos */}
            <section className="flex flex-col gap-2.5">
              {[
                {
                  id: "hypertrophy",
                  title: "Hipertrofia & Massa Muscular",
                  tag: "Superávit ~300-500 kcal",
                  desc: "Bulking limpo com ênfase em sobrecarga progressiva, balanço nitrogenado positivo e estímulo máximo de tensão mecânica miofibrilar.",
                  icon: "fitness_center",
                },
                {
                  id: "cutting",
                  title: "Definição & Emagrecimento",
                  tag: "Déficit calculado sem catabolismo",
                  desc: "Cutting sustentável com preservação rigorosa de massa magra, modulação hormonal protetora e densidade nutricional balanceada.",
                  icon: "local_fire_department",
                },
                {
                  id: "recomp",
                  title: "Recomposição Corporal",
                  badge: "Estratégia Ouro",
                  tag: "Normocalórica ciclizada",
                  desc: "Oxidação lipídica e síntese proteica simultâneas. Ideal para otimizar composição com estabilidade energética metabólica.",
                  icon: "sync_alt",
                },
                {
                  id: "conditioning",
                  title: "Condicionamento & Saúde Geral",
                  tag: "Homeostase & Resistência",
                  desc: "Manutenção de peso ponderal, incremento de densidade mitocondrial e modulação de marcadores cardiovasculares e longevidade.",
                  icon: "monitor_heart",
                },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id as Goal)}
                  className={`flex flex-col gap-1.5 p-3.5 rounded-2xl border text-left transition-all active:scale-98 ${
                    goal === g.id
                      ? "bg-surface-container-high border-primary shadow-md"
                      : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          goal === g.id ? "bg-primary text-on-primary" : "bg-surface-container-highest text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{g.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-on-surface">{g.title}</h3>
                          {g.badge && (
                            <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {g.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-primary uppercase font-semibold">{g.tag}</span>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                        goal === g.id ? "border-primary bg-primary" : "border-white/20"
                      }`}
                    >
                      {goal === g.id && (
                        <span className="material-symbols-outlined text-on-primary text-[10px]">check</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant pl-11 leading-relaxed">{g.desc}</p>
                </button>
              ))}
            </section>

            {/* Meta de Peso Corporal Stepper */}
            <div className="p-4 rounded-2xl bg-surface-container border border-white/5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">flag</span>
                  Meta de Peso Corporal
                </span>
                <span className="text-[10px] text-on-surface-variant font-mono">Atual: {weight.toFixed(1)} kg</span>
              </div>

              <div className="flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={() => setTargetWeight((prev) => Math.max(35, Math.round((prev - 0.5) * 10) / 10))}
                  className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface active:scale-95 flex items-center justify-center font-bold text-xl border border-white/5"
                >
                  -
                </button>
                <div className="flex flex-col items-center">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-black text-on-surface font-mono">
                      {targetWeight.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-on-surface-variant">kg</span>
                  </div>
                  <span className="text-[10px] text-primary font-medium">
                    {targetWeight < weight
                      ? `-${(weight - targetWeight).toFixed(1)} kg de emagrecimento/recomposição`
                      : `+${(targetWeight - weight).toFixed(1)} kg de ganho muscular`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTargetWeight((prev) => Math.min(200, Math.round((prev + 0.5) * 10) / 10))}
                  className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface active:scale-95 flex items-center justify-center font-bold text-xl border border-white/5"
                >
                  +
                </button>
              </div>

              {/* Ritmo de Evolução Seguro (Protocolo ISSN) */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                  <span>Ritmo de Evolução Seguro</span>
                  <span className="text-primary font-bold">Protocolo ISSN</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "conservative", label: "Conservador", rate: "0.3 kg/sem" },
                    { id: "moderate", label: "Moderado", rate: "0.5 kg/sem" },
                    { id: "accelerated", label: "Acelerado", rate: "0.8 kg/sem" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setEvolutionRate(r.id as any)}
                      className={`py-2 px-1 rounded-xl border flex flex-col items-center transition-all ${
                        evolutionRate === r.id
                          ? "bg-primary text-on-primary font-bold border-primary shadow-sm"
                          : "bg-surface-container-high text-on-surface-variant border-white/5 hover:text-on-surface"
                      }`}
                    >
                      <span className="text-[10px]">{r.label}</span>
                      <span className="text-[9px] opacity-80 font-mono">{r.rate}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Frequência de Treinos Semanal */}
            <div className="p-4 rounded-2xl bg-surface-container border border-white/5 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Frequência de Treinos Semanal</h4>
                  <p className="text-[10px] text-on-surface-variant">Dias disponíveis para estímulo neuromuscular</p>
                </div>
                <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                  Ótimo: 4 a 5 dias
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 mt-1">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFrequencyDays(d)}
                    className={`h-10 rounded-xl font-mono text-sm font-bold flex items-center justify-center transition-all ${
                      frequencyDays === d
                        ? "bg-primary text-on-primary shadow-md scale-105"
                        : "bg-surface-container-high text-on-surface-variant border border-white/5 hover:text-on-surface"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1 text-[10px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-primary">splitscreen</span>
                <span>
                  Divisão programada:{" "}
                  {frequencyDays <= 3
                    ? "Full Body (3x/sem)"
                    : frequencyDays === 4
                    ? "Upper / Lower (4x/sem)"
                    : frequencyDays === 5
                    ? "Upper / Lower / Push / Pull / Legs (5x/sem)"
                    : "Push / Pull / Legs Duplo (6x/sem)"}
                </span>
              </div>
            </div>

            {/* Botão Próximo */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Continuar para Rotina &amp; Horários</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <p className="text-[10px] text-center text-on-surface-variant flex items-center justify-center gap-1 opacity-70">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                <span>Validação determinística baseada nas diretrizes ISSN e ACSM</span>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 4: Rotina Diária & Ritmo Circadiano (Fiel a Image 8) */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="flex flex-col flex-1 gap-5 animate-in fade-in duration-200">
            {/* Header */}
            <header className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-white/5 text-primary text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">bedtime</span>
                  <span className="text-on-surface-variant uppercase tracking-wider">Cronobiologia &amp; Ritmo Circadiano</span>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">4/5</span>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary font-semibold">Etapa 4: Rotina Diária &amp; Ritmo Circadiano</span>
                  <span className="text-on-surface-variant">80% concluído</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: "80%" }} />
                </div>
              </div>
            </header>

            {/* Title */}
            <section className="flex flex-col gap-1">
              <h1 className="font-display text-xl font-extrabold text-on-surface tracking-tight">
                Como funciona o seu dia?
              </h1>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                O FitLife AI organiza sua alimentação, janelas de pré/pós-treino e recuperação muscular adaptando-se exatamente aos seus horários reais (mesmo turnos noturnos ou escalas).
              </p>
            </section>

            {/* 1. Ciclo de Sono & Descanso */}
            <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">nightlight_round</span>
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-on-surface">Ciclo de Sono &amp; Descanso</h2>
                    <p className="text-[10px] text-on-surface-variant">Regulação hormonal &amp; GH noturno</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">tune</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Acorda */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] text-tertiary font-bold uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">wb_sunny</span>
                    Acorda às
                  </span>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="font-display text-xl font-black text-on-surface bg-transparent focus:outline-none"
                  />
                </div>

                {/* Dorme */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] text-secondary font-bold uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">bedtime</span>
                    Dorme às
                  </span>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="font-display text-xl font-black text-on-surface bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-primary">Duração estimada: 7h 30min de sono reparador</span>
                  <span className="text-[9px] text-on-surface-variant">Zona Ótima de Recuperação (GH &amp; Síntese Proteica)</span>
                </div>
              </div>
            </section>

            {/* 2. Janela de Trabalho / Estudo */}
            <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">business_center</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Janela de Trabalho / Estudo</h3>
                  <p className="text-[10px] text-on-surface-variant">Para evitar sobreposição com refeições críticas</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "commercial", label: "Comercial", desc: "Padrão" },
                  { id: "night", label: "Noturno", desc: "12x36 / Escala" },
                  { id: "flexible", label: "Flexível", desc: "Home Office" },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWorkWindow(w.id as WorkWindow)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center transition-all ${
                      workWindow === w.id
                        ? "bg-primary text-on-primary font-bold border-primary shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant border-white/5 hover:text-on-surface"
                    }`}
                  >
                    <span className="text-xs">{w.label}</span>
                    <span className="text-[9px] opacity-80">{w.desc}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Horário Preferencial de Treino */}
            <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Horário Preferencial de Treino</h3>
                  <p className="text-[10px] text-on-surface-variant">Calibra picos de energia e aporte calórico</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "morning", label: "Manhã Cedo", time: "06:00 - 08:00", icon: "wb_sunny" },
                  { id: "lunch", label: "Almoço", time: "12:00 - 13:30", icon: "restaurant" },
                  { id: "afternoon", label: "Fim de Tarde", time: "18:30 - 20:00", icon: "wb_twilight" },
                  { id: "night", label: "Noite", time: "20:30 - 22:30", icon: "bedtime" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setWorkoutTime(t.id as WorkoutTime)}
                    className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-all ${
                      workoutTime === t.id
                        ? "bg-surface-container-high border-primary text-primary shadow-sm"
                        : "bg-surface-container-low border-white/5 text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          workoutTime === t.id ? "border-primary bg-primary" : "border-white/20"
                        }`}
                      >
                        {workoutTime === t.id && (
                          <span className="material-symbols-outlined text-on-primary text-[8px]">check</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-on-surface">{t.label}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{t.time}</span>
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low border border-white/5 flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">auto_awesome</span>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">Sincronização FitLife IA:</strong> Pré-treino com carboidratos complexos programado para 17:15 e pós-treino proteico anabólico para as 20:15.
                </p>
              </div>
            </section>

            {/* 4. Frequência de Refeições */}
            <section className="bg-surface-container rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface">Frequência de Refeições</h3>
                  <p className="text-[10px] text-on-surface-variant">Distribuição de macros e digestão</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 6].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setMealCount(count)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      mealCount === count
                        ? "bg-primary text-on-primary border-primary shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant border-white/5 hover:text-on-surface"
                    }`}
                  >
                    {count} Refeições
                  </button>
                ))}
              </div>

              {/* Cronograma circadiano sugerido */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  Cronograma Circadiano Sugerido
                </span>
                <div className="flex flex-col gap-1 text-[11px] text-on-surface-variant">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-white/5">
                    <span className="font-mono text-primary font-bold">07:00</span>
                    <span className="text-on-surface">Café da Manhã Energético</span>
                    <span className="material-symbols-outlined text-[14px]">coffee</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-white/5">
                    <span className="font-mono text-primary font-bold">12:30</span>
                    <span className="text-on-surface">Almoço Anabólico Completo</span>
                    <span className="material-symbols-outlined text-[14px]">lunch_dining</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-white/5">
                    <span className="font-mono text-tertiary font-bold">17:15</span>
                    <span className="text-tertiary font-semibold">Pré-Treino de Absorção Rápida</span>
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-white/5">
                    <span className="font-mono text-primary font-bold">20:45</span>
                    <span className="text-on-surface">Jantar &amp; Ceia de Recomposição</span>
                    <span className="material-symbols-outlined text-[14px]">dinner_dining</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Botão Próximo */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Continuar para Equipamentos &amp; Academia</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <p className="text-[10px] text-center text-on-surface-variant flex items-center justify-center gap-1 opacity-70">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                <span>Cronograma ajustável a qualquer momento no perfil com recalibração da IA</span>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 5: Infraestrutura & Aparelhos (Fiel a Image 5) */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="flex flex-col flex-1 gap-5 animate-in fade-in duration-200">
            {/* Header */}
            <header className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-white/5 text-primary text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">neurology</span>
                  <span className="text-on-surface-variant uppercase tracking-wider">Biomecânica de Precisão</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-primary">
                  <span className="font-bold">5</span>
                  <span className="text-on-surface-variant">/ 5</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary font-semibold">Etapa 5: Infraestrutura &amp; Aparelhos</span>
                  <span className="text-primary font-bold">100% Concluído</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500 shadow-sm" style={{ width: "100%" }} />
                </div>
              </div>
            </header>

            {/* Title */}
            <section className="flex flex-col gap-1">
              <h1 className="font-display text-xl font-extrabold text-on-surface tracking-tight">
                Onde você vai treinar?
              </h1>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                O motor biomecânico do <strong className="text-primary font-semibold">FitLife AI</strong> mapeia a sobrecarga metabólica e ajusta cada exercício ao maquinário real disponível, garantindo o mesmo vetor de hipertrofia.
              </p>
            </section>

            {/* Visual Environment Snapshot Card (Image 1 Banner) */}
            <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-surface-container border border-white/10 shadow-lg">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/images/gym-banner.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] text-primary uppercase tracking-wider font-bold">
                      Mapeador de Tensão Mecânica
                    </span>
                  </div>
                  <p className="font-display text-sm font-bold text-on-surface mt-0.5">
                    Calibração de Resistência Fechada
                  </p>
                </div>
              </div>
            </div>

            {/* Presets: Gym Archetypes */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface">Perfil da Instalação</span>
                <span className="text-[10px] text-on-surface-variant">Presets instantâneos</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: "smartfit",
                    title: "Academia Comercial / Rede",
                    subtitle: "Smart Fit, Bluefit, maquinário completo",
                    badges: ["48 Aparelhos", "Polias 3D", "Halotécnica 100%"],
                    icon: "domain",
                  },
                  {
                    id: "neighborhood",
                    title: "Academia de Ferro / Tradicional",
                    subtitle: "Foco em anilhas olímpicas, bancos pesados e halteres",
                    icon: "fitness_center",
                  },
                  {
                    id: "homegym",
                    title: "Home Gym & Calistenia",
                    subtitle: "Halteres compactos, elásticos e barra de porta",
                    icon: "home_pin",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGym(item.id as GymType)}
                    className={`p-3.5 rounded-2xl border text-left transition-all active:scale-98 ${
                      gym === item.id
                        ? "bg-surface-container-high border-primary shadow-md"
                        : "bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface opacity-85"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            gym === item.id ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-on-surface truncate">{item.title}</span>
                          <span className="text-[10px] text-on-surface-variant">{item.subtitle}</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          gym === item.id ? "border-primary bg-primary text-on-primary" : "border-white/20"
                        }`}
                      >
                        {gym === item.id && (
                          <span className="material-symbols-outlined text-[12px]">check</span>
                        )}
                      </div>
                    </div>
                    {item.badges && (
                      <div className="flex items-center gap-1.5 mt-2.5 pt-1 border-t border-white/5">
                        {item.badges.map((b, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                              idx === 0 ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Inventário Individual de Aparelhos */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-on-surface">Inventário Individual</h2>
                <span className="text-[10px] text-primary font-bold">6/7 Selecionados</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {[
                  {
                    name: "Banco Reto & Inclinado c/ Halteres",
                    desc: "1kg a 36kg calibrados",
                    icon: "exercise",
                    checked: true,
                  },
                  {
                    name: "Cross Over / Polia Dupla Regulável",
                    desc: "Torre com mosquetões e pegadas neutras",
                    icon: "cable",
                    checked: true,
                  },
                  {
                    name: "Smith Machine / Barra Guiada",
                    desc: "Trava de segurança multiposicional",
                    icon: "view_column",
                    checked: true,
                  },
                  {
                    name: "Leg Press 45° & Extensora",
                    desc: "Plataforma angular e rolete autoajustável",
                    icon: "downhill_skiing",
                    checked: true,
                  },
                  {
                    name: "Barra Fixa & Barras Paralelas",
                    desc: "Pegadas pronadas, supinadas e neutras",
                    icon: "sports_gymnastics",
                    checked: true,
                  },
                  {
                    name: "Hack Squat Articulado",
                    desc: "Substituição ativa: Agachamento Búlgaro",
                    icon: "block",
                    checked: false,
                  },
                  {
                    name: "Peck Deck / Voador Peitoral",
                    desc: "Braços articulados com amplitude total",
                    icon: "open_in_full",
                    checked: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-white/5 hover:bg-surface-container-high transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-on-surface truncate">{item.name}</span>
                        <span className="text-[10px] text-on-surface-variant truncate">{item.desc}</span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        item.checked ? "bg-primary/20 text-primary" : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {item.checked ? "check_circle" : "radio_button_unchecked"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Motor Biomecânico Ativo Box */}
            <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">neurology</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-on-surface flex items-center gap-1.5">
                  Motor Biomecânico Ativo <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                  Se qualquer aparelho estiver ocupado ou indisponível no dia, a IA gera em tempo real a equivalência exata de <strong className="text-on-surface">tensão muscular longitudinal</strong> e sobrecarga progressiva.
                </p>
              </div>
            </div>

            {/* Periodização Sob Demanda Box */}
            <div className="p-3 rounded-2xl bg-surface-container border border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                  Periodização Sob Demanda
                </span>
                <p className="text-[10px] text-on-surface-variant leading-tight mt-0.5">
                  Sua planilha será montada para eliminar gargalos de tempo de espera.
                </p>
              </div>
            </div>

            {/* Botão de Finalização com Loading */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                disabled={generating}
                onClick={handleFinishOnboarding}
                className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    <span>Compilando Periodização &amp; Metas...</span>
                  </>
                ) : (
                  <>
                    <span>Concluir Onboarding &amp; Gerar Treino</span>
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-on-surface-variant flex items-center justify-center gap-1 opacity-70">
                <span className="material-symbols-outlined text-[12px]">security</span>
                <span>Cálculos TMB/TDEE e periodização determinística prontos para compilação.</span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
