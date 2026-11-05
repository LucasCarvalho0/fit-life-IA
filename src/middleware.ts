import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (imagens otimizadas)
     * - favicon, icons, images, manifest (assets públicos)
     * - api routes internas do Next
     */
    "/((?!_next/static|_next/image|favicon|icons|images|brand|manifest|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};

