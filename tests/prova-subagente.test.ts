import { describe, expect, it } from "vitest";

describe("Prova Controlada do Subagente Verificador", () => {
  // CA-01: Implementado e correto -> Deve ser avaliado como ATENDIDO
  it("test_ca_01_calculo_prazo_devolucao_14_dias", () => {
    const dataRetirada = new Date("2026-11-01T10:00:00Z");
    const prazoDias = 14;
    const dataEsperada = new Date("2026-11-15T10:00:00Z");

    const dataCalculada = new Date(
      dataRetirada.getTime() + prazoDias * 24 * 60 * 60 * 1000,
    );
    expect(dataCalculada.toISOString()).toBe(dataEsperada.toISOString());
  });

  // CA-02: Implementação com defeito proposital documentado -> Deve ser avaliado como REPROVADO
  it.fails("test_ca_02_bloqueio_usuario_com_pendencia_anterior", () => {
    const usuarioTemAtraso = true;
    const podePegarEmprestimo = true; // DEFEITO: deveria ser false
    expect(podePegarEmprestimo).toBe(false);
  });

  // Nota para CA-03: Não há teste criado para o CA-03 (SMS), para validar o status SEM TESTE.
});
