import { EquipmentCategory, EquipmentStatus, Prisma } from "@prisma/client";
import type { AppContext } from "@/server/api/context";

const equipmentInclude = {
  loans: {
    where: { status: "OPEN" as const },
    orderBy: { borrowedAt: "desc" as const },
    take: 1,
  },
} satisfies Prisma.EquipmentInclude;

export async function listEquipment(
  ctx: AppContext,
  input: {
    tenantId: string;
    cursor?: string;
    limit: number;
    category?: EquipmentCategory;
    status?: EquipmentStatus;
  },
) {
  const rows = await ctx.prisma.equipment.findMany({
    where: {
      tenantId: input.tenantId,
      category: input.category,
      status: input.status,
    },
    include: equipmentInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: input.limit + 1,
    ...(input.cursor ? { skip: 1, cursor: { id: input.cursor } } : {}),
  });
  const hasNextPage = rows.length > input.limit;
  const items = rows.slice(0, input.limit).map(toEquipmentSummary);
  return {
    items,
    nextCursor: hasNextPage ? items.at(-1)?.id : undefined,
  };
}

export async function getEquipmentByPatrimony(
  ctx: AppContext,
  tenantId: string,
  patrimonyCode: string,
) {
  const equipment = await ctx.prisma.equipment.findFirst({
    where: { tenantId, patrimonyCode },
    include: equipmentInclude,
  });
  if (!equipment) return null;
  const history = await ctx.prisma.loan.findMany({
    where: { tenantId, equipmentId: equipment.id },
    orderBy: { borrowedAt: "desc" },
    select: {
      id: true,
      userId: true,
      borrowedAt: true,
      dueAt: true,
      returnedAt: true,
      status: true,
    },
  });
  return {
    ...toEquipmentSummary(equipment),
    notes: equipment.notes,
    createdAt: equipment.createdAt,
    history,
  };
}

export async function createEquipment(
  ctx: AppContext,
  input: {
    tenantId: string;
    name: string;
    category: EquipmentCategory;
    patrimonyCode: string;
    imagePath?: string;
    serialNumber?: string;
    location?: string;
    status: EquipmentStatus;
    notes?: string;
  },
) {
  return ctx.prisma.equipment.create({
    data: {
      tenantId: input.tenantId,
      name: input.name,
      category: input.category,
      patrimonyCode: input.patrimonyCode,
      imagePath: input.imagePath,
      serialNumber: input.serialNumber,
      location: input.location,
      status: input.status,
      notes: input.notes,
    },
  });
}

function toEquipmentSummary(
  equipment: Prisma.EquipmentGetPayload<{ include: typeof equipmentInclude }>,
) {
  return {
    id: equipment.id,
    name: equipment.name,
    category: equipment.category,
    patrimonyCode: equipment.patrimonyCode,
    imagePath: equipment.imagePath,
    serialNumber: equipment.serialNumber,
    location: equipment.location,
    status: equipment.loans.length > 0 ? "BORROWED" : equipment.status,
  };
}
