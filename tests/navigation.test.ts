import { describe, expect, it } from "vitest";
import { BOTTOM_NAV } from "@/constants/navigation";

describe("BOTTOM_NAV", () => {
  it("tem os 5 itens exigidos pelo Prompt Mestre, na ordem", () => {
    expect(BOTTOM_NAV.map((i) => i.label)).toEqual(["Início", "Treino", "Alimentação", "Evolução", "Perfil"]);
  });
  it("não repete rotas", () => {
    const hrefs = BOTTOM_NAV.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
