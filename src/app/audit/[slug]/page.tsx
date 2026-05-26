import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicAuditBySlug } from "@/lib/storage/audits";

type PublicAuditPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicAuditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const audit = await getPublicAuditBySlug(slug);

  if (!audit) {
    return {
      title: "AIBillFIX audit not found",
    };
  }

  const title = `${formatUsd(audit.monthlySavings)} monthly AI savings | AIBillFIX`;
  const description = `A public AIBillFIX audit found ${formatUsd(
    audit.annualSavings,
  )} in estimated annual AI tool savings.`;

  return {
    description,
    openGraph: {
      description,
      title,
      type: "article",
    },
    title,
    twitter: {
      card: "summary",
      description,
      title,
    },
  };
}

export default async function PublicAuditPage({ params }: PublicAuditPageProps) {
  const { slug } = await params;
  const audit = await getPublicAuditBySlug(slug);

  if (!audit) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8faf6] text-[#17211c]">
      <a className="skip-link" href="#public-audit">
        Skip to audit
      </a>
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-[#d8dfd2] pb-5">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            AIBillFIX
          </Link>
          <Link
            className="rounded-md bg-[#17211c] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#2d3a33]"
            href="/"
          >
            Run your audit
          </Link>
        </header>

        <section className="py-10" id="public-audit">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#a4472a]">
            Public AI spend audit
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            {formatUsd(audit.monthlySavings)} estimated monthly savings
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#4b5c51]">
            This public page strips contact details and shows only tools,
            savings, and recommendations from the audit.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="Annual savings" value={formatUsd(audit.annualSavings)} />
          <Metric
            label="Current monthly spend"
            value={formatUsd(audit.currentMonthlySpend)}
          />
          <Metric
            label="Optimized monthly spend"
            value={formatUsd(audit.optimizedMonthlySpend)}
          />
          <Metric label="Tools audited" value={String(audit.tools.length)} />
        </section>

        {audit.summary ? (
          <section className="mt-6 rounded-lg border border-[#d8dfd2] bg-white p-5 shadow-[0_18px_55px_rgba(23,33,28,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a4472a]">
              Summary
            </p>
            <p className="mt-3 text-sm leading-6 text-[#4b5c51]">
              {audit.summary.text}
            </p>
          </section>
        ) : null}

        <section className="mt-6 rounded-lg border border-[#d8dfd2] bg-white p-5 shadow-[0_18px_55px_rgba(23,33,28,0.08)]">
          <h2 className="text-lg font-semibold">Per-tool recommendations</h2>
          <div className="mt-4 space-y-3">
            {audit.result.recommendations.map((recommendation, index) => (
              <article
                className="rounded-lg border border-[#e4eadf] p-4"
                key={`${recommendation.toolName}-${recommendation.planName}-${index}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">
                      {recommendation.toolName} {recommendation.planName}
                    </h3>
                    <p className="mt-1 text-sm text-[#64766b]">
                      {formatUsd(recommendation.currentMonthlySpend)} to{" "}
                      {formatUsd(recommendation.recommendedMonthlySpend)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#176b4d]">
                    {formatUsd(recommendation.monthlySavings)}
                  </p>
                </div>
                <p className="mt-3 text-sm font-medium">
                  {recommendation.action}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#64766b]">
                  {recommendation.reason}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d8dfd2] bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#64766b]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
