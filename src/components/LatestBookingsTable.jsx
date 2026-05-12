import { useEffect, useState } from "react";

export default function LatestBookingsTable() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings/latest")
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  const sendWhatsApp = (b) => {
    const message = 
`Receipt Request:

Name: ${b.first_name} ${b.last_name}
Booking ID: ${b.id}
Start: ${b.start_date}
End: ${b.end_date}
Total: RM${b.total}`;

    const phone = "60123456789"; // your number

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="mt-16 mx-auto max-w-5xl bg-white shadow-lg rounded-xl p-6">

      <h2 className="text-2xl font-bold text-center mb-6">
        📋 Latest Bookings
      </h2>

      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">

        <thead className="bg-green-600 text-white">
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Start</th>
            <th className="py-2 px-4 border">End</th>
            <th className="py-2 px-4 border">Location</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="text-center hover:bg-green-50">

              <td className="py-2 px-4 border">
                {b.first_name} {b.last_name}
              </td>

              <td className="py-2 px-4 border">
                {b.start_date}
              </td>

              <td className="py-2 px-4 border">
                {b.end_date}
              </td>

              <td className="py-2 px-4 border">
                {b.camp_place}
              </td>

              <td className="py-2 px-4 border">
                <span className={b.payment_status === "PAID" ? "text-green-600" : "text-red-500"}>
                  {b.payment_status}
                </span>
              </td>

              <td className="py-2 px-4 border">
                <button
                  onClick={() => sendWhatsApp(b)}
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
  );
}