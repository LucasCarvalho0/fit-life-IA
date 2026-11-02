import { BottomNav } from "@/components/navigation/bottom-nav";

// Fase 3: este layout passará a exigir sessão (proteção de rotas no servidor).
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
