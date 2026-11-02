export type NavItem = {
  readonly href: string;
  readonly label: string;
  readonly icon: "home" | "dumbbell" | "utensils" | "chart" | "user";
};

/** Navegação inferior definida no Prompt Mestre, seção 14. */
export const BOTTOM_NAV: readonly NavItem[] = [
  { href: "/dashboard", label: "Início", icon: "home" },
  { href: "/treino", label: "Treino", icon: "dumbbell" },
  { href: "/alimentacao", label: "Alimentação", icon: "utensils" },
  { href: "/evolucao", label: "Evolução", icon: "chart" },
  { href: "/configuracoes", label: "Perfil", icon: "user" },
] as const;
