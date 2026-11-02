"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  // Mode: "login" or "register"
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Verificar se já possui sessão ativa ao abrir
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const hasOnboarding = session.user.user_metadata?.onboarding_completed;
          router.replace(hasOnboarding ? "/dashboard" : "/onboarding");
          return;
        }

        const savedEmail = localStorage.getItem("fitlife_saved_email");
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch {
        // fallback
      } finally {
        setCheckingSession(false);
      }
    };

    checkActiveSession();
  }, [router]);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setPhone(v);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    resetMessages();
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao autenticar com Google.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "register") {
        if (password.length < 6) throw new Error("A senha deve ter no mínimo 6 caracteres.");
        if (password !== confirmPassword) throw new Error("As senhas digitadas não coincidem.");

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`.trim(),
              phone,
            },
          },
        });

        if (error) throw error;

        localStorage.setItem("fitlife_saved_email", email);

        if (data?.user && !data.session) {
          setSuccessMessage("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
          setLoading(false);
          return;
        }

        setSuccessMessage("Conta criada com sucesso! Redirecionando para o questionário...");
        setTimeout(() => router.push("/onboarding"), 900);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        localStorage.setItem("fitlife_saved_email", email);
        setSuccessMessage("Login realizado! Entrando...");

        const hasOnboarding = data.user?.user_metadata?.onboarding_completed;
        setTimeout(() => {
          router.push(hasOnboarding ? "/dashboard" : "/onboarding");
        }, 700);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Falha na autenticação.");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-surface text-on-surface items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-primary text-[28px]">fitness_center</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-surface text-on-surface">
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto w-full">

        {/* 1. Header Oficial (Design Stitch Fiel) */}
        <div className="relative w-full flex flex-col items-center pb-5 text-center">
          <div className="absolute -top-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Emblema com Ícone e Raio Verde */}
          <div className="relative flex items-center justify-center mb-3">
            <div className="w-18 h-18 rounded-3xl bg-surface-container-high border border-white/10 shadow-2xl flex items-center justify-center p-2.5 relative overflow-hidden group">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-surface-container-highest to-surface-container flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10">
                  <path
                    d="M18 36 C28 22, 42 18, 50 26 C58 18, 72 22, 82 36 C74 44, 64 48, 50 42 C36 48, 26 44, 18 36 Z"
                    fill="#6366f1"
                    opacity="0.85"
                  />
                  <path
                    d="M54 16 L34 50 L48 50 L44 84 L68 46 L52 46 Z"
                    fill="#4edea3"
                  />
                  <circle cx="50" cy="48" r="3.5" fill="#ffffff" />
                </svg>
              </div>
            </div>
            {/* Badge de Raio Verde na Base */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-surface-container-lowest text-primary rounded-full p-0.5 shadow-md border-2 border-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
            </div>
          </div>

          {/* Título Oficial */}
          <h1 className="font-display text-3xl font-extrabold text-on-surface tracking-tight flex items-center gap-1.5">
            FitLife <span className="text-primary font-display">AI</span>
          </h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Treino, Nutrição &amp; IA Adaptativa
          </p>

          {/* Pill Informativa */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-[10px] font-semibold text-on-surface border border-white/5 mt-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Motor Científico Offline-First • TMB &amp; TDEE Exatos</span>
          </div>
        </div>

        {/* 2. Container do Formulário */}
        <div className="w-full bg-surface-container-low rounded-3xl p-5 border border-white/5 shadow-2xl flex flex-col gap-4">

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-error/15 border border-error/30 text-error text-xs">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <p className="leading-tight">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-positive/15 border border-positive/30 text-positive text-xs">
              <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
              <p className="leading-tight">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Campos exclusivos do modo Cadastro */}
            {mode === "register" && (
              <>
                <div className="flex gap-2 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-semibold text-on-surface-variant" htmlFor="firstName">Nome</label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder="João"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-surface-container-highest text-on-surface text-xs px-3.5 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-semibold text-on-surface-variant" htmlFor="lastName">Sobrenome</label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Silva"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-surface-container-highest text-on-surface text-xs px-3.5 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="phone">Telefone / WhatsApp</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-surface-container-highest text-on-surface text-xs px-3.5 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </>
            )}

            {/* Campo E-mail com Badge de Sincronização Ativa */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface" htmlFor="email">E-mail</label>
                <span className="text-[10px] text-primary font-bold">Sincronização Ativa</span>
              </div>
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
                  className="w-full bg-surface-container-highest text-on-surface text-xs pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Campo Senha com Esqueceu a Senha e Olhinho */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface" htmlFor="password">Senha</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => alert("Instruções de recuperação enviadas para o seu e-mail cadastrado.")}
                    className="text-[11px] text-primary font-bold hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-xs pl-10 pr-11 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 p-1.5 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirmar Senha no modo Cadastro */}
            {mode === "register" && (
              <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-semibold text-on-surface" htmlFor="confirmPassword">Confirmar Senha</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">verified</span>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="Repita a senha criada"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface-container-highest text-on-surface text-xs pl-10 pr-11 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2.5 p-1.5 text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirm ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Botão Principal Verde Esmeralda */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] transition-all py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-display text-sm font-bold shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">
                {loading ? "hourglass_empty" : "login"}
              </span>
              <span>
                {loading ? "Processando..." : mode === "login" ? "Entrar no FitLife" : "Criar Conta & Iniciar"}
              </span>
            </button>
          </form>

          {/* Divisor OU CONTINUE COM */}
          <div className="relative flex items-center justify-center my-1">
            <div className="w-full h-px bg-white/5" />
            <span className="absolute px-3 bg-surface-container-low text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              ou continue com
            </span>
          </div>

          {/* Botão Google Oficial */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-surface-container-high hover:bg-surface-container-highest active:scale-[0.98] transition-all py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 text-on-surface text-xs font-semibold border border-white/5 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Continuar com Google</span>
          </button>

          {/* Toggle de Modo */}
          <div className="pt-1 text-center text-xs text-on-surface-variant">
            {mode === "login" ? (
              <p>
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); resetMessages(); }}
                  className="text-primary font-bold hover:underline"
                >
                  Cadastre-se
                </button>
              </p>
            ) : (
              <p>
                Já possui uma conta?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); resetMessages(); }}
                  className="text-primary font-bold hover:underline"
                >
                  Faça login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* 3. Rodapé com Escudo de Segurança */}
        <div className="mt-5 flex flex-col items-center gap-1.5 text-center max-w-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-semibold border border-white/5">
            <span className="material-symbols-outlined text-[13px] text-tertiary">verified_user</span>
            <span>Ambiente Seguro • Privacidade Garantida</span>
          </div>
          <p className="text-[10px] text-on-surface-variant/70 leading-tight">
            Seus treinos, biometria e evolução protegidos com total privacidade.
          </p>
        </div>
      </main>
    </div>
  );
}
