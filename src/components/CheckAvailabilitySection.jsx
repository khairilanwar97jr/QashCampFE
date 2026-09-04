import { useState } from "react";
import { motion } from "framer-motion";
import { HashLink } from "react-router-hash-link";
import {
  CalendarDays,
  CheckCircle2,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react";

export default function CheckAvailabilitySection({ showBookNow = false, standalone = false }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const PACKAGES = [
    { key: "Awan", label: "Awan" },
    { key: "Purnama", label: "Purnama" },
    { key: "Senja", label: "Senja" },
    { key: "Lestari", label: "Lestari" },
    { key: "Embun", label: "Embun" },
    { key: "Aurora", label: "Aurora" },
    { key: "Rimbayu", label: "Rimbayu" },
  ];

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setAvailabilityResult([]);
    setShowResult(false);
    setErrorMessage("");
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const handleCheck = async (e) => {
    e?.preventDefault();
    if (!fromDate || !toDate) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/packages/availability?startDate=${fromDate}&endDate=${toDate}`
      );

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();

      const result = PACKAGES.map((pkg) => ({
        name: pkg.label,
        status: data[pkg.key] ? "available" : "not_available",
      }));

      setAvailabilityResult(result);
      setShowResult(true);
    } catch (err) {
      console.error("Failed to check availability", err);
      setErrorMessage(
        "We couldn't check availability right now. Please try again in a moment."
      );
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  };

  if (standalone) {
    const availableCount = availabilityResult.filter(
      (pkg) => pkg.status === "available"
    ).length;

    return (
      <section className="min-h-[75vh] bg-[linear-gradient(180deg,#F0DFC0_0%,#FFF8EA_48%,#E9D2A8_100%)] px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#191C1A] text-[#F4C95D] shadow-[0_8px_20px_rgba(25,28,26,0.28)]">
              <CalendarDays className="h-7 w-7" />
            </div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#765719]">
              QashCamp
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[#191C1A] sm:text-5xl">
              Check Tent Availability
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-relaxed text-[#514B3F] sm:text-base">
              Select your camping dates and we’ll show you which tent packages are ready for your trip.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#BDA56D] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#365132]">
              <span className="relative h-3.5 w-3.5">
                <RefreshCcw className="absolute inset-0 h-3.5 w-3.5 animate-availability-sync text-[#597E52]" />
                <CheckCircle2 className="absolute inset-0 h-3.5 w-3.5 animate-availability-done text-emerald-700" />
              </span>
              {loading ? "Checking live inventory..." : "Live availability system"}
            </div>
          </div>

          <form
            onSubmit={handleCheck}
            className="animate-availability-card-sync rounded-[28px] border-2 border-[#C6A969] bg-[#597E52] p-5 shadow-[0_20px_60px_rgba(54,81,50,0.28)] sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block rounded-2xl border-2 border-[#C6A969] bg-[#FFF9EF] p-4">
                <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#365132]">
                  <CalendarDays className="h-4 w-4" /> Start Date
                </span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  min={today}
                  max={toDate || undefined}
                  className="w-full bg-transparent py-2 text-base font-bold text-[#191C1A] outline-none"
                />
              </label>

              <label className="block rounded-2xl border-2 border-[#C6A969] bg-[#FFF9EF] p-4">
                <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#365132]">
                  <CalendarDays className="h-4 w-4" /> End Date
                </span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || today}
                  className="w-full bg-transparent py-2 text-base font-bold text-[#191C1A] outline-none"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !fromDate || !toDate}
              className="mt-5 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#C6A969] px-5 py-3.5 text-sm font-black uppercase tracking-wider text-[#191C1A] shadow-[0_6px_0_#876F3C] transition hover:bg-[#D8BD7B] active:translate-y-1 active:shadow-[0_2px_0_#876F3C] disabled:cursor-not-allowed disabled:bg-stone-500 disabled:text-stone-300 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <RefreshCcw className="h-5 w-5 animate-spin" /> Checking dates...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" /> Check Availability
                </>
              )}
            </button>

            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:text-[#F4DCA3]"
              >
                <RefreshCcw className="h-4 w-4" /> Clear dates
              </button>
            )}

            {errorMessage && (
              <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-700">
                {errorMessage}
              </p>
            )}
          </form>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="mb-4 flex items-end justify-between gap-4 px-1">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#765719]">Your Results</p>
                  <h2 className="mt-1 text-xl font-black text-[#191C1A]">
                    {availableCount} {availableCount === 1 ? "tent" : "tents"} available
                  </h2>
                </div>
                <p className="text-right text-xs font-bold text-[#777267]">
                  {fromDate}<br />to {toDate}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {availabilityResult.map((pkg) => {
                  const available = pkg.status === "available";
                  return (
                    <div
                      key={pkg.name}
                      className={`flex items-center justify-between rounded-2xl border p-4 shadow-sm ${
                        available
                          ? "border-[#245C3B] bg-[#2F714A] text-white"
                          : "border-[#9D3D38] bg-[#B94A45] text-white"
                      }`}
                    >
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Package</p>
                        <p className="text-lg font-black text-white">
                          {pkg.name}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black ${
                        available
                          ? "bg-white text-[#245C3B]"
                          : "bg-white text-[#8E3531]"
                      }`}>
                        {available ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {available ? "Available" : "Booked"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {showBookNow && availableCount > 0 && (
                <HashLink
                  smooth
                  to="/#choosePackage"
                  className="mt-6 flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-[#191C1A] px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_6px_0_#597E52] transition hover:bg-[#43613D] active:translate-y-1 active:shadow-[0_2px_0_#43613D]"
                >
                  Book Now
                </HashLink>
              )}
            </motion.div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-[#fdf6ee] px-4 py-14">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 text-center text-3xl font-bold md:text-6xl"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "#597E52",
          }}
        >
          Check Availability
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="overflow-hidden rounded-2xl bg-[#C6A969]"
          style={{
            boxShadow: `
              0 18px 45px rgba(25, 28, 26, 0.16),
              0 5px 0 rgba(89, 126, 82, 0.28)
            `,
          }}
        >
          <div className="bg-[#191C1A] px-5 py-4 text-left md:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#597E52] text-white">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C6A969]">
                  Live Date Check
                </p>
                <p className="text-sm font-semibold text-white">
                  Pick your rental period to view package availability.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCheck} className="space-y-5 p-5 md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-[#fff7ed] p-4 text-left shadow-sm ring-1 ring-[#e2c8aa]">
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#597E52]">
                  <CalendarDays className="h-4 w-4" />
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  min={today}
                  max={toDate || undefined}
                  className="w-full rounded-lg border border-[#e2c8aa] bg-white px-3 py-3 text-base font-semibold text-gray-800 outline-none transition focus:border-[#597E52] focus:ring-2 focus:ring-[#597E52]/25"
                />
              </div>

              <div className="rounded-xl bg-[#fff7ed] p-4 text-left shadow-sm ring-1 ring-[#e2c8aa]">
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#597E52]">
                  <CalendarDays className="h-4 w-4" />
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || today}
                  className="w-full rounded-lg border border-[#e2c8aa] bg-white px-3 py-3 text-base font-semibold text-gray-800 outline-none transition focus:border-[#597E52] focus:ring-2 focus:ring-[#597E52]/25"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="submit"
                disabled={loading || !fromDate || !toDate}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#597E52] px-5 py-3 font-black uppercase tracking-wide text-white shadow-[0_4px_0_#3b5435] transition hover:bg-[#4f7249] active:translate-y-0.5 active:shadow-[0_2px_0_#3b5435] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Check Availability</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={!fromDate && !toDate}
                className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-5 py-3 font-black uppercase tracking-wide transition ${
                  fromDate || toDate
                    ? "bg-[#fff7ed] text-[#597E52] ring-2 ring-[#e2c8aa] hover:bg-white"
                    : "cursor-not-allowed bg-gray-200 text-gray-500"
                }`}
              >
                <RefreshCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mx-5 mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 md:mx-8 md:mb-8">
              {errorMessage}
            </div>
          )}
        </motion.div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            <div
              className="inline-block min-w-full overflow-hidden rounded-2xl bg-white text-left"
              style={{
                boxShadow: `
                  0 16px 40px rgba(25, 28, 26, 0.12),
                  0 4px 0 rgba(198, 169, 105, 0.28)
                `,
              }}
            >
              <div className="border-b border-[#e2c8aa] bg-[#191C1A] px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C6A969]">
                  Availability Result
                </p>
                <p className="text-sm font-semibold text-white">
                  {fromDate} to {toDate}
                </p>
              </div>

              <table className="w-full overflow-hidden">
                <thead>
                  <tr className="bg-[#fff7ed]">
                    <th className="p-4 text-left text-xs font-black uppercase tracking-wider text-[#597E52]">
                      Package
                    </th>
                    <th className="p-4 text-left text-xs font-black uppercase tracking-wider text-[#597E52]">
                      Availability
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {availabilityResult.map((pkg) => (
                    <tr
                      key={pkg.name}
                      className={`border-t border-[#f0dfcb] ${
                        pkg.status === "available"
                          ? "bg-emerald-50/45"
                          : "bg-red-200"
                      }`}
                    >
                      <td
                        className={`p-4 text-left font-bold ${
                          pkg.status === "available"
                            ? "text-emerald-900"
                            : "text-red-950"
                        }`}
                      >
                        {pkg.name}
                      </td>
                      <td className="p-4 text-left">
                        {pkg.status === "available" ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-black text-white ring-1 ring-emerald-700/20">
                            <CheckCircle2 className="h-4 w-4" />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-700 bg-white px-3 py-1.5 text-sm font-black text-red-700 shadow-sm">
                            <XCircle className="h-4 w-4" />
                            Not Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {showBookNow && availabilityResult.some((pkg) => pkg.status === "available") && (
                <div className="border-t border-[#e2c8aa] bg-[#fff7ed] p-5">
                  <p className="mb-3 text-center text-sm font-semibold text-[#5e5847]">
                    Found a tent you like? View the full packages and continue from our homepage.
                  </p>
                  <HashLink
                    smooth
                    to="/#choosePackage"
                    className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#191C1A] px-5 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_0_#597E52] transition hover:bg-[#597E52] active:translate-y-0.5 active:shadow-[0_2px_0_#3b5435]"
                  >
                    Book Now
                  </HashLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
