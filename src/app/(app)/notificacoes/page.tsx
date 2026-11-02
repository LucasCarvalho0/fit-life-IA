"use client";

import { useState } from "react";
import Link from "next/link";

export default function NotificacoesPage() {
  // Sensitivity state
  const [sensitivity, setSensitivity] = useState<"balanced" | "focus" | "essential">("balanced");

  // Toggle states
  const [masterAI, setMasterAI] = useState(true);
  const [preWorkout, setPreWorkout] = useState(true);
  const [gymDensity, setGymDensity] = useState(true);
  const [restHaptics, setRestHaptics] = useState(true);
  const [plateauAlert, setPlateauAlert] = useState(true);

  const [smartWater, setSmartWater] = useState(true);
  const [postWorkoutThirst, setPostWorkoutThirst] = useState(true);

  const [anabolicWindow, setAnabolicWindow] = useState(true);
  const [delayedMeal, setDelayedMeal] = useState(true);
  const [macroClosing, setMacroClosing] = useState(true);

  const [sleepSilence, setSleepSilence] = useState(true);
  const [highPriorityException, setHighPriorityException] = useState(true);

  const [pushDevice, setPushDevice] = useState(true);
  const [watchHaptics, setWatchHaptics] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTestNotification = () => {
    setToastMessage("Notificação de teste enviada: 'Hora do Pré-Treino: 30g Carboidratos + Cafeína'");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = () => {
    setToastMessage("Preferências salvas com sucesso no motor de IA!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface text-on-surface antialiased pb-24">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </Link>
          <h1 className="font-display text-sm font-bold text-on-surface tracking-tight truncate flex-1 text-center">
            Academia &amp; Equipamentos
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">check</span>
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
        {/* AI Diagnostic Status Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-container-high p-4 border border-white/5 shadow-md flex flex-col gap-2">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Motor Proativo FitLife v3.2 • IA Preditiva Ativa
            </span>
          </div>
          <h2 className="font-display text-lg font-bold text-on-surface tracking-tight">
            Notificações &amp; Lembretes
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Lembretes sincronizados em tempo real com sua rotina, horários de pico da academia e janela metabólica.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
            <div className="flex items-center gap-1 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[16px]">bolt</span>
              <span>Latência de Telemetria: &lt; 140ms</span>
            </div>
            <span className="text-primary font-bold">Sincronizado</span>
          </div>
        </section>

        {/* Master Proactive Engine Card */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-sm flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface">Alertas Contextuais por IA</span>
                <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                  Ajusta disparos se você atrasar uma refeição, se a academia lotar ou se o descanso exigir mais tempo.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={masterAI}
                onChange={(e) => setMasterAI(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Sensitivity Selector */}
          <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Nível de Sensibilidade da IA
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "balanced", label: "Equilibrado" },
                { id: "focus", label: "Foco Total" },
                { id: "essential", label: "Essencial" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setSensitivity(pill.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    sensitivity === pill.id
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 1. Treino & Pré-Treino */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">fitness_center</span>
              <h3 className="text-xs font-bold text-on-surface">Treino &amp; Pré-Treino</h3>
            </div>
            <span className="text-[10px] text-on-surface-variant font-mono">4 ativos</span>
          </div>

          {/* Dynamic Pre-Workout */}
          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Alerta Pré-Treino Dinâmico</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Notificar 45 min antes do treino planejado (17:45) com sugestão de lanche e checagem de cafeína.
              </p>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-mono font-bold">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                <span>17:00 disparo estimado</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={preWorkout}
                onChange={(e) => setPreWorkout(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Gym Density */}
          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-on-surface">Lotação da Academia</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary-fixed text-[9px] font-bold">
                  Smart Fit Consolação
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Avisar às 17:30 se passar de 75% da capacidade, sugerindo antecipar ou reorganizar a ordem dos aparelhos.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={gymDensity}
                onChange={(e) => setGymDensity(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Rest Timer Haptics */}
          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Descanso entre Séries (Haptics)</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Vibração tátil no Apple Watch / celular 5 segundos antes de zerar o timer de 90s.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={restHaptics}
                onChange={(e) => setRestHaptics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Plateau alert */}
          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Platô &amp; Sugestão de Carga</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Aviso no Treino B quando o 1RM estimado sinalizar prontidão para 72.5 kg na Puxada Alta.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={plateauAlert}
                onChange={(e) => setPlateauAlert(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </section>

        {/* 2. Hidratação & Janela Metabólica */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">water_drop</span>
              <h3 className="text-xs font-bold text-on-surface">Hidratação &amp; Janela Metabólica</h3>
            </div>
            <span className="text-[10px] text-primary font-bold">60% Concluído</span>
          </div>

          {/* Progresso de Hoje */}
          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface">
              <span>Progresso de Hoje</span>
              <span className="font-mono text-primary">2.100 / 3.500 ml</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
              <span>Último gole: 14:15 (350ml)</span>
              <span>Faltam 1.400 ml</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Lembretes Inteligentes de Água</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                A cada 60 min (ajusta automaticamente após treinos intensos ou dias de calor elevado).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={smartWater}
                onChange={(e) => setSmartWater(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Modo Sede Pós-Treino</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Meta expressa de 500 ml disparada logo após finalizar a sessão ativa.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={postWorkoutThirst}
                onChange={(e) => setPostWorkoutThirst(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </section>

        {/* 3. Nutrição & Refeições */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">restaurant</span>
              <h3 className="text-xs font-bold text-on-surface">Nutrição &amp; Refeições</h3>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Janela Anabólica Pós-Treino</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Lembrete prioritário para consumir 35g de proteína até 60 min após o treino.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={anabolicWindow}
                onChange={(e) => setAnabolicWindow(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Registro de Refeições Atrasadas</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Aviso suave caso uma das 4 refeições planejadas não seja registrada em até 2h do previsto.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={delayedMeal}
                onChange={(e) => setDelayedMeal(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">Fechamento de Macros Diários</span>
                <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                  21:30
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Balanço de saldo calórico restante antes da ceia ou jejum noturno.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={macroClosing}
                onChange={(e) => setMacroClosing(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </section>

        {/* 4. Modo Sono & Descanso */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">bedtime</span>
              <h3 className="text-xs font-bold text-on-surface">Modo Sono &amp; Descanso</h3>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Silenciar Durante Sono &amp; Foco</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Janela programada das 23:00 às 06:30 (sincronizada com o perfil circadiano).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={sleepSilence}
                onChange={(e) => setSleepSilence(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-on-surface">Exceção de Alta Prioridade</span>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                Permitir apenas avisos de hidratação crítica em caso de déficit severo.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={highPriorityException}
                onChange={(e) => setHighPriorityException(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </section>

        {/* 5. Canais Ativos */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">devices</span>
              <h3 className="text-xs font-bold text-on-surface">Canais Ativos</h3>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-primary text-[20px]">phone_iphone</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Push no Dispositivo</span>
                <span className="text-[10px] text-on-surface-variant">Alertas sonoros e na tela de bloqueio</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={pushDevice}
                onChange={(e) => setPushDevice(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-primary text-[20px]">watch</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Apple Watch / Garmin Haptics</span>
                <span className="text-[10px] text-on-surface-variant">Pulsos de pulso e micro-telas</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={watchHaptics}
                onChange={(e) => setWatchHaptics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container border border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Resumo Semanal (WhatsApp / E-mail)</span>
                <span className="text-[10px] text-on-surface-variant">Balanço consolidado aos domingos às 20h</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={weeklySummary}
                onChange={(e) => setWeeklySummary(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Salvar Preferências de Notificação</span>
          </button>

          <button
            type="button"
            onClick={handleTestNotification}
            className="w-full py-3 rounded-xl bg-surface-container-high border border-white/10 text-on-surface text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">send</span>
            <span>Testar Envio de Notificação Push Interativa</span>
          </button>

          <p className="text-[10px] text-center text-on-surface-variant flex items-center justify-center gap-1 opacity-70">
            <span className="material-symbols-outlined text-[12px]">security</span>
            <span>O processamento da IA é executado localmente no dispositivo para preservar sua privacidade e bateria.</span>
          </p>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-full font-bold text-xs shadow-xl animate-in slide-in-from-bottom duration-200 text-center max-w-xs">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
