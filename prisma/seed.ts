import { PrismaPg } from "@prisma/adapter-pg";
import {
  EquipmentCategory,
  EquipmentStatus,
  PrismaClient,
} from "@prisma/client";
import equipmentManifest from "../public/equipment-images/manifest.json";

const categoryByName: Record<string, EquipmentCategory> = {
  notebook: EquipmentCategory.NOTEBOOK,
  monitor: EquipmentCategory.MONITOR,
  cabo: EquipmentCategory.CABLE,
  camera: EquipmentCategory.CAMERA,
};
const maintenancePatrimonies = new Set(["TI-0004", "TI-0007", "TI-0010"]);
const expectedPatrimonies = Array.from(
  { length: 12 },
  (_, index) => `TI-${String(index + 1).padStart(4, "0")}`,
);

if (
  equipmentManifest.length !== expectedPatrimonies.length ||
  expectedPatrimonies.some(
    (patrimonyCode) =>
      !equipmentManifest.some((item) => item.equipment === patrimonyCode),
  )
) {
  throw new Error("O manifesto deve conter os patrimônios TI-0001 a TI-0012.");
}

const equipmentList = equipmentManifest.map((item) => {
  const category = categoryByName[item.category];
  if (!category) {
    throw new Error(`Categoria inválida no manifesto: ${item.category}`);
  }
  if (item.filename !== `${item.equipment}.webp`) {
    throw new Error(`Nome de imagem inesperado para ${item.equipment}.`);
  }

  return {
    patrimonyCode: item.equipment,
    name: item.name,
    category,
    status: maintenancePatrimonies.has(item.equipment)
      ? EquipmentStatus.MAINTENANCE
      : EquipmentStatus.AVAILABLE,
    imagePath: `img/${item.filename}`,
  };
});

function getLocalDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!databaseUrl) {
    throw new Error("Defina DIRECT_URL ou DATABASE_URL para executar o seed.");
  }

  const { hostname } = new URL(databaseUrl);
  if (!["localhost", "127.0.0.1", "::1"].includes(hostname)) {
    throw new Error(
      "O seed só pode ser executado contra um PostgreSQL local; banco remoto recusado.",
    );
  }

  return databaseUrl;
}

async function main(): Promise<void> {
  const adapter = new PrismaPg({
    connectionString: getLocalDatabaseUrl(),
  });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$transaction(async (transaction) => {
      const tenant = await transaction.tenant.upsert({
        where: { slug: "suporte_ti" },
        update: {},
        create: {
          slug: "suporte_ti",
          name: "Suporte TI",
        },
      });

      for (const equipment of equipmentList) {
        await transaction.equipment.upsert({
          where: {
            tenantId_patrimonyCode: {
              tenantId: tenant.id,
              patrimonyCode: equipment.patrimonyCode,
            },
          },
          update: {
            name: equipment.name,
            category: equipment.category,
            status: equipment.status,
            imagePath: equipment.imagePath,
          },
          create: {
            tenantId: tenant.id,
            patrimonyCode: equipment.patrimonyCode,
            name: equipment.name,
            category: equipment.category,
            status: equipment.status,
            imagePath: equipment.imagePath,
          },
        });
      }
    });

    console.info(`Seed concluído: ${equipmentList.length} equipamentos.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Falha ao carregar os equipamentos iniciais.", error);
  process.exitCode = 1;
});
