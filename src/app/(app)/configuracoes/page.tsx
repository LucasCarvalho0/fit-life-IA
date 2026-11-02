"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState("Atleta FitLife");
  const [userEmail, setUserEmail] = useState("carregando...");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Conectado ao Supabase");

  // Carregar dados reais do usuário logado
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUserEmail(user.email ?? "atleta@fitlife.ai");

          const meta = user.user_metadata ?? {};
          const name = meta.full_name || meta.first_name || (user.email ? user.email.split("@")[0] : "Atleta FitLife");
          setUserName(name);

          // Verificar avatar no localStorage ou Supabase/Google
          const localAvatar = localStorage.getItem("fitlife_avatar");
          const remoteAvatar = meta.avatar_url || meta.picture || null;
          setAvatarUrl(localAvatar || remoteAvatar);
        }
      } catch {
        // Fallback
      }
    };

    loadUserData();
  }, []);

  // Upload e troca da foto de perfil
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecione um arquivo de imagem válido (JPG, PNG ou WEBP).");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        // Redimensionar e comprimir imagem com canvas
        const img = new Image();
        img.src = dataUrl;
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const maxDim = 320;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);

          // Salvar local e no Supabase
          setAvatarUrl(compressed);
          localStorage.setItem("fitlife_avatar", compressed);

          try {
            const supabase = createClient();
            await supabase.auth.updateUser({
              data: { avatar_url: compressed },
            });
            setSyncStatus("Foto atualizada em nuvem!");
          } catch {
            setSyncStatus("Foto salva localmente");
          } finally {
            setUploading(false);
          }
        };
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignora erro
    }
    router.push("/login");
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">manage_accounts</span>
            <h1 className="font-display text-lg font-bold text-on-surface">Perfil &amp; Ajustes</h1>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
            Novo Atleta
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-8 flex flex-col gap-5">
        {/* Hidden File Input for Avatar Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* User Card com Foto Clicável */}
        <section className="rounded-2xl bg-surface-container p-4 border border-white/5 shadow-xl flex items-center gap-4">
          {/* Avatar com Botão de Upload */}
          <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 border border-white/10 relative">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[36px]">person</span>
              )}

              {/* Overlay com Ícone de Câmera */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
              </div>
            </div>

            {/* Badge de Ação Rápida */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md border-2 border-surface">
              <span className="material-symbols-outlined text-[12px]">
                {uploading ? "hourglass_empty" : "edit"}
              </span>
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-base font-bold text-on-surface truncate">{userName}</h2>
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
            </div>
            <span className="text-xs text-on-surface-variant truncate">{userEmail}</span>

            <button
              type="button"
              onClick={handleAvatarClick}
              className="text-[11px] text-primary hover:underline font-semibold mt-1 self-start flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">add_a_photo</span>
              <span>{avatarUrl ? "Trocar foto de perfil" : "Adicionar foto de perfil"}</span>
            </button>
          </div>
        </section>

        {/* Módulos do Sistema */}
        <section className="flex flex-col gap-2">
          <h3 className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
            Configurações Principais
          </h3>

          <div className="flex flex-col gap-2">
            {/* Academia & Equipamentos */}
            <Link
              href="/equipamentos"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-white/5 hover:bg-surface-container-high transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Academia &amp; Aparelhos Salvos</span>
                  <span className="text-[11px] text-on-surface-variant">Gerenciar aparelhos da sua academia</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
            </Link>

            {/* Metas Físicas & Fórmulas */}
            <Link
              href="/metas"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-white/5 hover:bg-surface-container-high transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Metas Físicas &amp; Calorias</span>
                  <span className="text-[11px] text-on-surface-variant">Calibrar BMR, TDEE e déficit</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
            </Link>

            {/* Rotina de Sono */}
            <Link
              href="/sono"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-white/5 hover:bg-surface-container-high transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed/10 text-secondary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">bedtime</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Sono &amp; Recuperação Biológica</span>
                  <span className="text-[11px] text-on-surface-variant">Higiene circadiana e horários ideais</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
            </Link>

            {/* Notificações & Lembretes */}
            <Link
              href="/notificacoes"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-white/5 hover:bg-surface-container-high transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Lembretes &amp; Alertas</span>
                  <span className="text-[11px] text-on-surface-variant">Água, Horário de Treino &amp; Refeições</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
            </Link>

            {/* Refazer Questionário */}
            <Link
              href="/onboarding"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-white/5 hover:bg-surface-container-high transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Refazer Questionário Inteligente</span>
                  <span className="text-[11px] text-on-surface-variant">Recalibrar todo o seu plano do zero</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
            </Link>
          </div>
        </section>

        {/* Conta & Sessão */}
        <section className="flex flex-col gap-2">
          <h3 className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
            Segurança &amp; Conta
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Sincronização em Nuvem</span>
                  <span className="text-[11px] text-primary">{syncStatus}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full p-3.5 rounded-2xl bg-surface-container border border-error/20 text-error hover:bg-error/10 transition-colors flex items-center justify-center gap-2 text-xs font-bold active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
