import { useState } from "react";
import { motion } from "framer-motion";

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
  const handleCheck = async () => {
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
    <section className="bg-[#fdf6ee] py-14 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Animated Title Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-6xl font-bold text-center mb-10"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "#597E52",
          }}
        >
          Check Availability
        </motion.h2>

        {/* Animated Form Entry Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-[#C6A969] rounded-2xl p-6 md:p-8 space-y-5
                     transition-transform duration-300 hover:-translate-y-4"
          style={{
            boxShadow: `
              0 4px 6px rgba(0,0,0,0.2),
              0 10px 20px rgba(0,0,50,0.1),
              0 20px 40px rgba(0,0,50,0.08)
            `,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = `
                0 6px 12px rgba(0,0,0,0.25),
                0 12px 24px rgba(0,0,50,0.18),
                0 24px 48px rgba(0,0,50,0.15),
                0 36px 72px rgba(0,0,50,0.12),
                0 48px 96px rgba(0,0,50,0.1)
              `)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = `
                0 4px 6px rgba(0,0,0,0.2),
                0 10px 20px rgba(0,0,50,0.1),
                0 20px 40px rgba(0,0,50,0.08)
              `)
          }
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* From Date */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-white text-left">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                min={today}
                max={toDate || undefined}
                className="w-full bg-[#fff7ed] border border-[#e2c8aa] rounded-lg p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-white text-left">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || today}
                className="w-full bg-[#fff7ed] border border-[#e2c8aa] rounded-lg p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
              />
            </div>
          </div>

          {/* Availability Check Button with Loader */}
          <button
            onClick={handleCheck}
            disabled={loading || !fromDate || !toDate}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
               hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Checking...</span>
              </>
            ) : (
              "Check Availability"
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            disabled={!fromDate && !toDate}
            className={`w-full mt-2 py-3 rounded-xl font-semibold transition 
            ${fromDate || toDate
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Reset Dates
          </button>
        </motion.div>

        {/* Results output section - Renders with smooth slide-in entry */}
        {showResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            <div
              className="inline-block min-w-full rounded-xl overflow-hidden bg-white"
              style={{
                boxShadow: `
                0 4px 6px rgba(0,0,0,0.2),
                0 10px 20px rgba(0,0,50,0.1),
                0 20px 40px rgba(0,0,50,0.08)
              `,
              }}
            >
              <table className="w-full rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#ffe5cc]">
                    <th className="text-left p-4 font-semibold text-gray-800">Package</th>
                    <th className="text-left p-4 font-semibold text-gray-800">
                      Availability
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {availabilityResult.map((pkg) => (
                    <tr key={pkg.name} className="border-t">
                      <td className="p-4 font-medium text-left text-gray-800">{pkg.name}</td>
                      <td className="p-4 text-left">
                        {pkg.status === "available" ? (
                          <span className="text-green-600 font-semibold">
                            ✅ Available
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            ❌ Not Available
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