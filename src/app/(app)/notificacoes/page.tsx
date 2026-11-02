"use client";

import { useState } from "react";
import Link from "next/link";

interface ReminderSetting {
  id: string;
  title: string;
  description: string;
  time: string;
  enabled: boolean;
  icon: string;
}

const INITIAL_REMINDERS: ReminderSetting[] = [
  {
    id: "r1",
    title: "Hidratação Diária",
    description: "Lembretes dinâmicos para beber água ao longo do dia",
    time: "A cada 90 min",
    enabled: true,
    icon: "water_drop",
  },
  {
    id: "r2",
    title: "Horário do Treino & Pré-Treino",
    description: "Aviso 45 minutos antes da sessão para consumir energia",
    time: "17:45",
    enabled: true,
    icon: "fitness_center",
  },
  {
    id: "r3",
    title: "Pesagem em Jejum",
    description: "Notificação logo ao acordar para registrar o peso consistente",
    time: "07:15",
    enabled: true,
    icon: "scale",
  },
  {
    id: "r4",
    title: "Janela de Sono (Higiene Circadiana)",
    description: "Aviso para desligar telas e diminuir as luzes do ambiente",
    time: "22:15",
    enabled: false,
    icon: "bedtime",
  },
];

export default function NotificacoesPage() {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Rotina &amp; Hábitos
              </span>
              <h1 className="font-display text-base font-bold text-on-surface">Lembretes &amp; Alertas</h1>
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Ativos
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-4">
        <section className="flex flex-col gap-2">
          {reminders.map((r) => (
            <div
              key={r.id}
              onClick={() => toggleReminder(r.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-98 ${
                r.enabled
                  ? "bg-surface-container border-white/5 shadow-sm"
                  : "bg-surface-container-low/50 border-white/5 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    r.enabled ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{r.icon}</span>
                </div>
                <div className="flex flex-col min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-on-surface truncate">{r.title}</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1">{r.description}</p>
                  <span className="text-[10px] text-secondary font-mono font-semibold mt-0.5">{r.time}</span>
                </div>
              </div>

              {/* Toggle switch visual */}
              <div
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  r.enabled ? "bg-primary" : "bg-surface-container-highest"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-surface transition-transform shadow-md ${
                    r.enabled ? "translate-x-5" : "translate-x-0"
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

