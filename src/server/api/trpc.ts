import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { Role } from "@prisma/client";
import type { AppContext } from "@/server/api/context";

const t = initTRPC.context<AppContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Sessão ausente ou inválida.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});

export const tenantProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.membership || !ctx.tenantId || !ctx.role) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Usuário não pertence a um tenant.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      membership: ctx.membership,
      tenantId: ctx.tenantId,
      role: ctx.role,
    },
  });
});

export const adminProcedure = tenantProcedure.use(({ ctx, next }) => {
  if (ctx.role !== Role.OPERATIONS) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Acesso restrito a Operações.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      role: Role.OPERATIONS,
    },
  });
});
