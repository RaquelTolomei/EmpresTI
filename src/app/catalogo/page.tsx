"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { trpc } from "@/lib/trpc";

export default function CatalogPage() {
  const catalog = trpc.equipment.list.useQuery({ limit: 50 });
  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#7C86A2]">
          Catálogo
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Equipamentos disponíveis
        </h1>
      </header>
      {catalog.isLoading ? (
        <p className="text-[#8A93B2]">Carregando equipamentos...</p>
      ) : catalog.error ? (
        <p className="text-[#F0A0A5]" role="alert">
          Não foi possível carregar o catálogo.
        </p>
      ) : catalog.data?.items.length === 0 ? (
        <p className="text-[#8A93B2]">Nenhum equipamento cadastrado.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.data?.items.map((equipment) => (
            <Link
              className="rounded-xl border border-[#1F2949] bg-[#0E1530] p-5 hover:border-[#5B7FE0]"
              href={`/catalogo/${equipment.patrimonyCode}`}
              key={equipment.id}
            >
              <p className="text-xs text-[#7C86A2]">
                {equipment.patrimonyCode}
              </p>
              <h2 className="mt-2 font-semibold">{equipment.name}</h2>
              <p className="mt-4 text-sm text-[#8A93B2]">
                {equipment.status === "AVAILABLE"
                  ? "Disponível"
                  : equipment.status === "BORROWED"
                    ? "Emprestado"
                    : equipment.status === "MAINTENANCE"
                      ? "Em manutenção"
                      : "Fora de uso"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
