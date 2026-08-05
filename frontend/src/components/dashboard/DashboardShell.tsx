"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CalendarCheck, Clock, LogOut, Scissors } from "lucide-react";

import { clearToken, getToken } from "@/lib/auth";

const LINKS = [
  { href: "/dashboard", label: "Agendamentos", icon: CalendarCheck },
  { href: "/dashboard/servicos", label: "Serviços", icon: Scissors },
  { href: "/dashboard/horarios", label: "Horários", icon: Clock },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/dashboard/login");
      return;
    }
    setPronto(true);
  }, [router]);

  function sair() {
    clearToken();
    router.push("/dashboard/login");
  }

  if (!pronto) {
    return <div className="flex min-h-screen items-center justify-center bg-cream text-ink-soft">Carregando…</div>;
  }

  return (
    <div className="flex min-h-screen bg-cream-deep/40">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-brand-200/50 bg-white px-4 py-6 sm:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <Image src="/images/logo.png" alt="Bellas Nail" width={36} height={36} className="rounded-full" />
          <span className="font-display font-semibold text-brand-700">Bellas Nail</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {LINKS.map((link) => {
            const ativo = pathname === link.href;
            const Icone = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  ativo ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-brand-50/60"
                }`}
              >
                <Icone className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={sair}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-50/60"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-brand-200/50 bg-white px-4 py-3 sm:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Bellas Nail" width={32} height={32} className="rounded-full" />
            <span className="font-display font-semibold text-brand-700">Bellas Nail</span>
          </Link>
          <button onClick={sair} className="text-ink-soft">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-brand-200/50 bg-white px-3 py-2 sm:hidden">
          {LINKS.map((link) => {
            const ativo = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
                  ativo ? "bg-brand-500 text-white" : "text-ink-soft"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
