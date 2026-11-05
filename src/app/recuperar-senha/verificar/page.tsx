"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function VerificarCodigoPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Recupera e-mail do sessionStorage
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("fitlife_recovery_email");
    if (!savedEmail) {
      router.replace("/recuperar-senha");
      return;
    }
    setEmail(savedEmail);
  }, [router]);

  // Contador regressivo para reenvio
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Foca no primeiro input ao montar
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleDigit(index: number, value: string) {
    // Aceita só dígito
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");

    // Avança para o próximo campo automaticamente
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Se todos os 6 dígitos foram preenchidos, verifica automaticamente
    if (newCode.every((d) => d !== "") && digit) {
      verifyCode(newCode.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      verifyCode(pasted);
    }
  }

  async function verifyCode(token: string) {
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (verifyError) {
        setError("Código inválido ou expirado. Verifique e tente novamente.");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setLoading(false);
        return;
      }

      // Código correto — limpa o e-mail salvo e redireciona
      sessionStorage.removeItem("fitlife_recovery_email");
      // Redireciona para configurações para trocar a senha
      router.replace("/configuracoes?tab=senha&origem=recuperacao");
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  async function handleResend() {
    if (countdown > 0 || !email) return;
    setResending(true);
    setError("");

    try {
      const supabase = createClient();
      await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      setCountdown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setResending(false);
    }
  }

  const codeValue = code.join("");

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-surface text-on-surface">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-6">
        <Link
          href="/recuperar-senha"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container border border-white/5 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-on-surface font-display">Verificar código</h1>
          <p className="text-[11px] text-on-surface-variant">Recuperação de acesso</p>
        </div>
      </div>

      <div className="flex-1 px-5 pb-10">
        {/* Ícone */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[40px]">mark_email_read</span>
          </div>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-on-surface font-display mb-2">
            Código enviado!
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Enviamos um código de{" "}
            <span className="text-primary font-bold">6 dígitos</span> para:
          </p>
          <p className="text-sm font-bold text-on-surface mt-1 break-all">{email}</p>
        </div>

        {/* Inputs do código OTP */}
        <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all
                ${digit
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-surface-container-highest border-white/5 text-on-surface"
                }
                focus:outline-none focus:border-primary focus:bg-primary/10
                disabled:opacity-50`}
            />
          ))}
        </div>

        {/* Erro */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-error/10 border border-error/20 mb-4">
            <span className="material-symbols-outlined text-error text-[16px] mt-0.5 shrink-0">error</span>
            <p className="text-xs text-error leading-relaxed">{error}</p>
          </div>
        )}

        {/* Botão verificar (manual caso não preencheu automaticamente) */}
        {codeValue.length === 6 && !loading && (
          <button
            type="button"
            onClick={() => verifyCode(codeValue)}
            className="w-full min-h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-display text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mb-4"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Verificar código
          </button>
        )}

        {loading && (
          <div className="w-full min-h-12 flex items-center justify-center gap-2 rounded-xl bg-primary/20 border border-primary/30 mb-4">
            <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm font-bold text-primary">Verificando...</span>
          </div>
        )}

        {/* Reenviar */}
        <div className="text-center mt-2">
          <p className="text-xs text-on-surface-variant mb-2">Não recebeu o código?</p>
          {countdown > 0 ? (
            <p className="text-xs text-on-surface-variant">
              Reenviar em{" "}
              <span className="text-primary font-bold">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-xs text-primary font-bold hover:underline disabled:opacity-50 transition-colors"
            >
              {resending ? "Enviando..." : "Reenviar código"}
            </button>
          )}
        </div>

        {/* Dica */}
        <div className="mt-6 p-4 rounded-2xl bg-surface-container border border-white/5">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0 mt-0.5">tips_and_updates</span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Verifique também a caixa de <strong className="text-on-surface">spam ou lixo eletrônico</strong>. 
              O código expira em <strong className="text-on-surface">10 minutos</strong>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

