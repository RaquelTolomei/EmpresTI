import { LoanStatus } from "@prisma/client";
import type { AppContext } from "@/server/api/context";

export async function listOpenLoans(
  ctx: AppContext,
  input: { tenantId: string; cursor?: string; limit: number; userId?: string },
) {
  const rows = await ctx.prisma.loan.findMany({
    where: {
      tenantId: input.tenantId,
      status: LoanStatus.OPEN,
      userId: input.userId,
    },
    include: { equipment: true },
    orderBy: [{ borrowedAt: "desc" }, { id: "desc" }],
    take: input.limit + 1,
    ...(input.cursor ? { skip: 1, cursor: { id: input.cursor } } : {}),
  });
  const hasNextPage = rows.length > input.limit;
  const items = rows.slice(0, input.limit);
  return {
    items,
    nextCursor: hasNextPage ? items.at(-1)?.id : undefined,
    stats: {
      total: await ctx.prisma.loan.count({
        where: { tenantId: input.tenantId, status: LoanStatus.OPEN },
      }),
      overdue: await ctx.prisma.loan.count({
        where: {
          tenantId: input.tenantId,
          status: LoanStatus.OPEN,
          dueAt: { lt: new Date() },
        },
      }),
    },
  };
}

export async function recentEquipment(ctx: AppContext, tenantId: string) {
  return ctx.prisma.equipment.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}
