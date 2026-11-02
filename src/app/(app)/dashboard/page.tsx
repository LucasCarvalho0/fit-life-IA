"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FitLifeLogo } from "@/components/brand/logo";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Atleta");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [waterCurrent, setWaterCurrent] = useState(0);
  const [waterTarget, setWaterTarget] = useState(3000);
  const [creatineDose, setCreatineDose] = useState(5.0);
  const [supplementsTaken, setSupplementsTaken] = useState<{
    creatine: boolean;
    whey: boolean;
    multivitamin: boolean;
  }>({
    creatine: false,
    whey: false,
    multivitamin: false,
  });

  const waterPercent = Math.min(100, Math.round((waterCurrent / waterTarget) * 100));

  const [mealLogged, setMealLogged] = useState(false);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [inputWeight, setInputWeight] = useState("");

  // Carregar dados reais do usuário logado e avatar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const meta = user.user_metadata ?? {};
          const name = meta.first_name || (meta.full_name ? meta.full_name.split(" ")[0] : null) || (user.email ? user.email.split("@")[0] : "Atleta");
          setUserName(name);

          const localAvatar = localStorage.getItem("fitlife_avatar");
          const remoteAvatar = meta.avatar_url || meta.picture || null;
          setAvatarUrl(localAvatar || remoteAvatar);

          // Carregar peso do perfil se disponível
          const profileStr = localStorage.getItem("fitlife_profile");
          if (profileStr) {
            const parsed = JSON.parse(profileStr);
            if (parsed.weight) {
              const w = Number(parsed.weight);
              setWaterTarget(Math.round(w * 40));
              setCreatineDose(Math.max(3, Math.round(w * 0.07 * 10) / 10));
            }
          }
        } else {
          // Tentar perfil salvo no onboarding
          const profileStr = localStorage.getItem("fitlife_profile");
          if (profileStr) {
            const parsed = JSON.parse(profileStr);
            if (parsed.firstName) setUserName(parsed.firstName);
            if (parsed.weight) {
              const w = Number(parsed.weight);
              setWaterTarget(Math.round(w * 40));
              setCreatineDose(Math.max(3, Math.round(w * 0.07 * 10) / 10));
            }
          }
          const localAvatar = localStorage.getItem("fitlife_avatar");
          if (localAvatar) setAvatarUrl(localAvatar);
        }
      } catch {
        // fallback
      }
    };

    loadUserData();
  }, []);

  const addWater = (amount: number) => {
    setWaterCurrent((prev) => Math.min(6000, prev + amount));
  };

  const resetWater = () => {
    setWaterCurrent(0);
  };

  const handleSaveInitialWeight = () => {
    const val = parseFloat(inputWeight);
    if (!isNaN(val) && val > 30 && val < 250) {
      setCurrentWeight(val);
      setShowWeightModal(false);
      setInputWeight("");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <FitLifeLogo size="sm" iconOnly className="shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-primary tracking-wider uppercase">NOVO ATLETA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <h1 className="font-display text-base font-extrabold text-on-surface truncate">FIT LIFE IA</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full border border-white/5 shadow-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
              <span className="text-xs text-on-surface font-bold">Dia 1</span>
            </div>
            <Link
              href="/notificacoes"
              aria-label="Notificações"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors relative"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </Link>
            <Link
              href="/configuracoes"
              title="Perfil & Foto"
              className="w-9 h-9 rounded-full overflow-hidden bg-primary flex items-center justify-center transition-transform active:scale-95 border border-white/10 shadow-sm"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-5">
        {/* 1. Saudação, Status & Calibração IA */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 bg-surface-container-high/80 px-2.5 py-1 rounded-full border border-white/5">
              <span className="material-symbols-outlined text-primary text-[14px]">auto_awesome</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Motor FitLife v2.4 • Plano Inicial
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-tertiary-container/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              <span className="text-[10px] font-semibold text-tertiary">Novo Ciclo</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="font-display text-2xl font-bold text-on-surface tracking-tight">Olá, {userName}! 👋</h2>
            <p className="text-sm text-on-surface-variant">
              Hoje é o seu <span className="text-primary font-bold">Dia 1</span>. Vamos começar com o treino inicial e hidratação.
            </p>
          </div>
        </section>

        {/* 2. Card Hero de Treino do Dia */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex flex-col gap-4">
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary-container to-transparent" />

          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mb-0.5">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>PRIMEIRO TREINO • A INICIAR</span>
              </div>
              <h3 className="font-display text-lg font-bold text-on-surface truncate">
                Treino A: Peitoral, Ombros &amp; Tríceps
              </h3>
            </div>
            <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-surface-container-high text-primary border border-white/5">
              <span className="material-symbols-outlined text-[20px]">fitness_center</span>
            </span>
          </div>

          {/* Chips métricos do treino */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-high/60 border border-white/5 text-center">
              <span className="font-display text-base font-bold text-on-surface">5</span>
              <span className="text-[10px] uppercase text-on-surface-variant font-medium">Exercícios</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-high/60 border border-white/5 text-center">
              <span className="font-display text-base font-bold text-on-surface">~45 min</span>
              <span className="text-[10px] uppercase text-on-surface-variant font-medium">Duração</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-high/60 border border-white/5 text-center">
              <span className="font-display text-base font-bold text-on-surface">15</span>
              <span className="text-[10px] uppercase text-on-surface-variant font-medium">Séries Totais</span>
            </div>
          </div>

          {/* Mini-lista inicial */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span className="uppercase tracking-wider font-semibold text-[10px]">Sequência de Hoje</span>
              <span className="text-primary text-[11px] font-medium">Academia Configurada</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-low border border-white/5 text-on-surface">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-xs font-medium truncate">Supino Reto com Halteres</span>
                </div>
                <span className="text-[11px] text-on-surface-variant shrink-0 ml-2 font-mono">3x 10-12</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-low border border-white/5 text-on-surface">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                  <span className="text-xs font-medium truncate">Desenvolvimento com Halteres</span>
                </div>
                <span className="text-[11px] text-on-surface-variant shrink-0 ml-2 font-mono">3x 10</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-low border border-white/5 text-on-surface">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                  <span className="text-xs font-medium truncate">Tríceps na Polia com Barra Reta</span>
                </div>
                <span className="text-[11px] text-on-surface-variant shrink-0 ml-2 font-mono">3x 12</span>
              </div>
            </div>
          </div>

          {/* CTAs de Treino */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/treino/ativo"
              className="flex-1 min-h-[46px] rounded-xl bg-primary text-on-primary font-display text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
              <span>Iniciar 1º Treino</span>
            </Link>
            <Link
              href="/treino"
              className="min-h-[46px] px-4 rounded-xl bg-surface-container-high border border-white/5 text-on-surface font-semibold text-xs flex items-center justify-center hover:bg-surface-variant active:scale-95 transition-transform"
            >
              <span>Ver Ficha</span>
            </Link>
          </div>
        </section>

        {/* 3. Painel Metabólico Diário (Zeradinho) */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">monitor_heart</span>
              <h3 className="font-display text-sm font-bold text-on-surface">Balanço Metabólico</h3>
            </div>
            <span className="text-[10px] text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full">
              Dia 1 • Início
            </span>
          </div>

          <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-white/5">
            <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-high"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-primary transition-all duration-700 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="0, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-base font-extrabold text-on-surface leading-none">0</span>
                <span className="text-[10px] text-on-surface-variant">kcal</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 justify-between gap-1.5 min-w-0">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Meta diária
                </span>
                <span className="font-display font-semibold text-on-surface">
                  2.000 <span className="text-[10px] font-normal text-on-surface-variant">kcal</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  Restantes
                </span>
                <span className="font-display font-semibold text-secondary">
                  2.000 <span className="text-[10px] font-normal text-on-surface-variant">kcal</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  Gasto treino
                </span>
                <span className="font-semibold text-tertiary">
                  0 <span className="text-[10px] font-normal text-on-surface-variant">kcal</span>
                </span>
              </div>
            </div>
          </div>

          {/* Macronutrientes (0%) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Proteína
                </span>
                <span className="text-on-surface-variant">
                  <strong className="text-on-surface">0g</strong> / 160g{" "}
                  <span className="text-primary font-bold">(0%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500 w-[0%]" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
                  Carboidrato
                </span>
                <span className="text-on-surface-variant">
                  <strong className="text-on-surface">0g</strong> / 200g{" "}
                  <span className="text-secondary-fixed font-bold">(0%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full rounded-full bg-secondary-fixed transition-all duration-500 w-[0%]" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" />
                  Gorduras
                </span>
                <span className="text-on-surface-variant">
                  <strong className="text-on-surface">0g</strong> / 55g{" "}
                  <span className="text-secondary-fixed-dim font-bold">(0%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full rounded-full bg-secondary-fixed-dim transition-all duration-500 w-[0%]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl text-xs border border-white/5">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <p className="text-[11px] text-on-surface-variant">
              Inicie o registro das suas refeições para calibrar a taxa de queima basal.
            </p>
          </div>
        </section>

        {/* 4. Monitor de Hidratação Inteligente (0 ml) */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">water_drop</span>
              <h3 className="font-display text-sm font-bold text-on-surface">Hidratação do Dia</h3>
            </div>
            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              {waterPercent}%
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-display text-3xl font-extrabold text-on-surface tracking-tight">
                {waterCurrent.toLocaleString("pt-BR")}
              </span>
              <span className="text-xs text-on-surface-variant ml-1.5">/ {waterTarget.toLocaleString("pt-BR")} ml</span>
            </div>
            <span className="text-xs text-secondary font-semibold">
              Meta: {(waterTarget / 1000).toFixed(1)} litros (40ml/kg)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-variant active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">local_drink</span>
              <span>+250 ml</span>
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high border border-white/5 text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-variant active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">water_full</span>
              <span>+500 ml</span>
            </button>
            <button
              onClick={resetWater}
              aria-label="Zerar hidratação"
              className="w-10 h-8 rounded-xl bg-surface-container-high border border-white/5 text-on-surface flex items-center justify-center hover:bg-surface-variant active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">restart_alt</span>
            </button>
          </div>
        </section>

        {/* 5. Checklist de Suplementação Diária (Estilo Cariani) */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
              <h3 className="font-display text-sm font-bold text-on-surface">Suplementação de Alta Performance</h3>
            </div>
            <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase">
              Checklist
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Creatina */}
            <div
              onClick={() =>
                setSupplementsTaken((prev) => ({ ...prev, creatine: !prev.creatine }))
              }
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                supplementsTaken.creatine
                  ? "bg-surface-container-high/80 border-primary/30"
                  : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    supplementsTaken.creatine ? "bg-primary text-on-primary" : "bg-surface-container border border-white/10"
                  }`}
                >
                  {supplementsTaken.creatine && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold ${
                      supplementsTaken.creatine ? "line-through text-on-surface-variant" : "text-on-surface"
                    }`}
                  >
                    Creatina Monoidratada ({creatineDose}g)
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Todos os dias no mesmo horário</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-primary font-mono">{creatineDose}g</span>
            </div>

            {/* Whey Protein */}
            <div
              onClick={() =>
                setSupplementsTaken((prev) => ({ ...prev, whey: !prev.whey }))
              }
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                supplementsTaken.whey
                  ? "bg-surface-container-high/80 border-secondary/30"
                  : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    supplementsTaken.whey ? "bg-secondary text-on-secondary" : "bg-surface-container border border-white/10"
                  }`}
                >
                  {supplementsTaken.whey && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold ${
                      supplementsTaken.whey ? "line-through text-on-surface-variant" : "text-on-surface"
                    }`}
                  >
                    Whey Protein Isolado / Concentrado (30g)
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Pós-treino ou lanche proteico</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-secondary font-mono">24g P</span>
            </div>

            {/* Multivitamínico + Ômega 3 */}
            <div
              onClick={() =>
                setSupplementsTaken((prev) => ({ ...prev, multivitamin: !prev.multivitamin }))
              }
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                supplementsTaken.multivitamin
                  ? "bg-surface-container-high/80 border-tertiary/30"
                  : "bg-surface-container-low border-white/5 hover:bg-surface-container-high"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    supplementsTaken.multivitamin ? "bg-tertiary text-on-tertiary" : "bg-surface-container border border-white/10"
                  }`}
                >
                  {supplementsTaken.multivitamin && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold ${
                      supplementsTaken.multivitamin ? "line-through text-on-surface-variant" : "text-on-surface"
                    }`}
                  >
                    Multivitamínico + Ômega 3
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Junto com o almoço (lipossolúveis)</span>
                </div>
              </div>
              <span className="text-[10px] text-tertiary font-bold">1 dose</span>
            </div>
          </div>
        </section>

        {/* 5. Próxima Refeição Programada */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span>
              <h3 className="font-display text-sm font-bold text-on-surface">Próxima Refeição</h3>
            </div>
            <div className="flex items-center gap-1 text-secondary text-[10px] bg-secondary-container/20 px-2 py-0.5 rounded-full font-bold">
              <span>08:00</span>
              <span>• CAFÉ DA MANHÃ</span>
            </div>
          </div>

          <div className="flex gap-3 bg-surface-container-low p-3 rounded-xl border border-white/5">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-secondary">lunch_dining</span>
            </div>
            <div className="flex flex-col justify-between min-w-0 flex-1">
              <div>
                <h4 className="text-xs text-on-surface font-semibold truncate">Ovos Mexidos com Fruta</h4>
                <p className="text-[11px] text-on-surface-variant line-clamp-1">Refeição 1 de 4 • Desjejum equilibrado</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[11px] text-on-surface-variant">
                <span className="bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface font-semibold">
                  380 kcal
                </span>
                <span className="text-primary font-bold">25g P</span>
                <span className="text-secondary font-bold">35g C</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMealLogged(!mealLogged)}
              className={`flex-1 min-h-[40px] rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                mealLogged
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high border border-white/5 text-on-surface hover:bg-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {mealLogged ? "check_circle" : "done"}
              </span>
              <span>{mealLogged ? "Refeição Registrada!" : "Registrar Refeição"}</span>
            </button>
            <Link
              href="/alimentacao"
              className="min-h-[40px] px-3.5 rounded-xl bg-surface-container-high border border-white/5 text-secondary text-xs font-semibold flex items-center justify-center gap-1 hover:bg-surface-variant active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">magic_button</span>
              <span>Ver Dieta</span>
            </Link>
          </div>
        </section>

        {/* 6. Atalhos Rápidos */}
        <section className="flex flex-col gap-2">
          <h3 className="font-display text-sm font-bold text-on-surface px-1">Atalhos de Alta Performance</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/treino/substituicao"
              className="flex flex-col p-3 rounded-2xl bg-surface-container border border-white/5 text-left gap-2 hover:bg-surface-container-high active:scale-95 transition-all shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">Substituição IA</span>
                <span className="text-[11px] text-on-surface-variant line-clamp-1">Biomecânica &amp; Aparelhos</span>
              </div>
            </Link>

            <button
              onClick={() => setShowWeightModal(true)}
              className="flex flex-col p-3 rounded-2xl bg-surface-container border border-white/5 text-left gap-2 hover:bg-surface-container-high active:scale-95 transition-all shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">scale</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">
                  {currentWeight ? `${currentWeight.toFixed(1)} kg` : "Registrar Peso"}
                </span>
                <span className="text-[11px] text-on-surface-variant line-clamp-1">
                  {currentWeight ? "Peso inicial registrado" : "Toque para registrar"}
                </span>
              </div>
            </button>

            <Link
              href="/evolucao/1rm"
              className="flex flex-col p-3 rounded-2xl bg-surface-container border border-white/5 text-left gap-2 hover:bg-surface-container-high active:scale-95 transition-all shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[20px]">speed</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">1RM Analítico</span>
                <span className="text-[11px] text-on-surface-variant line-clamp-1">Progressão de Cargas</span>
              </div>
            </Link>

            <Link
              href="/equipamentos"
              className="flex flex-col p-3 rounded-2xl bg-surface-container border border-white/5 text-left gap-2 hover:bg-surface-container-high active:scale-95 transition-all shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">Aparelhos Salvos</span>
                <span className="text-[11px] text-on-surface-variant line-clamp-1">Configurar Academia</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Modal de Registro Rápido */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-surface-container p-5 border border-white/10 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-on-surface">Registrar Peso Inicial</h3>
              <button
                onClick={() => setShowWeightModal(false)}
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
                onClick={() => setShowWeightModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveInitialWeight}
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
