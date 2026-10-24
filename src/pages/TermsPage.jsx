import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import watermarkLogo from "../assets/qashcamp-navbar-invert-optimized.png";
import { cancellationRules, rentalTerms } from "../data/rentalTerms";

export default function TermsPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-[#F7F1DE] text-[#263D32]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 flex select-none items-center justify-center overflow-hidden">
        <img src={watermarkLogo} alt="" width="668" height="319" draggable="false"
          className="w-[88vw] max-w-[800px] -rotate-12 opacity-[0.10]" />
      </div>
      <Navbar />
      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pt-36">
        <header className="max-w-3xl">
          <Link to="/" className="text-sm font-medium text-[#597E52] underline underline-offset-4">Back to home</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#597E52]">Before your next escape</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Terms &amp; Regulations</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-600">A clear guide to caring for your rental, returning your equipment, and understanding payments and refunds. Please read these terms alongside your booking confirmation before making payment.</p>
        </header>

        <section aria-labelledby="refund-summary" className="my-9 rounded-2xl bg-[#263D32] p-5 text-[#F7F1DE] md:my-12 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#E6CA8D]">Know before you pay</p>
          <h2 id="refund-summary" className="mt-2 text-2xl font-semibold">Your payment stage matters.</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3 md:gap-7">
            {cancellationRules.map((rule) => (
              <div key={rule.category} className="border-t border-white/20 pt-4">
                <h3 className="font-semibold text-[#E6CA8D]">{rule.category}</h3>
                <p className="mt-2 text-xs text-white/65">{rule.condition}</p>
                <p className="mt-3 text-sm leading-relaxed">{rule.policy}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t border-white/20 pt-4 text-sm leading-relaxed text-white/80">The refundable security deposit is separate from rental payments. These cancellation rules do not override your statutory rights. See the full conditions below.</p>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Terms sections" className="rounded-xl border border-[#C6A969]/40 p-5 lg:sticky lg:top-28">
            <h2 className="mb-3 text-sm font-bold">On this page</h2>
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {rentalTerms.map((term, index) => (
                <li key={term.id}><a href={`#${term.id}`} className="block py-1 text-sm leading-snug text-stone-600 hover:text-[#597E52] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#597E52]">{String(index + 1).padStart(2, "0")} / {term.title}</a></li>
              ))}
            </ol>
          </nav>
          <div>
            {rentalTerms.map((term, index) => (
              <section key={term.id} id={term.id} aria-labelledby={`${term.id}-title`} className="scroll-mt-28 border-t border-[#263D32]/15 py-7 first:pt-0 first:border-t-0">
                <p className="text-xs font-semibold tracking-widest text-[#597E52]">{String(index + 1).padStart(2, "0")}</p>
                <h2 id={`${term.id}-title`} className="mt-2 text-xl font-semibold md:text-2xl">{term.title}</h2>
                {term.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-7 text-stone-700 md:text-base">{paragraph}</p>)}
              </section>
            ))}
            <aside className="mt-5 border-t border-[#C6A969] pt-6">
              <h2 className="text-xl font-semibold">Need something clarified?</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">Ask us about your booking, a deposit assessment or a privacy request.</p>
              <Link to="/contact" className="mt-4 inline-block rounded-xl bg-[#597E52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#435B43]">Contact QashCamp</Link>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
