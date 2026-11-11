import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "@/server/api/trpc";
import { LoanRuleError, returnLoan } from "@/server/services/loan-service";
import {
  listOpenLoans,
  recentEquipment,
} from "@/server/services/operations-service";

export const operationsRouter = router({
  openLoans: adminProcedure
    .input(
      z.object({
        cursor: z.string().cuid().optional(),
        limit: z.number().int().min(1).max(50).default(20),
        userId: z.string().uuid().optional(),
      }),
    )
    .query(({ ctx, input }) =>
      listOpenLoans(ctx, { tenantId: ctx.tenantId, ...input }),
    ),
  returnLoan: adminProcedure
    .input(z.object({ loanId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await returnLoan(ctx, {
          tenantId: ctx.tenantId,
          actorId: ctx.user.id,
          loanId: input.loanId,
        });
      } catch (error) {
        if (error instanceof LoanRuleError) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Empréstimo não encontrado.",
            cause: error,
          });
        }
        throw error;
      }
    }),
  recentEquipment: adminProcedure.query(({ ctx }) =>
    recentEquipment(ctx, ctx.tenantId),
  ),
});
