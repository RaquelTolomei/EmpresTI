"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.replace("/login");
  }
  return (
    <div className="min-h-screen bg-[#080C1A] text-[#E6EAF6] md:flex">
      <aside className="border-b border-[#1A2340] bg-[#060A16] p-5 md:min-h-screen md:w-60 md:border-r md:border-b-0">
        <Link className="text-lg font-semibold" href="/catalogo">
          EmpresTI
        </Link>
        <nav className="mt-8 flex gap-2 md:flex-col" aria-label="Navegação">
          {[
            ["/catalogo", "Catálogo"],
            ["/meus-emprestimos", "Meus empréstimos"],
            ["/operacoes/emprestimos", "Operações"],
          ].map(([href, label]) => (
            <Link
              className={`rounded-md px-3 py-2 text-sm ${pathname.startsWith(href) ? "bg-[#132663] text-[#D6E0FB]" : "text-[#8A93B2]"}`}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          className="mt-8 text-sm text-[#8A93B2]"
          onClick={signOut}
          type="button"
        >
          Sair
        </button>
      </aside>
      <main className="w-full max-w-6xl p-6 md:p-10">{children}</main>
    </div>
  );
}
