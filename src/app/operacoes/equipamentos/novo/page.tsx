"use client";

import { FormEvent } from "react";
import { AppShell } from "@/components/app-shell";
import { trpc } from "@/lib/trpc";

export default function NewEquipmentPage() {
  const create = trpc.equipment.create.useMutation();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    create.mutate({
      name: String(data.get("name")),
      patrimonyCode: String(data.get("patrimonyCode")),
      category: data.get("category") as
        | "NOTEBOOK"
        | "MONITOR"
        | "CAMERA"
        | "CABLE"
        | "DOCK"
        | "PROJECTOR"
        | "ACCESSORY",
      status: data.get("status") as "AVAILABLE" | "MAINTENANCE" | "RETIRED",
      location: String(data.get("location") || ""),
      notes: String(data.get("notes") || ""),
    });
  }
  return (
    <AppShell>
      <h1 className="mb-8 text-3xl font-semibold">Cadastrar equipamento</h1>
      <form className="grid max-w-xl gap-4" onSubmit={submit}>
        {[
          ["name", "Nome"],
          ["patrimonyCode", "Patrimônio"],
          ["location", "Local"],
        ].map(([name, label]) => (
          <label className="grid gap-2 text-sm text-[#8A93B2]" key={name}>
            {label}
            <input
              className="rounded-md border border-[#2B3450] bg-[#0B1128] px-3 py-2 text-[#E6EAF6]"
              name={name}
              required={name !== "location"}
            />
          </label>
        ))}
        <label className="grid gap-2 text-sm text-[#8A93B2]">
          Categoria
          <select
            className="rounded-md border border-[#2B3450] bg-[#0B1128] px-3 py-2"
            defaultValue="NOTEBOOK"
            name="category"
          >
            {[
              "NOTEBOOK",
              "MONITOR",
              "CAMERA",
              "CABLE",
              "DOCK",
              "PROJECTOR",
              "ACCESSORY",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[#8A93B2]">
          Situação
          <select
            className="rounded-md border border-[#2B3450] bg-[#0B1128] px-3 py-2"
            defaultValue="AVAILABLE"
            name="status"
          >
            {["AVAILABLE", "MAINTENANCE", "RETIRED"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-[#8A93B2]">
          Observações
          <textarea
            className="rounded-md border border-[#2B3450] bg-[#0B1128] px-3 py-2"
            name="notes"
          />
        </label>
        <button
          className="w-fit rounded-md border border-[#5B7FE0] px-4 py-2 text-sm text-[#B4C6F6]"
          disabled={create.isPending}
          type="submit"
        >
          Salvar equipamento
        </button>
        {create.error ? (
          <p className="text-sm text-[#F0A0A5]">{create.error.message}</p>
        ) : null}
        {create.isSuccess ? (
          <p className="text-sm text-[#5FD3AA]">Equipamento cadastrado.</p>
        ) : null}
      </form>
    </AppShell>
  );
}
