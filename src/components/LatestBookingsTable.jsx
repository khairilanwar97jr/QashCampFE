import { useEffect, useState } from "react";

export default function LatestBookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
const API_URL = import.meta.env.VITE_API_URL;
  const getPaymentBadge = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "DEPOSIT_PAID":
        return "bg-yellow-100 text-yellow-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "EXPIRED":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/bookings/latest`)
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  const sendWhatsApp = (b) => {
    const message =
      `Receipt Request:

Name: ${b.first_name} ${b.last_name} |
Booking ID: ${b.id} |
Start: ${b.start_date} |
End: ${b.end_date} |
Location: ${b.camp_place} |
Booking Reference: ${b.booking_ref} |
Package : ${b.package.name} |
Total: RM${b.total}`;

    const phone = "60123456789"; // your number

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="mt-16 mx-auto max-w-7xl bg-white shadow-lg rounded-xl p-4 md:p-8">

      <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
        📋 Latest Bookings
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-sm md:text-base table-auto">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 border w-48">Name</th>
              <th className="py-3 px-4 border w-40">Created</th>
              <th className="py-3 px-4 border w-40">Start</th>
              <th className="py-3 px-4 border w-40">End</th>
              <th className="py-3 px-4 border">Location</th>
              <th className="py-3 px-6 border w-40">Status</th>
              <th className="py-3 px-4 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="text-center hover:bg-green-50">

                <td className="py-3 px-4 border">
                  {b.first_name} {b.last_name}
                </td>

                <td className="py-3 px-4 border whitespace-nowrap">
                  {new Date(b.createddate).toISOString().split("T")[0]}
                </td>

                <td className="py-3 px-4 border whitespace-nowrap">
                  {b.start_date}
                </td>

                <td className="py-3 px-4 border whitespace-nowrap">
                  {b.end_date}
                </td>

                <td className="py-3 px-4 border">
                  {b.camp_place}
                </td>

                <td className="py-3 px-4 border whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                      b.payment_status
                    )}`}
                  >
                    {b.payment_status.replaceAll("_", " ")}
                  </span>
                </td>

                <td className="py-3 px-4 border">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Receipt
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="md:hidden space-y-4">

        {bookings.map((b) => (
          <div key={b.id} className="border rounded-lg p-4 shadow-sm bg-white">

            <div className="font-semibold text-lg">
              {b.first_name} {b.last_name}
            </div>

            <div className="text-sm text-gray-600 mt-1">
              <p>📅 Created: {new Date(b.createddate).toISOString().split("T")[0]}</p>
              <p>🏕 Start: {b.start_date}</p>
              <p>🏕 End: {b.end_date}</p>
              <p>📍 Location: {b.camp_place}</p>
            </div>

            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                  b.payment_status
                )}`}
              >
                {b.payment_status.replaceAll("_", " ")}
              </span>
            </div>

            <button
              onClick={() => sendWhatsApp(b)}
              className="mt-3 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Send Receipt
            </button>

          </div>
        ))}

      </div>
      {/* ================= RECEIPT MODAL ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">

            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              Booking Receipt
            </h2>

            <div className="space-y-3 text-sm md:text-base">

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Name</span>
                <span>
                  {selectedBooking.first_name} {selectedBooking.last_name}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Booking ID</span>
                <span>{selectedBooking.id}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Booking Ref</span>
                <span>{selectedBooking.booking_ref}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Created</span>
                <span>
                  {new Date(selectedBooking.createddate)
                    .toISOString()
                    .split("T")[0]}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Start Date</span>
                <span>{selectedBooking.start_date}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">End Date</span>
                <span>{selectedBooking.end_date}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Location</span>
                <span>{selectedBooking.camp_place}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Package</span>
                <span>{selectedBooking.package?.name}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Payment Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentBadge(
                    selectedBooking.payment_status
                  )}`}
                >
                  {selectedBooking.payment_status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Total Paid</span>
                <span className="font-bold text-lg">
                  RM {selectedBooking.total_paid}
                </span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">

              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>

              <button
                onClick={() => sendWhatsApp(selectedBooking)}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Send WhatsApp
              </button>

            </div>

          </div>

        </div>
      )}

    </div>


  );
}