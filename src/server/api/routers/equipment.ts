import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { EquipmentCategory, EquipmentStatus } from "@prisma/client";
import { adminProcedure, tenantProcedure, router } from "@/server/api/trpc";
import {
  createEquipment,
  getEquipmentByPatrimony,
  listEquipment,
} from "@/server/services/equipment-service";

const category = z.nativeEnum(EquipmentCategory);
const status = z.nativeEnum(EquipmentStatus);

export const equipmentRouter = router({
  list: tenantProcedure
    .input(
      z.object({
        cursor: z.string().cuid().optional(),
        limit: z.number().int().min(1).max(50).default(12),
        category: category.optional(),
        status: status.optional(),
      }),
    )
    .query(({ ctx, input }) =>
      listEquipment(ctx, {
        tenantId: ctx.tenantId,
        ...input,
      }),
    ),
  getByPatrimony: tenantProcedure
    .input(z.object({ patrimonyCode: z.string().trim().min(1) }))
    .query(async ({ ctx, input }) => {
      const equipment = await getEquipmentByPatrimony(
        ctx,
        ctx.tenantId,
        input.patrimonyCode,
      );
      if (!equipment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Equipamento não encontrado.",
        });
      }
      return equipment;
    }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).max(120),
        category,
        patrimonyCode: z.string().trim().min(1).max(40),
        imagePath: z.string().trim().max(255).optional(),
        serialNumber: z.string().trim().max(120).optional(),
        location: z.string().trim().max(120).optional(),
        status: status.default(EquipmentStatus.AVAILABLE),
        notes: z.string().trim().max(2000).optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      createEquipment(ctx, { tenantId: ctx.tenantId, ...input }),
    ),
});
