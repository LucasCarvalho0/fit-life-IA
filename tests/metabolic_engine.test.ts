import { describe, expect, it } from "vitest";

// Funções determinísticas espelhadas do motor de avaliação corporal
function calculateBMR(gender: "male" | "female", weight: number, height: number, age: number): number {
  const s = gender === "male" ? 5 : -161;
  return Math.round(10 * weight + 6.25 * height - 5 * age + s);
}

function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return heightM > 0 ? Math.round((weight / (heightM * heightM)) * 10) / 10 : 0;
}

function calculateHydration(weight: number): number {
  return Math.round(weight * 40);
}

function calculateCreatine(weight: number): number {
  return Math.max(3, Math.round(weight * 0.07 * 10) / 10);
}

function getWorkoutSplit(days: number): string {
  if (days <= 2) return "Full Body (Corpo Inteiro 2x/sem)";
  if (days === 3) return "Full Body Adaptado (Alternância A/B 3x/sem)";
  if (days === 4) return "Upper / Lower (Superiores & Inferiores 4x/sem)";
  if (days === 5) return "Upper / Lower Híbrido + PPL (5x/sem)";
  if (days === 6) return "Push / Pull / Legs Duplo (Alta Frequência 6x/sem)";
  return "PPL 6x + 1 Dia Recuperação Ativa";
}

describe("Motor Fisiológico FitLife AI (Mifflin-St Jeor & Diretrizes)", () => {
  it("calcula TMB basal para homens e mulheres corretamente", () => {
    // Homem: 76.4kg, 178cm, 28 anos -> 10*76.4 + 6.25*178 - 5*28 + 5 = 764 + 1112.5 - 140 + 5 = 1741.5 -> 1742
    expect(calculateBMR("male", 76.4, 178, 28)).toBe(1742);
    // Mulher: 60kg, 165cm, 25 anos -> 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> 1345
    expect(calculateBMR("female", 60, 165, 25)).toBe(1345);
  });

  it("calcula IMC com precisão de 1 casa decimal", () => {
    // 76.4kg / (1.78 * 1.78) = 76.4 / 3.1684 = 24.113 -> 24.1
    expect(calculateBMI(76.4, 178)).toBe(24.1);
    // 140kg / (1.80 * 1.80) = 140 / 3.24 = 43.2
    expect(calculateBMI(140, 180)).toBe(43.2);
  });

  it("calcula ingestão hídrica e dose de creatina por peso corporal", () => {
    expect(calculateHydration(76.4)).toBe(3056); // ~3.05L
    expect(calculateCreatine(76.4)).toBe(5.3); // 5.3g
    expect(calculateCreatine(40)).toBe(3); // Garante mínimo de 3g
  });

  it("determina a divisão correta de treino conforme dias disponíveis", () => {
    expect(getWorkoutSplit(2)).toContain("Full Body");
    expect(getWorkoutSplit(4)).toContain("Upper / Lower");
    expect(getWorkoutSplit(6)).toContain("Push / Pull / Legs");
  });
});
