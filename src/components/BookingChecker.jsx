import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ExistingBookingSection() {
  const [bookingRef, setBookingRef] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCheckBooking = async () => {
    if (!bookingRef) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/bookings/getBooking?ref=${bookingRef}`
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Booking not found");
        return;
      }

      // ✅ go to booking page WITH data
      navigate(`/booking/${bookingRef}`, {
        state: { booking: data.data },
      });

    } catch (err) {
      console.error(err);
      alert("Error checking booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#fdf6ee] py-14 px-4">
      <div className="max-w-3xl mx-auto">

        <h2
          className="text-3xl md:text-5xl font-bold text-center mb-10"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "#597E52",
          }}
        >
          Already Have Booking?
        </h2>

        <div
          className="bg-[#C6A969] rounded-2xl p-6 md:p-8 space-y-5"
          style={{
            boxShadow: `
              0 4px 6px rgba(0,0,0,0.2),
              0 10px 20px rgba(0,0,50,0.1),
              0 20px 40px rgba(0,0,50,0.08)
            `,
          }}
        >

          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Booking Reference
            </label>

            <input
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="Example: QC-20260514-HK8F1"
              className="w-full bg-[#fff7ed] border border-[#e2c8aa]
              rounded-lg p-4 text-base text-gray-800
              focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
            />
          </div>

          <button
            onClick={handleCheckBooking}
            disabled={!bookingRef || loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl
            font-semibold hover:bg-green-700 transition
            disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Booking"}
          </button>

        </div>

      </div>
    </section>
  );
}