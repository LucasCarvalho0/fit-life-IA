import { redirect } from "next/navigation";

/**
 * Rota raiz — redireciona imediatamente para a tela de login.
 * O middleware (src/middleware.ts) cuida de redirecionar usuários
 * já autenticados para o dashboard.
 */
export default function Home() {
  redirect("/login");
}
