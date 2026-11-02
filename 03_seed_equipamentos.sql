-- =====================================================================
-- FITLIFE AI - Fase 2 - Parte 3: catálogo básico de equipamentos
-- Apenas nomes de equipamentos (sem dados científicos).
-- Exercícios e alimentos NÃO são inseridos aqui: exigem curadoria/fonte
-- confiável (ex.: tabela TACO para alimentos).
-- =====================================================================
insert into public.equipment (name, category) values
  ('Halteres','peso livre'), ('Barra reta','peso livre'), ('Barra W','peso livre'),
  ('Anilhas','peso livre'), ('Kettlebell','peso livre'), ('Barra fixa','peso corporal'),
  ('Paralelas','peso corporal'), ('Banco reto','banco'), ('Banco inclinável','banco'),
  ('Banco declinado','banco'), ('Rack de agachamento','estrutura'), ('Smith machine','estrutura'),
  ('Crossover','polia'), ('Polia alta (puxador)','polia'), ('Polia baixa (remada)','polia'),
  ('Peck deck / voador','máquina'), ('Supino máquina','máquina'), ('Leg press 45°','máquina'),
  ('Cadeira extensora','máquina'), ('Mesa flexora','máquina'), ('Cadeira adutora','máquina'),
  ('Cadeira abdutora','máquina'), ('Hack squat','máquina'), ('Panturrilha em pé (máquina)','máquina'),
  ('Panturrilha sentado','máquina'), ('Remada máquina','máquina'), ('Desenvolvimento máquina','máquina'),
  ('Esteira','cardio'), ('Bicicleta ergométrica','cardio'), ('Elíptico','cardio'),
  ('Elásticos / faixas','acessório'), ('Corda naval','acessório'), ('Colchonete','acessório')
on conflict (name) do nothing;
