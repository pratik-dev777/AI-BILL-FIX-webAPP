import { AuditWorkspace } from "@/components/audit-workspace";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faf6] text-[#17211c]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[#d8dfd2] pb-5">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            AIBillFIX
          </Link>
          <a
            className="rounded-md bg-[#17211c] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#2d3a33]"
            href="mailto:hello@credex.example"
          >
            Talk to Credex
          </a>
        </header>

        <AuditWorkspace />
      </section>
    </main>
  );
}
