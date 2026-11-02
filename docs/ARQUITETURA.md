# FITLIFE AI — Arquitetura Técnica

Status: **Fase 1 entregue.** Este documento cobre os itens 1 a 9 da seção 20 do Prompt Mestre.

## 1. Decisão sobre conflito de fontes

O pacote do Stitch inclui `fitlife_ai_especifica_o_t_cnica_e_arquitetura.md`, que propõe **React Native + Expo + NativeWind**.
O Prompt Mestre proíbe Expo/React Native e exige **Next.js PWA**. Prevalece o Prompt Mestre.
Do Stitch aproveitamos apenas: design system (`reference-design/DESIGN.md`), as 17 telas de referência e as ideias de arquitetura que independem de plataforma (IA nunca calcula, RLS em todas as tabelas, `subscription_tier` prevista).
Ficam descartados: Expo Router, WatermelonDB, Edge Functions em Deno (usamos Route Handlers do Next).

## 2. Visão geral

```
Celular (PWA instalada)
   │ HTTPS
   ▼
Next.js 16 (App Router) ── Server Components / Server Actions / Route Handlers
   │            │                    │
   │ sessão     │ dados (Prisma)     │ IA
   ▼            ▼                    ▼
Supabase Auth   PostgreSQL (Supabase) OpenAI API (só no servidor)
   │                ▲
   └─ JWT (auth.uid()) ─ RLS no banco
```

Regra de ouro: **a IA nunca calcula**. `src/calculations` (TMB, TDEE, macros, água) é TypeScript puro e testado; a IA recebe os resultados prontos e só redige/explica.

## 3. Versões (verificadas por busca em 01/11/2026)

| Peça | Escolha | Observação |
|---|---|---|
| Node.js | ≥ 20.19 | Mínimo do Next 16 é 20.9; Prisma 7 pede 20.19+ |
| Next.js | 16.x | Turbopack padrão. `middleware.ts` virou `proxy.ts` no 16 |
| React | 19.x | |
| TypeScript | 5.9+ (strict) | Prisma 7 exige ≥ 5.4 |
| Tailwind | 4.x | Tokens via `@theme` em `globals.css` (sem `tailwind.config.ts`) |
| Prisma | 7.x (Fase 2) | `url` sai do schema e vai para `prisma.config.ts`; exige driver adapter `@prisma/adapter-pg`; client gerado em `src/generated/prisma` |
| Supabase | `@supabase/supabase-js` + `@supabase/ssr` (Fase 3) | |

Desvio consciente do Prompt Mestre: ele lista `tailwind.config.ts`; no Tailwind 4 a configuração fica no CSS. Confirme as versões exatas com `npm show next version` antes de fixar no lockfile.

## 4. Estrutura de pastas

Segue a seção 3 do Prompt Mestre. Diferenças da Fase 1:
- `src/app/(app)/` é um route group com o layout autenticado (BottomNav). Login e cadastro ficam fora dele (Fase 3).
- `manifest.ts` substitui `public/manifest.json` (o Next gera `/manifest.webmanifest`).
- `reference-design/` guarda o material do Stitch, excluído de lint e TypeScript.

## 5. Integração Next.js ↔ Supabase ↔ PostgreSQL ↔ Prisma

**Uma única fonte de verdade:** o schema é definido no Prisma e as migrações vão para o Supabase. Nenhuma tabela é criada pelo painel do Supabase.

- **Auth:** Supabase Auth guarda usuários em `auth.users`. Nossas tabelas referenciam `auth.users.id` (uuid) em `UserProfile.id`, sem duplicar e-mail ou senha.
- **Dados:** toda leitura/escrita de domínio passa por Prisma, no servidor.
- **Duas conexões:**
  - `DATABASE_URL`: pooler Supavisor (transaction, porta 6543), usada em runtime.
  - `DIRECT_URL`: conexão direta/session (5432), usada só por `prisma migrate`. Ambas configuradas em `prisma.config.ts`/adapter.
- **RLS + Prisma (ponto crítico):** o Prisma conecta com um papel de banco que **ignora RLS**. Portanto:
  1. Todo acesso via Prisma passa por helper que obtém `userId` de `supabase.auth.getUser()` (nunca de parâmetro do cliente) e filtra por ele.
  2. As políticas RLS (`auth.uid() = user_id`) protegem o outro caminho de acesso: a API REST do Supabase e a anon key, que é pública por natureza.
  3. As políticas ficam em migrações SQL versionadas junto das migrações Prisma. Tabelas de catálogo (Exercise, Food, Equipment) terão leitura pública e escrita bloqueada.
- **Navegador:** usa o cliente Supabase só para autenticação. Dados de domínio nunca vão do navegador direto ao banco.

## 6. Planejamento do banco (modelagem na Fase 2)

| Domínio | Modelos | Notas |
|---|---|---|
| Perfil | UserProfile, UserGoal, UserRoutine, UserSchedule, HealthRestriction | `onboardingCompletedAt` decide o redirecionamento; `subscriptionTier` prevista (free/premium) |
| Academia | UserAcademy, Equipment, AcademyEquipment | N:N com tabela de junção e `@@unique([academyId, equipmentId])` |
| Exercícios | Exercise, ExerciseAlternative | Alternativa guarda `movementPattern`, `equivalenceScore`, motivo; só equivalência funcional |
| Treino | WorkoutPlan, WorkoutDay, WorkoutExercise, WorkoutHistory | Histórico guarda carga, reps, séries, RPE |
| Nutrição | NutritionPlan, Food, Meal, MealRecord, WaterRecord | Macros como `Decimal`, nunca float |
| Evolução | BodyMeasurement, WeightHistory | Foto opcional em Supabase Storage com bucket privado |
| IA | AIConversation, AIMessage, Notification | Contador de uso para limites |

Todos com `userId` indexado, `createdAt/updatedAt`, `onDelete: Cascade` a partir do perfil (necessário para o direito de exclusão da LGPD).

## 7. Login com Google

1. Google Cloud Console: criar OAuth Client (Web). Redirect URI = `https://<projeto>.supabase.co/auth/v1/callback`.
2. Supabase → Authentication → Providers → Google: colar Client ID/Secret. Em URL Configuration, cadastrar `http://localhost:3000/**` e a URL de produção.
3. Botão chama `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${origin}/auth/callback` } })`.
4. Fluxo **PKCE**: Route Handler `/auth/callback` troca o `code` por sessão (`exchangeCodeForSession`), grava cookies via `@supabase/ssr` e redireciona: sem onboarding → `/onboarding`; com onboarding → `/dashboard`.
5. `proxy.ts` renova a sessão e protege as rotas; a autorização real continua no servidor, em cada página/handler.

## 8. Riscos técnicos

| Risco | Mitigação |
|---|---|
| Prisma contornando RLS | Helper único de acesso com `userId` da sessão + testes de permissão em `tests/security` |
| Prisma 7 + pooler transaction | Adapter `pg` com pool pequeno; migrações só por `DIRECT_URL` |
| IA recomendando algo perigoso | Ela só recebe números calculados e restrições de saúde; saída validada por regras (exercícios contraindicados filtrados antes) |
| Custo/abuso da OpenAI | Rate limit por usuário, limite diário por plano, timeout e tratamento de erro |
| Substituição de exercício inadequada | Catálogo curado com padrão de movimento; sem curadoria, sem substituição |
| **Qualidade do catálogo de exercícios/alimentos** | Maior risco do produto. Exige dados confiáveis (imagens com licença, tabela de alimentos como a TACO). Não inventar dados |
| Déficits calóricos agressivos / público sensível | Piso calórico e bloqueio para menores, gestantes e condições de saúde, com encaminhamento a profissional |
| PWA em iOS | Push e instalação têm limitações; não prometer offline total |
| Dados sensíveis de saúde (LGPD) | Consentimento explícito, exportação e exclusão de conta, bucket privado de fotos |
| Cache de service worker servindo dados de outro usuário | Não cachear respostas autenticadas; só estáticos |

## 9. Segurança dos dados (resumo)

Cookies HttpOnly via `@supabase/ssr`; `getUser()` (não `getSession()`) para decisões de acesso; validação Zod em toda entrada; segredos só em variáveis de ambiente do servidor; `SUPABASE_SERVICE_ROLE_KEY` e `OPENAI_API_KEY` nunca com prefixo `NEXT_PUBLIC_`; cabeçalhos de segurança já ativos em `next.config.ts`; RLS em 100% das tabelas; backups diários do Supabase (verificar o que o plano contratado inclui); log de operações relevantes.
