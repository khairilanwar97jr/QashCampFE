import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const bookingIdParam =
    params.get("bookingId") || params.get("booking_id") || params.get("id");
  const bookingId =
    bookingIdParam && bookingIdParam !== "undefined" && bookingIdParam !== "null"
      ? bookingIdParam
      : null;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [booking, setBooking] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [countdown, setCountdown] = useState(30);

  // High-End Premium Depth Box Shadows
  const professionalShadow = `
    0 4px 20px -2px rgba(89, 126, 82, 0.12),
    0 12px 32px -4px rgba(0, 0, 0, 0.08)
  `;

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setStatus("error");
      return;
    }

    let interval;
    let timeout;
    let initialCheck;

    const MIN_LOADING_TIME = 2500;
    const INITIAL_CHECK_DELAY = 1000;
    const STATUS_TIMEOUT = 60000;
    const startTime = Date.now();

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/booking/${bookingId}/status`
        );

        const data = await res.json();
        setBooking(data);

        if (["PAID", "DEPOSIT_PAID"].includes(data.paymentStatus)) {
          setStatus("paid");

          const fetchFullBooking = async () => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/bookings/getBooking?ref=${data.bookingRef}`
              );
              const result = await res.json();
              setBooking({
                ...result.data,
                bookingRef: result.data.booking_ref
              });
            } catch (err) {
              console.error("Failed to fetch full booking:", err);
            }
          };

          fetchFullBooking();

          const elapsed = Date.now() - startTime;
          const remaining = MIN_LOADING_TIME - elapsed;

          setTimeout(() => {
            setLoading(false);
            clearInterval(interval);
            clearTimeout(timeout);
          }, remaining > 0 ? remaining : 0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    interval = setInterval(checkStatus, 3000);

    timeout = setTimeout(() => {
      setStatus("failed");
      setLoading(false);
      clearInterval(interval);
    }, STATUS_TIMEOUT);

    initialCheck = setTimeout(checkStatus, INITIAL_CHECK_DELAY);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      clearTimeout(initialCheck);
    };
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;

    const storedPayment = sessionStorage.getItem(`qashcamp_payment:${bookingId}`);
    if (!storedPayment) return;

    try {
      setPaymentDetails(JSON.parse(storedPayment));
    } catch (err) {
      console.error("Failed to read payment details:", err);
    }
  }, [bookingId]);

  useEffect(() => {
    if (!loading && status === "paid") {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const redirect = setTimeout(() => {
        navigate("/");
      }, 30000);

      return () => {
        clearInterval(interval);
        clearTimeout(redirect);
      };
    }
  }, [loading, status, navigate]);

  const sendWhatsAppToAdmin = () => {
    if (!booking) return;

    const liveReceiptUrl = `${window.location.origin}/receipt/${booking.bookingRef}`;
    const whatsappStartDate = paymentDetails?.startDate || booking.start_date || "-";
    const whatsappEndDate = paymentDetails?.endDate || booking.end_date || "-";
    const whatsappTotal =
      paymentDetails?.paidAmount != null
        ? paymentDetails.paidAmount
        : booking.total != null
          ? (Number(booking.total) + 1.25).toFixed(2)
          : "-";
    const message = `*NEW PAYMENT SUCCESS*\n\n👤 Name: ${booking.first_name || "-"} ${booking.last_name || ""}\n🆔 Booking ID: ${booking.bookingId || bookingId}\n📅 Start: ${whatsappStartDate}\n📅 End: ${whatsappEndDate}\n📍 Location: ${booking.camp_place || "-"}\n🔖 Ref: ${booking.bookingRef || "-"}\n📦 Package: ${booking.package?.name || "N/A"}\n💰 Total: RM${whatsappTotal}\n\n🧾 Receipt:\n${liveReceiptUrl}\n`;

    const phone = "601116113722";
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // 1. PROFESSIONAL MINIMALIST LOADING STATE
  if (loading) {
    return (
      <section className="bg-[#fdf6ee] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 text-center space-y-6 border border-stone-200/60"
            style={{ boxShadow: professionalShadow }}
          >
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#C6A969]/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#597E52] animate-spin" />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-[#C6A969]">Security Gateway</span>
              <h3 className="text-xl font-semibold text-stone-800 tracking-tight">Verifying Secure Payment</h3>
              <p className="text-base font-medium text-stone-500 max-w-xs mx-auto leading-relaxed">
                Please maintain your connection while we validate the settlement record...
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // 2. REFINED CLEAN ERROR STATE
  if (status !== "paid") {
    return (
      <section className="bg-[#fdf6ee] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 text-center space-y-6 border border-red-100"
            style={{ boxShadow: professionalShadow }}
          >
            <div className="w-14 h-14 bg-red-50 rounded-full mx-auto flex items-center justify-center text-red-600 font-light text-2xl">
              ✕
            </div>

            <div className="space-y-1">
              <span className="text-sm font-semibold uppercase tracking-widest text-red-500">Verification Error</span>
              <h3 className="text-xl font-semibold text-stone-800 tracking-tight">Payment Status Incomplete</h3>
              <p className="text-base font-medium text-stone-500 max-w-xs mx-auto leading-relaxed">
                The gateway could not automatically process verification. Please query support desk parameters.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                className="w-full text-white py-3.5 rounded-xl text-sm font-semibold transition tracking-wide active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm hover:opacity-95"
                onClick={sendWhatsAppToAdmin}
                style={{ backgroundColor: "#597E52" }}
              >
                Dispatch Manual WhatsApp Log
              </button>

              <button
                className="w-full border border-stone-200 text-stone-700 bg-white py-3.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition tracking-wide active:scale-[0.99]"
                onClick={() => navigate("/")}
              >
                Return to Directory
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // 3. MAIN PRESTIGE EXECUTIVE SUCCESS STATE
  return (
    <section className="bg-[#fdf6ee] min-h-screen py-12 px-4 flex flex-col items-center justify-center">

      {/* Playful Responsive Display Title */}
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl md:text-6xl font-bold text-center mb-8"
        style={{ fontFamily: "'Fredoka One', cursive", color: "#597E52" }}
      >
        Payment Success
      </motion.h2>

      <div className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="bg-white rounded-2xl p-8 text-center space-y-6 border border-stone-200/60"
          style={{ boxShadow: professionalShadow }}
        >
          {/* Subtle Elegance Check Ring */}
          <div className="w-16 h-16 bg-[#f7fdf6] border border-emerald-200/60 rounded-full mx-auto flex items-center justify-center text-emerald-600 text-xl shadow-inner">
            ✓
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#597E52]">Transaction Approved</span>
            <h3 className="text-2xl font-semibold text-stone-800 tracking-tight">Booking Confirmed</h3>
            <p className="text-base font-medium text-stone-500 leading-relaxed">
              Thank you. Your booking record has settled successfully into our ledger system.
            </p>
          </div>

          {/* Expanded & Highly Visible Reference Block */}
          {booking?.bookingRef && (
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-stone-50 border border-stone-200/60 rounded-xl p-4 text-center space-y-1.5"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-stone-400">
                Booking Reference Token
              </span>
              <div className="font-mono text-xl md:text-2xl font-bold text-[#597E52] tracking-wide select-all">
                {booking.bookingRef}
              </div>
            </motion.div>
          )}

          {/* Minimalist Corporate Receipt Layout */}
          <div className="border border-stone-100 rounded-xl bg-stone-50/50 overflow-hidden divide-y divide-stone-100 text-left">
            <div className="p-3.5 flex justify-between items-center text-sm font-semibold uppercase tracking-wider bg-[#ffe5cc]/30 text-stone-500">
              <span>Overview Detail</span>
              <span className="text-[#597E52]">System State</span>
            </div>

            <div className="p-3.5 flex justify-between items-center text-base font-medium">
              <span className="text-stone-500">Booking Identifier</span>
              <span className="font-semibold text-stone-800 text-right">
                #{booking?.bookingId || bookingId}
              </span>
            </div>
          </div>

          {/* Premium Clean Auto-Redirect Status Banner */}
          <div className="text-sm font-medium text-stone-500 flex items-center justify-center gap-2 bg-stone-50 py-2.5 px-3 rounded-lg border border-stone-100">
            <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-pulse" />
            Auto-routing back to home registry dashboard in <strong className="text-stone-800 font-bold">{countdown}s</strong>
          </div>

          {/* High-End Clean UI Buttons with WhatsApp Priority Highlight */}
          <div className="space-y-3 pt-1">
            <motion.button
              animate={{
                x: [0, -7, 7, -6, 6, -3, 3, 0],
                rotate: [0, -1.5, 1.5, -1, 1, 0, 0, 0],
              }}
              transition={{
                duration: 0.65,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1.8,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-4 rounded-xl text-sm font-bold tracking-wide transition flex items-center justify-center gap-2.5 shadow-lg hover:brightness-105"
              onClick={sendWhatsAppToAdmin}
              style={{ backgroundColor: "#25D366", boxShadow: "0 8px 22px rgba(37, 211, 102, 0.3)" }}
            >
              <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
              Send WhatsApp Receipt
            </motion.button>

            <button
              className="w-full bg-white text-stone-700 border border-stone-200 py-3.5 rounded-xl text-sm font-semibold hover:bg-stone-50 transition tracking-wide active:scale-[0.99]"
              onClick={() => navigate("/")}
            >
              Return Home Now
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
