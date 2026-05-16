import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css";

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
  const [countdown, setCountdown] = useState(9);

useEffect(() => {
  if (!bookingId) {
    setLoading(false);
    setStatus("error");
    return;
  }

  let interval;
  let timeout;
  let initialCheck;

  const MIN_LOADING_TIME = 2500; // 👈 ensures spinner is visible
  const INITIAL_CHECK_DELAY = 3000;
  const STATUS_TIMEOUT = 60000;
  const startTime = Date.now();

  const checkStatus = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/booking/${bookingId}/status`
      );

      const data = await res.json();
      setBooking(data);

      // ✅ SUCCESS CASE
      if (["PAID", "DEPOSIT_PAID"].includes(data.paymentStatus)) {
        setStatus("paid");

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

  // 🔁 polling
  interval = setInterval(checkStatus, 3000);

  // 🚨 safety timeout (only if something goes wrong)
  timeout = setTimeout(() => {
    setStatus("failed");
    setLoading(false);
    clearInterval(interval);
  }, STATUS_TIMEOUT);

  // Give the backend callback a short moment to update payment status.
  initialCheck = setTimeout(checkStatus, INITIAL_CHECK_DELAY);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
    clearTimeout(initialCheck);
  };
}, [bookingId]);


  // Countdown redirect
  useEffect(() => {

    if (!loading && status === "paid") {

      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const redirect = setTimeout(() => {
        navigate("/");
      }, 9000);

      return () => {
        clearInterval(interval);
        clearTimeout(redirect);
      };
    }

  }, [loading, status, navigate]);

  // Loading UI
  if (loading) {
    return (
      <div className="success-container">
        <div className="success-card">

          <div className="loader-wrapper">
            <div className="spinner"></div>
          </div>

          <h2 className="success-title">
            Verifying Payment
          </h2>

          <p className="success-subtitle">
            Please wait while we confirm your transaction securely...
          </p>

          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </div>
    );
  }

  // Failed UI
  if (status !== "paid") {
    return (
      <div className="success-container">
        <div className="success-card">

          <div className="failed-icon">
            ❌
          </div>

          <h1 className="success-title">
            Payment Not Verified
          </h1>

          <p className="success-subtitle">
            Please contact support if payment was already made.
          </p>

          <button
            className="button"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>

        </div>
      </div>
    );
  }

  // Success UI
  return (
    <div className="success-container">
      <div className="success-card">

        <div className="success-icon">
          ✅
        </div>

        <h1 className="success-title">
          Payment Successful
        </h1>

        <p className="success-subtitle">
          Your booking has been confirmed successfully.
        </p>

        <div className="booking-box">

          <span className="booking-label">
            Booking ID
          </span>

          <div className="booking-id">
            #{booking?.bookingId || bookingId}
          </div>

        </div>

        {booking?.bookingRef && (
          <div className="booking-box">

            <span className="booking-label">
              Booking Ref
            </span>

            <div className="booking-id">
              {booking.bookingRef}
            </div>

          </div>
        )}

        <div className="countdown-box">
          Redirecting to homepage in{" "}
          <strong>{countdown}</strong>s
        </div>

        <button
          className="button"
          onClick={() => navigate("/")}
        >
          Go Home Now
        </button>

      </div>
    </div>
  );
}
