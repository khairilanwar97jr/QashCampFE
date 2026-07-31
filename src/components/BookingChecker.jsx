import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <section className="bg-[#fdf6ee] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 text-center sm:mb-9">
          <span className="inline-flex rounded-full border border-[#D9CAA1] bg-[#FFF9EB] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#806B3A]">
            Existing reservation
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#43613D] sm:text-4xl">
            Already have a booking?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6B665A]">
            Enter your reference number to view your reservation and complete any remaining payment.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl border border-[#E5DCB9] bg-white shadow-[0_18px_45px_rgba(67,97,61,0.12)]"
        >
          <div className="border-b border-[#EDE5CF] bg-[#F7F3E8] px-5 py-4 sm:px-7">
            <p className="text-sm font-bold text-[#544E45]">Find your reservation</p>
            <p className="mt-0.5 text-xs text-[#756F63]">Your reference was sent with your booking confirmation.</p>
          </div>

          <form
            className="space-y-5 p-5 sm:p-7"
            onSubmit={(event) => {
              event.preventDefault();
              handleCheckBooking();
            }}
          >
            <div>
              <label htmlFor="booking-reference" className="mb-2 block text-sm font-bold text-[#544E45]">
                Booking reference
              </label>
              <input
                id="booking-reference"
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                placeholder="e.g. QC-20260514-HK8F1"
                autoComplete="off"
                className="w-full rounded-xl border border-[#D9CFB2] bg-[#FFFCF5] px-4 py-3.5 text-base font-semibold text-[#3F3A32] outline-none transition placeholder:font-normal placeholder:text-stone-400 focus:border-[#43613D] focus:bg-white focus:ring-4 focus:ring-[#43613D]/10"
              />
            </div>

            <button
              type="submit"
              disabled={!bookingRef || loading}
              className="flex w-full items-center justify-center rounded-xl bg-[#43613D] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#365033] focus:outline-none focus:ring-4 focus:ring-[#43613D]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Checking reservation..." : "View booking details"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
