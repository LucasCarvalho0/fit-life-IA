# Checklist de fases

Marque somente após testar. Não avançar sem fechar a fase anterior.

## Fase 1 — Ambiente
- [x] Estrutura de pastas do Prompt Mestre
- [x] Next.js 16 + TypeScript strict + Tailwind 4 (config)
- [x] Tokens do design system do Stitch
- [x] Manifest PWA e ícones
- [x] BottomNav com os 5 itens
- [x] Cabeçalhos de segurança
- [ ] **Você:** `npm install`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`
- [ ] **Você:** `git init`, primeiro commit, repositório no GitHub

## Fase 2 — Banco
- [ ] Projeto Supabase criado, `.env.local` preenchido
- [ ] Prisma 7 + adapter pg, schema com 25 modelos
- [ ] Primeira migração + SQL de RLS
- [ ] Teste: usuário A não lê dados do usuário B

## Fases 3 a 12
Conforme seção 18 do Prompt Mestre.
