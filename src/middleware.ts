import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware leve para o Edge Runtime do Vercel.
 * Detecta sessão via cookie do Supabase (sem chamada de rede).
 * Proteção detalhada de rotas é feita nas próprias páginas via Server Components.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Detecta sessão Supabase pelo cookie (padrão sb-*-auth-token)
  const hasSession = request.cookies
    .getAll()
    .some(
      (c) =>
        c.name.startsWith("sb-") &&
        (c.name.endsWith("-auth-token") || c.name.endsWith("-auth-token.0"))
    );

  // Se for a rota raiz "/", redireciona imediatamente sem passar por página intermediária
  if (pathname === "/") {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = hasSession ? "/dashboard" : "/login";
    return NextResponse.redirect(targetUrl);
  }

  // Rotas públicas (não precisam de login)
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/recuperar-senha");

  // Usuário SEM sessão tentando acessar rota protegida → login
  if (!hasSession && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Usuário COM sessão tentando acessar login → dashboard
  if (hasSession && pathname === "/login") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto assets estáticos:
     * _next/static, _next/image, favicon, icons, images, brand, manifest, api
     */
    "/((?!_next/static|_next/image|favicon|icons|images|brand|manifest|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
