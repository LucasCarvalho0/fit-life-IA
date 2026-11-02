"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FitLifeLogo } from "@/components/brand/logo";

export default function LoginPage() {
  const router = useRouter();

  // Mode: "login" or "register"
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form fields — Register
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

  // Verificar se o usuário já possui sessão ativa ao abrir o app
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Usuário já está logado! Direciona para onde ele parou
          const hasOnboarding = session.user.user_metadata?.onboarding_completed;
          router.replace(hasOnboarding ? "/dashboard" : "/onboarding");
          return;
        }

        // Recuperar último e-mail lembrado
        const savedEmail = localStorage.getItem("fitlife_saved_email");
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch {
        // Ignora erros de checagem
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

  // Format phone mask: (11) 99999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setPhone(v);
  };

  // Google OAuth
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

  // Email/Password submit
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

        // Salvar e-mail localmente para lembrar
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

        // Lembrar e-mail
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

        {/* Branding com Logo Oficial FitLife AI */}
        <div className="relative w-full flex flex-col items-center pb-6 text-center">
          <div className="absolute -top-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <FitLifeLogo size="lg" className="mb-2" />
          <p className="text-xs text-on-surface-variant max-w-xs mt-1">
            Treino, Nutrição &amp; Biomecânica Adaptativa de Alta Performance
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="w-full bg-surface-container-high p-1 rounded-2xl border border-white/5 flex items-center mb-4">
          <button
            type="button"
            onClick={() => { setMode("login"); resetMessages(); }}
            className={`flex-1 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
              mode === "login"
                ? "bg-surface-container text-on-surface shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Entrar na Conta
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); resetMessages(); }}
            className={`flex-1 py-2.5 rounded-xl font-display text-xs font-bold transition-all ${
              mode === "register"
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Criar Nova Conta
          </button>
        </div>

        {/* Card */}
        <div className="w-full bg-surface-container-low rounded-3xl p-5 border border-white/5 shadow-2xl flex flex-col gap-4">

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-error/15 border border-error/30 text-error text-xs">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <p className="leading-tight">{errorMessage}</p>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-positive/15 border border-positive/30 text-positive text-xs">
              <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
              <p className="leading-tight">{successMessage}</p>
            </div>
          )}

          {/* Google SSO */}
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
            <span>{mode === "login" ? "Continuar com Google" : "Cadastrar com Google"}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-0.5">
            <div className="w-full h-px bg-white/5" />
            <span className="absolute px-3 bg-surface-container-low text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              ou com e-mail
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* Nome + Sobrenome (Apenas Cadastro) */}
            {mode === "register" && (
              <div className="flex gap-2 animate-in fade-in duration-200">
                {/* Nome */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="firstName">Nome</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">person</span>
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder="João"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-surface-container-highest text-on-surface text-xs pl-10 pr-3 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                {/* Sobrenome */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="lastName">Sobrenome</label>
                  <div className="relative flex items-center">
                    <input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Silva"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-surface-container-highest text-on-surface text-xs px-3 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Telefone (Apenas Cadastro) */}
            {mode === "register" && (
              <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="phone">Telefone / WhatsApp</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">phone</span>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-surface-container-highest text-on-surface text-xs pl-11 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="email">E-mail</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">alternate_email</span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-xs pl-11 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="password">
                  Senha {mode === "register" && <span className="font-normal">(mín. 6 dígitos)</span>}
                </label>
                {mode === "login" && (
                  <a href="#" className="text-[11px] text-primary hover:underline">Esqueceu a senha?</a>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">lock</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-highest text-on-surface text-xs pl-11 pr-11 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
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

            {/* Confirmar Senha (Apenas Cadastro) */}
            {mode === "register" && (
              <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="confirmPassword">
                  Confirmar Senha
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px] pointer-events-none">verified</span>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="Repita a senha criada"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-surface-container-highest text-on-surface text-xs pl-11 pr-11 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary transition-colors"
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
                {/* Password match indicator */}
                {confirmPassword.length > 0 && (
                  <p className={`text-[11px] mt-0.5 flex items-center gap-1 ${
                    password === confirmPassword ? "text-positive" : "text-error"
                  }`}>
                    <span className="material-symbols-outlined text-[13px]">
                      {password === confirmPassword ? "check_circle" : "cancel"}
                    </span>
                    {password === confirmPassword ? "Senhas conferem" : "Senhas não coincidem"}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] transition-all py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-display text-sm font-bold shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">
                {loading ? "hourglass_empty" : mode === "login" ? "login" : "person_add"}
              </span>
              <span>
                {loading ? "Processando..." : mode === "login" ? "Entrar no Fit Life IA" : "Criar Conta & Iniciar"}
              </span>
            </button>
          </form>

          {/* Toggle link */}
          <div className="pt-1 text-center text-xs text-on-surface-variant">
            {mode === "login" ? (
              <p>
                Não tem uma conta?{" "}
                <button type="button" onClick={() => { setMode("register"); resetMessages(); }} className="text-primary font-bold hover:underline">
                  Cadastre-se aqui
                </button>
              </p>
            ) : (
              <p>
                Já possui uma conta?{" "}
                <button type="button" onClick={() => { setMode("login"); resetMessages(); }} className="text-primary font-bold hover:underline">
                  Faça login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-col items-center gap-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-semibold border border-white/5">
            <span className="material-symbols-outlined text-[13px] text-tertiary">verified_user</span>
            <span>Supabase Auth • E-mail &amp; Google SSO</span>
          </div>
        </div>
      </main>
    </div>
  );
}
