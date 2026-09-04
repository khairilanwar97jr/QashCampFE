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
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center sm:mb-10">
          <span className="mb-4 inline-flex rounded-full border border-[#D9CAA1] bg-[#FFF9EB] px-5 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#806B3A] shadow-sm">
            Existing reservation
          </span>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              x: [0, -6, 6, -3, 3, 0],
              rotate: [0, -1.4, 1.4, -0.8, 0.8, 0],
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 3.9,
            }}
            className="mb-4 text-center text-3xl font-black tracking-tight md:text-5xl"
            style={{
              fontFamily: "'Fredoka One', cursive",
              color: "#597E52",
            }}
          >
            Already have a booking?
          </motion.h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#6B665A] sm:text-[15px]">
            Enter your reference number to view your reservation and complete any remaining payment.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden rounded-[28px] border border-[#C9AF71] bg-[#FFF9EE] shadow-[0_20px_60px_rgba(67,97,61,0.18)] backdrop-blur"
        >
          <div className="flex flex-col gap-3 border-b-2 border-[#C6A969] bg-[#365132] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-base font-extrabold tracking-[0.02em] text-white">Find your reservation</p>
              <p className="mt-1 text-xs font-medium text-[#E9E2D0]">Your reference was sent with your booking confirmation.</p>
            </div>
            <div className="inline-flex w-fit items-center rounded-full border border-[#E5CF91] bg-[#C6A969] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#191C1A] shadow-sm">
              Secure lookup
            </div>
          </div>

          <form
            className="space-y-5 p-5 sm:p-7"
            onSubmit={(event) => {
              event.preventDefault();
              handleCheckBooking();
            }}
          >
            <div>
              <label htmlFor="booking-reference" className="mb-2 block text-sm font-bold text-[#3A362D]">
                Booking reference
              </label>
              <div className="rounded-2xl border border-[#B89553] bg-[#FFF9ED] p-[1px] shadow-[0_10px_28px_rgba(67,97,61,0.08)] transition focus-within:border-[#31502E] focus-within:ring-4 focus-within:ring-[#31502E]/14">
                <input
                  id="booking-reference"
                  type="text"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="e.g. QC-20260514-HK8F1"
                  autoComplete="off"
                  className="w-full rounded-[15px] bg-[#FFF9ED] px-4 py-3.5 text-base font-semibold text-[#2F312C] outline-none transition placeholder:font-normal placeholder:text-stone-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!bookingRef || loading}
              className="flex w-full items-center justify-center rounded-2xl bg-[#31502E] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(49,80,46,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#284326] hover:shadow-[0_16px_36px_rgba(49,80,46,0.34)] focus:outline-none focus:ring-4 focus:ring-[#31502E]/20 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? "Checking reservation..." : "View booking details"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
