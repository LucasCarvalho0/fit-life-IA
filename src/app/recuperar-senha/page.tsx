"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: false, // não cria conta nova, só recupera
        },
      });

      if (otpError) {
        // Supabase retorna erro genérico por segurança — mas se o e-mail não existir
        // ele ainda diz "ok" para não revelar quais e-mails estão cadastrados
        setError("Não foi possível enviar o código. Verifique o e-mail e tente novamente.");
        setLoading(false);
        return;
      }

      // Salva o e-mail no sessionStorage para usar na tela de verificação
      sessionStorage.setItem("fitlife_recovery_email", email.trim().toLowerCase());
      router.push("/recuperar-senha/verificar");
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-surface text-on-surface">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-6">
        <Link
          href="/login"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container border border-white/5 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-on-surface font-display">Recuperar senha</h1>
          <p className="text-[11px] text-on-surface-variant">Acesso à sua conta</p>
        </div>
      </div>

      <div className="flex-1 px-5 pb-10">
        {/* Ícone */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[40px]">lock_reset</span>
          </div>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-on-surface font-display mb-2">
            Digite seu e-mail
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
            Vamos enviar um código de <span className="text-primary font-bold">6 dígitos</span> para
            o e-mail cadastrado na sua conta. É rápido e seguro.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface" htmlFor="email">
              E-mail da conta
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                alternate_email
              </span>
              <input
                id="email"
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="w-full bg-surface-container-highest text-on-surface text-sm pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-error/10 border border-error/20">
              <span className="material-symbols-outlined text-error text-[16px] mt-0.5 shrink-0">error</span>
              <p className="text-xs text-error leading-relaxed">{error}</p>
            </div>
          )}

          {/* Botão enviar */}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full min-h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-display text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                Enviando código...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                Enviar código
              </>
            )}
          </button>
        </form>

        {/* Info box */}
        <div className="mt-6 p-4 rounded-2xl bg-surface-container border border-white/5">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
            <div>
              <p className="text-xs font-bold text-on-surface mb-1">Como funciona?</p>
              <ol className="text-[11px] text-on-surface-variant space-y-1 list-decimal list-inside">
                <li>Você digita o e-mail cadastrado</li>
                <li>Recebe um código de 6 dígitos no e-mail</li>
                <li>Digita o código aqui para entrar</li>
                <li>Vai em Configurações → Alterar senha</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Link voltar */}
        <div className="text-center mt-6">
          <Link href="/login" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
            Lembrou a senha?{" "}
            <span className="text-primary font-bold">Entrar agora</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

