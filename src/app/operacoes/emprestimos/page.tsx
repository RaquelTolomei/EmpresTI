"use client";

import { AppShell } from "@/components/app-shell";
import { trpc } from "@/lib/trpc";

export default function OperationsLoansPage() {
  const loans = trpc.operations.openLoans.useQuery({ limit: 50 });
  const utils = trpc.useUtils();
  const returnLoan = trpc.operations.returnLoan.useMutation({
    onSuccess: () => utils.operations.openLoans.invalidate(),
  });
  return (
    <AppShell>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#7C86A2]">
            Operações
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Empréstimos em aberto</h1>
        </div>
        <a
          className="rounded-md border border-[#5B7FE0] px-4 py-2 text-sm text-[#B4C6F6]"
          href="/operacoes/equipamentos/novo"
        >
          Cadastrar equipamento
        </a>
      </header>
      {loans.data ? (
        <p className="mb-5 text-sm text-[#8A93B2]">
          {loans.data.stats.total} abertos · {loans.data.stats.overdue} em
          atraso
        </p>
      ) : null}
      <div className="grid gap-3">
        {loans.data?.items.map((loan) => (
          <article
            className="flex items-center justify-between rounded-xl border border-[#1F2949] bg-[#0E1530] p-4"
            key={loan.id}
          >
            <div>
              <p className="font-semibold">{loan.equipment.name}</p>
              <p className="text-sm text-[#8A93B2]">
                {loan.equipment.patrimonyCode} · {loan.userId}
              </p>
            </div>
            <button
              className="text-sm text-[#B4C6F6]"
              onClick={() => returnLoan.mutate({ loanId: loan.id })}
              type="button"
            >
              Devolver
            </button>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
