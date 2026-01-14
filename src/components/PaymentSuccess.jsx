import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingId = params.get("bookingId");

    // Optional: call backend to confirm payment
    // fetch(`${API_URL}/api/bookings/${bookingId}/status`).then(...)

    // Auto-redirect home after 5 sec
    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Payment Successful! 🎉
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        Thank you for your booking. Your adventure awaits!
      </p>
      <p className="text-gray-500">You will be redirected shortly...</p>
    </div>
  );
}
