"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: "home" },
  { href: "/treino", label: "Treino", icon: "fitness_center" },
  { href: "/alimentacao", label: "Alimentação", icon: "restaurant" },
  { href: "/evolucao", label: "Evolução", icon: "trending_up" },
  { href: "/configuracoes", label: "Perfil", icon: "person" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on full-screen immersion screens like active workout
  if (pathname === "/treino/ativo" || pathname === "/login" || pathname === "/onboarding") {
    return null;
  }

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/5 bg-surface/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <li key={item.href} className="flex-1 flex justify-center">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-[56px] h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-all active:scale-95 ${
                  active
                    ? "text-primary [&>span:first-child]:scale-110 font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px] transition-transform"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
