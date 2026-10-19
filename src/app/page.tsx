"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type EquipmentStatus = "available" | "borrowed" | "maintenance";
type EquipmentCategory =
  "Notebooks" | "Monitores" | "Câmeras" | "Acessórios" | "Projetores";
type IconName =
  | "package"
  | "catalog"
  | "loans"
  | "operations"
  | "add"
  | "search"
  | "info"
  | "laptop"
  | "monitor"
  | "camera"
  | "usb"
  | "projector"
  | "arrow";

type Equipment = {
  name: string;
  category: EquipmentCategory;
  patrimony: string;
  status: EquipmentStatus;
  icon: Extract<
    IconName,
    "laptop" | "monitor" | "camera" | "usb" | "projector"
  >;
  detail: string;
};

const equipment: Equipment[] = [
  {
    name: 'MacBook Pro 14"',
    category: "Notebooks",
    patrimony: "PAT-1042",
    status: "available",
    icon: "laptop",
    detail: "Disponível para solicitação",
  },
  {
    name: "ThinkPad T14",
    category: "Notebooks",
    patrimony: "PAT-1188",
    status: "borrowed",
    icon: "laptop",
    detail: "Com Rafael Lima · devolve 28/out",
  },
  {
    name: 'Dell UltraSharp 27"',
    category: "Monitores",
    patrimony: "PAT-0871",
    status: "available",
    icon: "monitor",
    detail: "Disponível para solicitação",
  },
  {
    name: "Sony A7 III",
    category: "Câmeras",
    patrimony: "PAT-0233",
    status: "maintenance",
    icon: "camera",
    detail: "Em assistência técnica",
  },
  {
    name: "Dock USB-C Anker",
    category: "Acessórios",
    patrimony: "PAT-0455",
    status: "available",
    icon: "usb",
    detail: "Disponível para solicitação",
  },
  {
    name: "Projetor Epson X49",
    category: "Projetores",
    patrimony: "PAT-0102",
    status: "borrowed",
    icon: "projector",
    detail: "Com Camila Duarte · devolve 30/out",
  },
];

const categories: Array<"Todos" | EquipmentCategory> = [
  "Todos",
  "Notebooks",
  "Monitores",
  "Câmeras",
  "Acessórios",
  "Projetores",
];

const statusLabel: Record<EquipmentStatus, string> = {
  available: "Disponível",
  borrowed: "Emprestado",
  maintenance: "Manutenção",
};

const statusStyles: Record<EquipmentStatus, string> = {
  available:
    "border border-[rgba(63,185,140,0.35)] bg-[rgba(63,185,140,0.12)] text-[#5FD3AA]",
  borrowed: "border border-[#2B3450] bg-[#1A2340] text-[#9AA3BC]",
  maintenance:
    "border border-[rgba(224,163,63,0.35)] bg-[rgba(224,163,63,0.12)] text-[#E8B961]",
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "package":
      return (
        <svg {...common}>
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="m4.5 7.7 7.5 4.2 7.5-4.2M12 12v9M8 5.2l8 4.6" />
        </svg>
      );
    case "catalog":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "loans":
      return (
        <svg {...common}>
          <path d="M7 4h10a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2Z" />
          <path d="M9 8h6M9 12h6M9 16h3M3 8v12h14" />
        </svg>
      );
    case "operations":
      return (
        <svg {...common}>
          <path d="M8 5h12M8 12h12M8 19h12" />
          <path d="m3.5 5 1.5 1.5L7 4.5M3.5 12l1.5 1.5L7 11.5M3.5 19l1.5 1.5L7 18.5" />
        </svg>
      );
    case "add":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="11" rx="1.5" />
          <path d="M3 18h18l-1 2H4l-1-2Z" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="17" height="12" rx="1.5" />
          <path d="M12 16v4M8 20h8" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M4 8h4l1.5-2h5L16 8h4v11H4V8Z" />
          <circle cx="12" cy="13.5" r="3.2" />
        </svg>
      );
    case "usb":
      return (
        <svg {...common}>
          <path d="M12 20V5M12 5l-2.5 2.5M12 5l2.5 2.5M12 11l-4 4M12 14l4 4" />
          <circle cx="12" cy="3.5" r="1.5" />
          <rect x="5.5" y="15" width="3" height="3" rx=".5" />
          <path d="M16 18h3v3h-3z" />
        </svg>
      );
    case "projector":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="15.5" cy="12" r="3" />
          <path d="M6.5 10h3M6.5 13h3M7 18v2M17 18v2" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      );
  }
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Todos");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredEquipment = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return equipment.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${item.name} ${item.category} ${item.patrimony}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch);
      const matchesCategory =
        category === "Todos" || item.category === category;
      const matchesAvailability = !availableOnly || item.status === "available";

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [availableOnly, category, search]);

  return (
    <main
      className="min-h-screen bg-[#080C1A] font-[Open_Sans,system-ui,sans-serif] text-[#E6EAF6]"
      data-screen-label="02 Catálogo"
    >
      <div className="min-h-screen md:grid md:grid-cols-[236px_minmax(0,1fr)]">
        <aside className="border-b border-[#1A2340] bg-[#060A16] px-4 py-4 md:flex md:min-h-screen md:flex-col md:border-b-0 md:border-r md:px-[14px] md:py-[22px]">
          <Link
            href="/"
            className="mb-4 flex items-center gap-[10px] px-2 text-[#E6EAF6] no-underline md:mb-[26px]"
            aria-label="EmpresTI, página inicial"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-[#001449] text-[#B4C6F6] shadow-[0_0_0_1px_#25408F]">
              <Icon name="package" size={16} />
            </span>
            <span className="text-sm font-semibold tracking-[0.02em]">
              EmpresTI
            </span>
          </Link>

          <nav
            className="flex gap-1 overflow-x-auto md:flex-col md:gap-[3px]"
            aria-label="Navegação principal"
          >
            <p className="hidden px-2 pb-1 text-[10px] uppercase tracking-[0.12em] text-[#454E68] md:block">
              Colaborador
            </p>
            <Link
              href="/"
              aria-current="page"
              className="flex shrink-0 items-center gap-[10px] rounded-lg bg-[#0E1530] px-[10px] py-[9px] text-[13px] text-[#E6EAF6] shadow-[inset_2px_0_0_#5B7FE0]"
            >
              <span className="text-[#8AA6EE]">
                <Icon name="catalog" size={16} />
              </span>
              Catálogo
            </Link>
            <span
              aria-disabled="true"
              className="flex shrink-0 items-center gap-[10px] rounded-lg px-[10px] py-[9px] text-[13px] text-[#5E6884]"
            >
              <Icon name="loans" size={16} />
              Meus empréstimos
            </span>

            <p className="hidden px-2 pb-1 pt-[18px] text-[10px] uppercase tracking-[0.12em] text-[#454E68] md:block">
              Operações
            </p>
            <span
              aria-disabled="true"
              className="flex shrink-0 items-center gap-[10px] rounded-lg px-[10px] py-[9px] text-[13px] text-[#5E6884]"
            >
              <Icon name="operations" size={16} />
              Empréstimos em aberto
            </span>
            <span
              aria-disabled="true"
              className="flex shrink-0 items-center gap-[10px] rounded-lg px-[10px] py-[9px] text-[13px] text-[#5E6884]"
            >
              <Icon name="add" size={16} />
              Cadastrar equipamento
            </span>
          </nav>

          <div className="mt-[auto] hidden items-center gap-[10px] rounded-[10px] border border-[#1A2340] bg-[#0B1128] p-3 md:flex">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#132663] text-[11px] font-semibold text-[#B4C6F6]">
              MA
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#E6EAF6]">
                Marina Alves
              </span>
              <span className="block truncate text-[11px] text-[#7C86A2]">
                Design
              </span>
            </span>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="flex min-h-16 flex-col justify-center gap-3 border-b border-[#1A2340] px-5 py-3 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <label className="flex h-9 w-full max-w-[420px] items-center gap-2 rounded-lg border border-[#222C4A] bg-[#0B1128] px-3 text-[#5E6884] focus-within:border-[#5B7FE0]">
              <Icon name="search" size={17} />
              <span className="sr-only">Buscar no catálogo</span>
              <input
                type="search"
                aria-label="Buscar no catálogo"
                placeholder="Buscar equipamento ou patrimônio..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#E6EAF6] outline-none placeholder:text-[#5E6884]"
              />
            </label>
            <p className="whitespace-nowrap text-xs text-[#8A93B2]">
              <span className="font-semibold text-[#B4C6F6]">2 de 3</span> itens
              com você
            </p>
          </header>

          <section className="flex flex-col gap-5 px-5 py-6 md:gap-[22px] md:px-7 md:py-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold tracking-[-0.01em]">
                  Catálogo
                </h1>
                <p className="text-[13px] text-[#8A93B2]">
                  6 equipamentos · 3 disponíveis agora
                </p>
              </div>
              <span className="rounded-full border border-[#222C4A] px-3 py-1 text-[11px] text-[#7C86A2]">
                Dados de demonstração
              </span>
            </div>

            <aside className="flex gap-3 rounded-[10px] border border-[#25408F] bg-[linear-gradient(90deg,#0E1530,#0B1128)] p-4">
              <span className="mt-px shrink-0 text-[#8AA6EE]">
                <Icon name="info" size={17} />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[13px] font-semibold text-[#E6EAF6]">
                  Regras de empréstimo
                </p>
                <p className="text-[12px] leading-relaxed text-[#9AA3BC]">
                  Até 3 itens por pessoa · prazo de 14 dias · atrasos bloqueiam
                  novas solicitações · equipamentos em manutenção não ficam
                  disponíveis.
                </p>
              </div>
            </aside>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((item) => {
                  const isActive = category === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setCategory(item)}
                      className={`rounded-full border px-3 py-[6px] text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B7FE0] ${
                        isActive
                          ? "border-[#25408F] bg-[#132663] font-semibold text-[#D6E0FB]"
                          : "border-[#222C4A] bg-transparent text-[#9AA3BC] hover:border-[#454E68] hover:text-[#E6EAF6]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={availableOnly}
                  onClick={() => setAvailableOnly((current) => !current)}
                  className={`ml-auto flex items-center gap-2 rounded-full border px-3 py-[6px] text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B7FE0] ${
                    availableOnly
                      ? "border-[#25408F] bg-[#132663] text-[#D6E0FB]"
                      : "border-[#222C4A] text-[#9AA3BC] hover:text-[#E6EAF6]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-3.5 items-center justify-center rounded border ${
                      availableOnly
                        ? "border-[#5B7FE0] bg-[#5B7FE0]"
                        : "border-[#454E68]"
                    }`}
                  >
                    {availableOnly ? (
                      <svg
                        viewBox="0 0 12 12"
                        className="size-3 text-[#080C1A]"
                      >
                        <path
                          d="m2.5 6 2.2 2.2 4.8-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    ) : null}
                  </span>
                  Só disponíveis
                </button>
              </div>

              <p className="text-xs text-[#5E6884]" aria-live="polite">
                {filteredEquipment.length}{" "}
                {filteredEquipment.length === 1
                  ? "equipamento encontrado"
                  : "equipamentos encontrados"}
              </p>
            </div>

            {filteredEquipment.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredEquipment.map((item) => (
                  <article
                    key={item.patrimony}
                    className="flex min-h-[190px] flex-col gap-3 rounded-xl border border-[#1F2949] bg-[#0E1530] p-4 transition-colors hover:border-[#3C5DBE]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[9px] bg-[#0B1128] text-[#8AA6EE]">
                        <Icon name={item.icon} size={21} />
                      </span>
                      <span
                        className={`rounded-full px-[9px] py-[3px] text-[11px] font-semibold ${statusStyles[item.status]}`}
                      >
                        {statusLabel[item.status]}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[14.5px] font-semibold text-[#E6EAF6]">
                        {item.name}
                      </h2>
                      <p className="text-xs text-[#7C86A2]">
                        {item.category} <span aria-hidden="true">·</span>{" "}
                        {item.patrimony}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#161D33] pt-3">
                      <p
                        className={`text-xs ${
                          item.status === "available"
                            ? "text-[#8AA6EE]"
                            : "text-[#7C86A2]"
                        }`}
                      >
                        {item.detail}
                      </p>
                      {item.status === "available" ? (
                        <span className="shrink-0 text-[#8AA6EE]">
                          <Icon name="arrow" size={15} />
                        </span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2 rounded-xl border border-[#1A2340] bg-[#0B1128] p-6">
                <h2 className="text-[15px] font-semibold">
                  Nenhum equipamento encontrado
                </h2>
                <p className="text-[13px] text-[#8A93B2]">
                  Ajuste a busca ou os filtros para ver outros equipamentos.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("Todos");
                    setAvailableOnly(false);
                  }}
                  className="mt-2 rounded-lg border border-[#2B3450] px-4 py-2 text-xs text-[#D6E0FB] hover:border-[#5B7FE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B7FE0]"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
