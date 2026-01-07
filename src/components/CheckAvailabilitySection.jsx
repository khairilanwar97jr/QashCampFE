import { useState } from "react";

export default function CheckAvailabilitySection() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const today = new Date().toISOString().split("T")[0]; // "2026-01-07"

  const PACKAGES = [
    { key: "Pakej A", label: "Package A" },
    { key: "Pakej B", label: "Package B" },
    { key: "Pakej C", label: "Package C" },
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
      // data example:
      // { "Pakej B": true, "Pakej C": false, "Pakej A": true }

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
    <section className="bg-[#fdf6ee] py-14 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h2
          className="text-3xl md:text-6xl font-bold text-center mb-10"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "#597E52",
          }}
        >
          Check Availability
        </h2>

        {/* Form Card ONLY */}
        <div
          className="bg-[#C6A969] rounded-2xl p-6 md:p-8 space-y-5
             transition-transform duration-300 hover:-translate-y-4"
          style={{
            boxShadow: `
              0 4px 6px rgba(0,0,0,0.2),
              0 10px 20px rgba(0,0,50,0.1),
              0 20px 40px rgba(0,0,50,0.08);
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
              <label className="block text-sm font-semibold mb-1 text-white">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                min={today} // cannot select before today
                max={toDate || undefined} // cannot go beyond To Date
                className="w-full bg-[#fff7ed] border border-[#e2c8aa] rounded-lg p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-white">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || today} // cannot select before From Date
                className="w-full bg-[#fff7ed] border border-[#e2c8aa] rounded-lg p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
              />
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
             hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Availability"}
          </button>
<button
  onClick={handleReset}
  disabled={!fromDate && !toDate}
  className={`w-full mt-2 py-3 rounded-xl font-semibold transition 
    ${fromDate || toDate 
      ? "bg-green-500 text-white hover:bg-green-600"  // active & clickable
      : "bg-gray-300 text-gray-600 cursor-not-allowed" // disabled style
    }`}
>
  Reset Dates
</button>

        </div>

        {showResult && (
          <div className="mt-10">
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
                    <th className="text-left p-4 font-semibold">Package</th>
                    <th className="text-left p-4 font-semibold">
                      Availability
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {availabilityResult.map((pkg) => (
                    <tr key={pkg.name} className="border-t">
                      <td className="p-4 font-medium">{pkg.name}</td>
                      <td className="p-4">
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
          </div>
        )}
      </div>
    </section>
  );
}
