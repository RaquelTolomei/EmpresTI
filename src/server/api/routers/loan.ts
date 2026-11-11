import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { tenantProcedure, router } from "@/server/api/trpc";
import {
  LoanRuleError,
  createLoan,
  listMine,
  returnLoan,
} from "@/server/services/loan-service";

function mapLoanError(error: unknown): never {
  if (!(error instanceof LoanRuleError)) throw error;
  const messages: Record<string, string> = {
    OVERDUE_LOAN: "Você possui um empréstimo em atraso.",
    LOAN_LIMIT: "O limite de três empréstimos abertos foi atingido.",
    EQUIPMENT_UNAVAILABLE: "O equipamento não está disponível.",
    LOAN_NOT_FOUND: "Empréstimo aberto não encontrado.",
  };
  throw new TRPCError({
    code: error.reason === "LOAN_NOT_FOUND" ? "NOT_FOUND" : "CONFLICT",
    message: messages[error.reason] ?? "Não foi possível concluir a operação.",
    cause: error,
  });
}

export const loanRouter = router({
  create: tenantProcedure
    .input(
      z.object({
        equipmentId: z.string().cuid(),
        notes: z.string().trim().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await createLoan(ctx, {
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          ...input,
        });
      } catch (error) {
        return mapLoanError(error);
      }
    }),
  mine: tenantProcedure.query(({ ctx }) =>
    listMine(ctx, ctx.tenantId, ctx.user.id),
  ),
  returnMine: tenantProcedure
    .input(z.object({ loanId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await returnLoan(ctx, {
          tenantId: ctx.tenantId,
          actorId: ctx.user.id,
          loanId: input.loanId,
          ownOnly: true,
        });
      } catch (error) {
        return mapLoanError(error);
      }
    }),
});
