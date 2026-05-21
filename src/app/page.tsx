import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faf6] text-[#17211c]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
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

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#a4472a]">
              Free AI spend audit
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal text-[#17211c] sm:text-6xl lg:text-7xl">
              See where your startup is overspending on AI tools.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4b5c51]">
              AIBillFIX turns AI subscriptions, seats, direct API usage, and
              team size into a clear savings estimate with practical
              recommendations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-md bg-[#176b4d] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#12563d]"
                href="#assessment-status"
              >
                View build status
              </a>
              <a
                className="rounded-md border border-[#b9c3b1] px-5 py-3 text-center text-sm font-semibold text-[#17211c] transition hover:bg-white"
                href="#scope"
              >
                See MVP scope
              </a>
            </div>
          </section>

          <section
            aria-label="AICostLens audit preview"
            className="grid gap-4 rounded-lg border border-[#d8dfd2] bg-white p-5 shadow-[0_20px_70px_rgba(23,33,28,0.08)]"
          >
            <div className="flex items-center justify-between border-b border-[#e4eadf] pb-4">
              <div>
                <p className="text-sm font-medium text-[#64766b]">
                  Estimated monthly savings
                </p>
                <p className="mt-1 text-4xl font-semibold text-[#176b4d]">
                  $1,240
                </p>
              </div>
              <span className="rounded-md bg-[#ffe8d6] px-3 py-2 text-sm font-semibold text-[#a4472a]">
                Preview
              </span>
            </div>

            <div className="grid gap-3">
              {[
                ["Cursor Business", "Review unused seats", "$320"],
                ["Claude Team", "Check plan fit", "$180"],
                ["OpenAI API direct", "Evaluate credits", "$740"],
              ].map(([tool, action, savings]) => (
                <article
                  className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-[#e4eadf] p-4"
                  key={tool}
                >
                  <div>
                    <h2 className="text-sm font-semibold text-[#17211c]">
                      {tool}
                    </h2>
                    <p className="mt-1 text-sm text-[#64766b]">{action}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#176b4d]">
                    {savings}
                  </p>
                </article>
              ))}
            </div>

            <p className="rounded-md bg-[#f8faf6] p-4 text-sm leading-6 text-[#4b5c51]">
              Phase 1 sets up the product shell. Real audit math, validated
              pricing data, storage, email, and share links will arrive in later
              phases.
            </p>
          </section>
        </div>

        <section
          className="grid gap-4 border-t border-[#d8dfd2] py-8 md:grid-cols-3"
          id="scope"
        >
          <div>
            <h2 className="text-base font-semibold">Deterministic audit</h2>
            <p className="mt-2 text-sm leading-6 text-[#64766b]">
              Savings will come from clear rules instead of AI-generated math.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold">Founder-friendly output</h2>
            <p className="mt-2 text-sm leading-6 text-[#64766b]">
              Results will explain waste, efficient stacks, and Credex-fit
              opportunities.
            </p>
          </div>
          <div id="assessment-status">
            <h2 className="text-base font-semibold">Current phase</h2>
            <p className="mt-2 text-sm leading-6 text-[#64766b]">
              Setup, repo structure, landing page, and documentation
              placeholders.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
