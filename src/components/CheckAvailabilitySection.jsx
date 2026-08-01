import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react";

export default function CheckAvailabilitySection() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
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
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const handleCheck = async (e) => {
    e?.preventDefault();
    if (!fromDate || !toDate) return;

    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

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
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
