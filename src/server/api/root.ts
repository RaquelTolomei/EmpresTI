import { router } from "@/server/api/trpc";
import { equipmentRouter } from "@/server/api/routers/equipment";
import { loanRouter } from "@/server/api/routers/loan";
import { operationsRouter } from "@/server/api/routers/operations";

export const appRouter = router({
  equipment: equipmentRouter,
  loan: loanRouter,
  operations: operationsRouter,
});

export type AppRouter = typeof appRouter;
