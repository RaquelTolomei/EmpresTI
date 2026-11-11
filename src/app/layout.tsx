import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc";

export const metadata: Metadata = {
  title: "EmpresTI | Catálogo de equipamentos",
  description: "Catálogo de equipamentos para empréstimo interno.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
