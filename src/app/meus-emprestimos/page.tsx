"use client";

import { AppShell } from "@/components/app-shell";
import { trpc } from "@/lib/trpc";

export default function MyLoansPage() {
  const loans = trpc.loan.mine.useQuery();
  const utils = trpc.useUtils();
  const returnLoan = trpc.loan.returnMine.useMutation({
    onSuccess: () => utils.loan.mine.invalidate(),
  });
  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#7C86A2]">
          Acompanhamento
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Meus empréstimos</h1>
      </header>
      {loans.isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4">
          {loans.data?.map((loan) => (
            <article
              className="flex flex-col gap-4 rounded-xl border border-[#1F2949] bg-[#0E1530] p-5 sm:flex-row sm:items-center sm:justify-between"
              key={loan.id}
            >
              <div>
                <h2 className="font-semibold">{loan.equipment.name}</h2>
                <p className="text-sm text-[#8A93B2]">
                  Prazo: {loan.dueAt.toLocaleDateString("pt-BR")}
                </p>
                <p className="text-xs text-[#7C86A2]">
                  {loan.status === "OPEN" ? "Em aberto" : "Devolvido"}
                </p>
              </div>
              {loan.status === "OPEN" ? (
                <button
                  className="rounded-md border border-[#5B7FE0] px-4 py-2 text-sm text-[#B4C6F6]"
                  onClick={() => returnLoan.mutate({ loanId: loan.id })}
                  type="button"
                >
                  Registrar devolução
                </button>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
