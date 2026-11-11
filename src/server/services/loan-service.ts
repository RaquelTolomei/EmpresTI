import { Prisma, EquipmentStatus, LoanStatus } from "@prisma/client";
import type { AppContext } from "@/server/api/context";

const LOAN_TERM_DAYS = 14;

export async function createLoan(
  ctx: AppContext,
  input: {
    tenantId: string;
    userId: string;
    equipmentId: string;
    notes?: string;
  },
) {
  return ctx.prisma.$transaction(async (tx) => {
    const now = new Date();
    const overdue = await tx.loan.count({
      where: {
        tenantId: input.tenantId,
        userId: input.userId,
        status: LoanStatus.OPEN,
        dueAt: { lt: now },
      },
    });
    if (overdue > 0) throw new LoanRuleError("OVERDUE_LOAN");

    const openCount = await tx.loan.count({
      where: {
        tenantId: input.tenantId,
        userId: input.userId,
        status: LoanStatus.OPEN,
      },
    });
    if (openCount >= 3) throw new LoanRuleError("LOAN_LIMIT");

    const equipment = await tx.equipment.findFirst({
      where: { id: input.equipmentId, tenantId: input.tenantId },
    });
    if (!equipment || equipment.status !== EquipmentStatus.AVAILABLE) {
      throw new LoanRuleError("EQUIPMENT_UNAVAILABLE");
    }

    const dueAt = new Date(now);
    dueAt.setDate(dueAt.getDate() + LOAN_TERM_DAYS);
    try {
      const loan = await tx.loan.create({
        data: {
          tenantId: input.tenantId,
          equipmentId: equipment.id,
          userId: input.userId,
          borrowedAt: now,
          dueAt,
          notes: input.notes,
        },
      });
      await tx.auditEvent.create({
        data: {
          tenantId: input.tenantId,
          actorId: input.userId,
          action: "LOAN_CREATED",
          resourceType: "loan",
          resourceId: loan.id,
          equipmentId: equipment.id,
        },
      });
      return loan;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new LoanRuleError("EQUIPMENT_UNAVAILABLE");
      }
      throw error;
    }
  });
}

export async function listMine(
  ctx: AppContext,
  tenantId: string,
  userId: string,
) {
  return ctx.prisma.loan.findMany({
    where: { tenantId, userId },
    include: { equipment: true },
    orderBy: [{ status: "asc" }, { borrowedAt: "desc" }],
  });
}

export async function returnLoan(
  ctx: AppContext,
  input: {
    tenantId: string;
    loanId: string;
    actorId: string;
    ownOnly?: boolean;
  },
) {
  return ctx.prisma.$transaction(async (tx) => {
    const loan = await tx.loan.findFirst({
      where: {
        id: input.loanId,
        tenantId: input.tenantId,
        status: LoanStatus.OPEN,
        ...(input.ownOnly ? { userId: input.actorId } : {}),
      },
      include: { equipment: true },
    });
    if (!loan) throw new LoanRuleError("LOAN_NOT_FOUND");
    const returnedAt = new Date();
    const updated = await tx.loan.update({
      where: { id: loan.id },
      data: {
        status: LoanStatus.CLOSED,
        returnedAt,
        returnedByUserId: input.actorId,
      },
      include: { equipment: true },
    });
    await tx.auditEvent.create({
      data: {
        tenantId: input.tenantId,
        actorId: input.actorId,
        action: "LOAN_RETURNED",
        resourceType: "loan",
        resourceId: loan.id,
        equipmentId: loan.equipmentId,
      },
    });
    return updated;
  });
}

export class LoanRuleError extends Error {
  constructor(public readonly reason: string) {
    super(reason);
    this.name = "LoanRuleError";
  }
}
