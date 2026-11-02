# Fit Life IA ⚡

Aplicativo inteligente de treino, nutrição adaptativa e alta performance física com suporte a PWA e integração Supabase.

## 🚀 Tecnologias

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Linguagem:** TypeScript 5.9
- **Estilização:** Tailwind CSS v4 + Stitch Design System (Dark Mode com foco em Esmeralda Elétrico `#4edea3` e Índigo `#c0c1ff`)
- **Autenticação & Backend:** Supabase Auth (E-mail/Senha + Google OAuth) & PostgreSQL
- **PWA:** Suporte a Progressive Web App (instalável no Android, iOS e Desktop)
- **Testes:** Vitest

## 📋 Funcionalidades Principais

1. **Autenticação Completa:**
   - Cadastro com Nome, Sobrenome, Telefone mascarado, E-mail, Senha e confirmação com botão de visualização (olhinho).
   - Login social com Google OAuth e persistência de sessão inteligente.

2. **Questionário de Onboarding (9 Passos):**
   - Coleta biométrica (sexo, idade, peso, altura).
   - Cálculo automático de Taxa Metabólica Basal (TMB), TDEE e déficit/superávit calórico via fórmula Mifflin-St Jeor.
   - Seleção de rotina de treino flexível (quaisquer dias da semana).
   - Escolha da data de início personalizada.

3. **Dashboard & Treinamento:**
   - Protocolo de hidratação individualizado por peso corporal ($40\text{ml/kg}$).
   - Checklist diário de suplementação (Creatina, Whey Protein, Multivitamínico + Ômega 3).
   - Divisão e fichas de exercícios completas com controle de RIR (repetições na reserva) e cadência de alta performance.

4. **Nutrição & Substituição Inteligente de Alimentos:**
   - Acompanhamento de metas de calorias, proteínas, carboidratos e gorduras.
   - Ferramenta de equivalência nutricional para troca rápida de alimentos sem perder o planejamento dos macros.

5. **Perfil & Identidade Visual:**
   - Upload de foto de perfil customizada com otimização automática.
   - Ícone e identidade visual exclusiva Fit Life IA.

## 🛠️ Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/LucasCarvalho0/fit-life-IA.git
   cd fit-life-IA
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env.local` a partir do `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Preencha suas chaves do Supabase.

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

5. Para rodar os testes:
   ```bash
   npm test
   ```

6. Para compilar a versão de produção:
   ```bash
   npm run build
   ```
