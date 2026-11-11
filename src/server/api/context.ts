import type { Membership, Role } from "@prisma/client";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/server/db/prisma";

export type AppContext = {
  prisma: typeof prisma;
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  membership: Membership | null;
  tenantId: string | null;
  role: Role | null;
  requestId: string;
};

function getRequestId(request?: Request) {
  const requestId = request?.headers.get("x-request-id");
  return requestId && requestId.trim().length > 0
    ? requestId
    : crypto.randomUUID();
}

export async function createContext({
  req,
}: {
  req?: Request;
} = {}): Promise<AppContext> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.message !== "Auth session missing!") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Não foi possível validar a sessão.",
      cause: error,
    });
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const authenticatedUser = user as User | null;
  const membership = authenticatedUser
    ? await prisma.membership.findFirst({
        where: { userId: authenticatedUser.id },
        orderBy: { createdAt: "asc" },
      })
    : null;

  return {
    prisma,
    supabase,
    session: sessionData.session,
    user: authenticatedUser,
    membership,
    tenantId: membership?.tenantId ?? null,
    role: membership?.role ?? null,
    requestId: getRequestId(req),
  };
}
