# FitLife AI — Documento de Engenharia & Arquitetura Técnica
**Versão:** 1.0.0  
**Stack Principal:** React Native + Expo (TypeScript), Expo Router, Supabase (PostgreSQL + Auth + Edge Functions), OpenAI API.  
**Plataformas Alvo:** Android (Prioridade) & iOS.

---

## 1. Análise Integral dos Requisitos & Visão do Produto
O **FitLife AI** é uma plataforma mobile completa para musculação, nutrição, recomposição corporal e monitoramento assistido por inteligência artificial. Diferente de um web wrapper ou app genérico, a solução é nativa, orientada a micro-interações, offline-first onde couber (cache com React Query/WatermelonDB ou Supabase sync) e alicerçada em regras científicas estritas (fórmulas de TMB/TDEE isoladas em código determinístico — a IA atua como assistente consultiva e adaptativa, sem alucinar métricas de saúde).

---

## 2. Arquitetura Técnica & Stack Detalhada

### Frontend Mobile
- **Framework:** React Native 0.74+ com Expo SDK 51+ (New Architecture habilitada).
- **Roteamento:** Expo Router v3 (file-based routing em `app/`).
- **Linguagem:** TypeScript estrito com Zod para inferência de tipos e validação de runtime.
- **Estilização & Design System:** NativeWind v4 (Tailwind CSS adaptado para mobile) com tokens consistentes de tipografia, sombras e cores (modo escuro nativo esportivo/premium).
- **Gerenciamento de Estado & Cache:** TanStack React Query v5 (cache de requisições, invalidação e suporte offline) + Zustand (estado de UI global: sessão ativa, cronômetro de descanso do treino).
- **Ícones e Animações:** Lucide React Native / Expo Vector Icons + React Native Reanimated v3.

### Backend & Nuvem (Supabase)
- **Banco de Dados:** PostgreSQL com Row Level Security (RLS) habilitado em 100% das tabelas.
- **Autenticação:** Supabase Auth (Email/Senha, Google OAuth nativo via Expo WebBrowser/AuthSession).
- **Edge Functions (Deno / TypeScript):**
  - `ai-assistant`: Endpoint seguro que injeta o contexto anonimizado do usuário e se comunica com a OpenAI (GPT-4o mini / GPT-4o), garantindo que API keys nunca fiquem no client.
  - `generate-workout`: Motor adaptativo que monta periodizações baseadas nos equipamentos e rotina cadastrados.
  - `generate-nutrition`: Ajuste de macronutrientes e sugestão de cronograma alimentar.

---

## 3. Dependências do Projeto (`package.json`)
```json
{
  "name": "fitlife-ai",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.23.1",
    "@supabase/supabase-js": "^2.43.4",
    "@tanstack/react-query": "^5.40.1",
    "expo": "~51.0.0",
    "expo-auth-session": "~5.5.2",
    "expo-constants": "~16.0.2",
    "expo-crypto": "~13.0.2",
    "expo-font": "~12.0.7",
    "expo-haptics": "~13.0.1",
    "expo-linear-gradient": "~13.0.2",
    "expo-router": "~3.5.14",
    "expo-status-bar": "~1.12.1",
    "expo-web-browser": "~13.0.3",
    "lucide-react-native": "^0.395.0",
    "nativewind": "^4.0.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-gesture-handler": "~2.16.1",
    "react-native-reanimated": "~3.10.1",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1",
    "react-native-svg": "15.2.0",
    "zod": "^3.23.8",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/jest": "^29.5.12",
    "@types/react": "~18.2.45",
    "jest": "^29.2.1",
    "tailwindcss": "3.3.2",
    "typescript": "~5.3.3"
  }
}
```

---

## 4. Modelagem do Banco de Dados (Supabase / PostgreSQL)

### Principais Entidades e RLS:
1. **`profiles`**: `id (uuid, FK auth.users)`, `full_name`, `avatar_url`, `birth_date`, `biological_sex ('male'|'female')`, `height_cm`, `current_weight_kg`, `experience_level ('beginner'|'intermediate'|'advanced')`, `created_at`.
2. **`user_goals`**: `user_id (uuid)`, `primary_goal ('cut'|'bulk'|'recomp'|'maintain'|'conditioning')`, `target_weight_kg`, `weekly_training_days`.
3. **`user_routines`**: `user_id (uuid)`, `wake_up_time`, `work_start_time`, `work_end_time`, `sleep_time`, `workout_time_preference`.
4. **`user_academies` & `academy_equipment`**: Mapeamento da academia do usuário com chave estrangeira para equipamentos presentes (ex: barra fixa, leg press 45°, crossover, halteres de 1-30kg).
5. **`exercises` & `exercise_alternatives`**: Catálogo estruturado com biomecânica, grupo muscular primário/secundário, grau de complexidade e regras de substituição sem perda de estímulo.
6. **`workout_plans`, `workout_days`, `workout_exercises`, `workout_logs`**: Divisão ABC/ABCD/Upper-Lower com registro de carga, RPE e repetições reais.
7. **`nutrition_plans`, `meals`, `meal_records`**: Controle de calorias diárias, macros (proteínas, carboidratos, lipídios, água) sincronizados com o motor metabólico.

**Políticas RLS:** Cada tabela possui a diretiva `USING (auth.uid() = user_id)` garantindo isolamento total por usuário.

---

## 5. Análise de Riscos Técnicos & Mitigações
1. **Alucinação da IA em Recomendações de Saúde:**  
   *Mitigação:* A IA nunca calcula TMB/TDEE ou macros. Essas fórmulas residem em TypeScript puro em `src/calculations/metabolism.ts` com testes unitários em Jest. A IA recebe os valores pré-calculados e personaliza os textos e receitas.
2. **Dependência de Conexão na Academia (Áreas com Sinal Fraco):**  
   *Mitigação:* Armazenamento do treino do dia no SQLite local via WatermelonDB ou persistência offline do React Query/AsyncStorage, permitindo registrar séries e cargas 100% offline.
3. **Escalabilidade & Assinaturas (Monetização):**  
   *Mitigação:* O schema já prevê a coluna `subscription_tier ('free' | 'pro' | 'elite')` com regras em Edge Functions para limitar o consumo de tokens da OpenAI para usuários do plano gratuito.

---

## 6. Próximo Passo Imediato (Fase 1 & Fase 3)
Iniciamos agora com a **Identidade Visual Mobile Premium** e a **Tela de Boas-Vindas / Login Mobile (Fases 1 e 5)**, desenhada especificamente na resolução nativa de smartphone (Android/iOS) com visual escuro elegante, elementos de alta densidade e ergonomia de toque impecável.
