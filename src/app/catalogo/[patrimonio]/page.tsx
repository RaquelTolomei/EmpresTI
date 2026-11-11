"use client";

import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { trpc } from "@/lib/trpc";

export default function EquipmentDetailPage() {
  const params = useParams<{ patrimonio: string }>();
  const detail = trpc.equipment.getByPatrimony.useQuery({
    patrimonyCode: params.patrimonio,
  });
  const utils = trpc.useUtils();
  const loan = trpc.loan.create.useMutation({
    onSuccess: () =>
      utils.equipment.getByPatrimony.invalidate({
        patrimonyCode: params.patrimonio,
      }),
  });
  if (detail.isLoading)
    return (
      <AppShell>
        <p>Carregando...</p>
      </AppShell>
    );
  if (!detail.data)
    return (
      <AppShell>
        <p className="text-[#F0A0A5]">Equipamento não encontrado.</p>
      </AppShell>
    );
  const equipment = detail.data;
  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs text-[#7C86A2]">{equipment.patrimonyCode}</p>
        <h1 className="mt-2 text-3xl font-semibold">{equipment.name}</h1>
      </header>
      <section className="max-w-xl rounded-xl border border-[#1F2949] bg-[#0E1530] p-6">
        <dl className="grid gap-4 text-sm">
          <div>
            <dt className="text-[#7C86A2]">Categoria</dt>
            <dd>{equipment.category}</dd>
          </div>
          <div>
            <dt className="text-[#7C86A2]">Situação</dt>
            <dd>{equipment.status}</dd>
          </div>
          <div>
            <dt className="text-[#7C86A2]">Local</dt>
            <dd>{equipment.location || "Não informado"}</dd>
          </div>
        </dl>
        {equipment.status === "AVAILABLE" ? (
          <button
            className="mt-8 rounded-md border border-[#5B7FE0] px-4 py-2 text-sm text-[#B4C6F6] disabled:opacity-50"
            disabled={loan.isPending}
            onClick={() => loan.mutate({ equipmentId: equipment.id })}
            type="button"
          >
            {loan.isPending ? "Solicitando..." : "Solicitar equipamento"}
          </button>
        ) : null}
        {loan.error ? (
          <p className="mt-3 text-sm text-[#F0A0A5]">{loan.error.message}</p>
        ) : null}
      </section>
    </AppShell>
  );
}
