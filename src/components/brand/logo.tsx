import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  iconOnly?: boolean;
  className?: string;
}

export function FitLifeLogo({ size = "md", iconOnly = false, className = "" }: LogoProps) {
  // Tamanhos do ícone
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  }[size];

  // Tamanhos da tipografia
  const textDimensions = {
    sm: "text-base tracking-tight",
    md: "text-xl tracking-tight",
    lg: "text-2xl tracking-tight",
    xl: "text-3xl tracking-tight",
  }[size];

  const subDimensions = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
    xl: "text-sm",
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Símbolo Fit Life IA — Fusão de Raio Elétrico, Asas Anatômicas e Força */}
      <div className={`relative ${iconDimensions} shrink-0`}>
        {/* Glow de fundo */}
        <div className="absolute inset-0 bg-primary/25 rounded-2xl blur-lg pointer-events-none transform scale-90 animate-pulse" />

        {/* Emblema em vidro escuro com borda metálica */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest border border-white/10 shadow-2xl flex items-center justify-center p-1.5 overflow-hidden group">
          {/* Brilho reflexivo sutil no canto superior */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-white/10 rounded-full blur-md pointer-events-none" />

          {/* SVG do Símbolo */}
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              {/* Gradiente Esmeralda de Alta Performance */}
              <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4edea3" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              {/* Gradiente Neon Secundário */}
              <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c0c1ff" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>

              {/* Sombra de profundidade interna */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4edea3" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Asas Dorsais / Trapézio Biomecânico Estilizado */}
            <path
              d="M18 36 C28 22, 42 18, 50 26 C58 18, 72 22, 82 36 C74 44, 64 48, 50 42 C36 48, 26 44, 18 36 Z"
              fill="url(#indigoGrad)"
              opacity="0.85"
            />

            {/* Raio Elétrico Central de Força & IA */}
            <path
              d="M54 16 L34 50 L48 50 L44 84 L68 46 L52 46 Z"
              fill="url(#emeraldGrad)"
              filter="url(#glow)"
            />

            {/* Núcleo de Pulso de Energia */}
            <circle cx="50" cy="48" r="3.5" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* Tipografia da Marca */}
      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <div className={`font-display font-black text-on-surface flex items-center leading-none ${textDimensions}`}>
            <span>FIT LIFE</span>
            <span className="text-primary font-display ml-1.5 relative">
              IA
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            </span>
          </div>
          <span className={`text-on-surface-variant font-medium tracking-wider uppercase mt-0.5 ${subDimensions}`}>
            Alta Performance &amp; Nutrição
          </span>
        </div>
      )}
    </div>
  );
}

