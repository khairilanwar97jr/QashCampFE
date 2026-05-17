import { useEffect, useState } from "react";

export default function LatestBookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const getPaymentBadge = (status) => {
    switch (status) {
      case "PAID":
        return "bg-[#597E52] text-white";
      case "DEPOSIT_PAID":
        return "bg-[#fff7ed] text-[#C6A969] border border-[#bfa363]";
      case "FAILED":
        return "bg-rose-100 text-rose-800";
      case "EXPIRED":
        return "bg-neutral-200 text-neutral-600";
      default:
        return "bg-neutral-800 text-white";
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/bookings/latest`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error(err));
  }, []);

  const sendWhatsApp = (b) => {
    const message = `*Receipt Request*\n\n👤 *Name:* ${b.first_name} ${b.last_name}\n🆔 *Booking ID:* ${b.id}\n📅 *Start:* ${b.start_date}\n📅 *End:* ${b.end_date}\n📍 *Location:* ${b.camp_place}\n🔖 *Ref:* ${b.booking_ref}\n📦 *Package:* ${b.package?.name || "N/A"}\n💰 *Total:* RM${b.total}`;

    const phone = "60173469335";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Shared explicitly bold border styles to override CSS overrides
  const explicitGridStyle = {
    border: "2px solid #C6A969",
    borderCollapse: "collapse"
  };

  const cellBorderStyle = {
    borderBottom: "2px solid #C6A969",
    borderRight: "2px solid #C6A969"
  };

  return (
    <div className="w-full py-16 bg-[#fdf6ee] text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <h2 
            className="text-3xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#597E52" }}
          >
            Latest Bookings
          </h2>
        </div>

        {/* ================= DESKTOP VIEW (Explicitly Hardcoded Grid Layout) ================= */}
        <div 
          className="hidden md:block bg-[#fff7ed] rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
          style={{
            boxShadow: `
              0 4px 6px rgba(0,0,0,0.15),
              0 10px 20px rgba(0,0,50,0.08),
              0 20px 40px rgba(0,0,50,0.06)
            `,
            border: "3px solid #bfa363"
          }}
        >
          <div className="overflow-hidden rounded-xl">
            <table className="w-full text-left table-auto text-sm" style={explicitGridStyle}>
              <thead>
                <tr className="bg-[#C6A969] text-white font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Customer Name</th>
                  <th className="py-4 px-5" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Created At</th>
                  <th className="py-4 px-5" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Start Date</th>
                  <th className="py-4 px-5" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>End Date</th>
                  <th className="py-4 px-6" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Camp Location</th>
                  <th className="py-4 px-5 text-center w-36" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Status</th>
                  <th className="py-4 px-6 text-right w-32" style={{ borderBottom: "3px solid #bfa363" }}>Action</th>
                </tr>
              </thead>

              <tbody className="bg-[#fff7ed] text-gray-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#fbf1e3] transition-colors duration-150">
                    <td className="py-4 px-6 font-bold text-gray-900" style={cellBorderStyle}>
                      {b.first_name} {b.last_name}
                    </td>
                    <td className="py-4 px-5 text-gray-500 font-mono text-xs whitespace-nowrap" style={cellBorderStyle}>
                      {new Date(b.createddate).toISOString().split("T")[0]}
                    </td>
                    <td className="py-4 px-5 font-mono text-xs whitespace-nowrap" style={cellBorderStyle}>{b.start_date}</td>
                    <td className="py-4 px-5 font-mono text-xs whitespace-nowrap" style={cellBorderStyle}>{b.end_date}</td>
                    <td className="py-4 px-6 truncate max-w-[220px] text-gray-600" style={cellBorderStyle}>{b.camp_place}</td>
                    <td className="py-4 px-5 text-center whitespace-nowrap" style={cellBorderStyle}>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${getPaymentBadge(b.payment_status)}`}>
                        {b.payment_status?.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right" style={{ borderBottom: "2px solid #C6A969" }}>
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="bg-[#597E52] hover:bg-[#466340] text-white font-medium text-xs py-2 px-4 rounded-xl transition-all duration-200 shadow-xs"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MOBILE VIEW (Thick Pillow-Cushion Cards) ================= */}
        <div className="md:hidden space-y-6">
          {bookings.map((b) => (
            <div 
              key={b.id} 
              className="bg-[#C6A969] rounded-2xl p-4 flex flex-col justify-between text-left border-2 border-[#bfa363]"
              style={{
                boxShadow: `
                  0 4px 6px rgba(0,0,0,0.15),
                  0 10px 20px rgba(0,0,50,0.08)
                `
              }}
            >
              <div className="bg-[#fff7ed] rounded-xl p-4 space-y-3 border border-[#e2c8aa]">
                <div className="flex items-center justify-between gap-3 border-b-2 border-[#e2c8aa] pb-3">
                  <h3 className="font-bold text-base text-gray-900 tracking-tight">
                    {b.first_name} {b.last_name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide shrink-0 ${getPaymentBadge(b.payment_status)}`}>
                    {b.payment_status?.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Created:</span>
                    <span className="font-mono">{new Date(b.createddate).toISOString().split("T")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Timeline:</span>
                    <span className="font-semibold text-gray-900">{b.start_date} → {b.end_date}</span>
                  </div>
                  <div className="flex flex-col pt-2 border-t-2 border-dashed border-[#e2c8aa] mt-2">
                    <span className="text-gray-400 font-medium mb-1">Camp Location:</span>
                    <span className="text-gray-800 font-medium truncate">{b.camp_place}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBooking(b)}
                  className="w-full bg-[#597E52] hover:bg-[#466340] text-white font-semibold text-xs py-3 rounded-xl transition-all duration-200 mt-2 shadow-xs"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ================= MODAL RECEIPT POPUP ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-200">
          <div 
            className="bg-[#C6A969] rounded-2xl w-full max-w-md p-4 relative flex flex-col border-2 border-[#bfa363] animate-in fade-in zoom-in-95 duration-150"
            style={{
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
            }}
          >
            <div className="bg-[#fff7ed] rounded-xl p-6 relative border border-[#e2c8aa]">
              
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-[#fdf6ee] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-6">
                <h3 
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontFamily: "'Fredoka One', cursive", color: "#597E52" }}
                >
                  Booking Summary
                </h3>
              </div>

              <div className="space-y-3 text-xs border-t-2 border-b-2 border-[#e2c8aa] py-4 my-1 text-left">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-gray-400 font-medium">Customer</span>
                  <span className="text-gray-900 font-bold text-right">
                    {selectedBooking.first_name} {selectedBooking.last_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Booking ID</span>
                  <span className="text-gray-800 font-mono">#{selectedBooking.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Reference</span>
                  <span className="text-gray-800 font-mono bg-[#fdf6ee] px-1.5 py-0.5 rounded border border-[#bfa363] select-all">{selectedBooking.booking_ref}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Created</span>
                  <span className="text-gray-600 font-mono">
                    {new Date(selectedBooking.createddate).toISOString().split("T")[0]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Timeline</span>
                  <span className="text-gray-900 font-semibold">
                    {selectedBooking.start_date} → {selectedBooking.end_date}
                  </span>
                </div>
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-gray-400 font-medium">Destination</span>
                  <span className="text-gray-700 text-right truncate max-w-[200px]">
                    {selectedBooking.camp_place}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Package Kit</span>
                  <span className="text-gray-800 font-medium bg-[#fdf6ee] border border-[#e2c8aa] px-2 py-0.5 rounded-md text-[11px]">{selectedBooking.package?.name || "Standard Kit"}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-dashed border-[#e2c8aa] mt-2">
                  <span className="text-gray-400 font-medium">Status</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getPaymentBadge(selectedBooking.payment_status)}`}>
                    {selectedBooking.payment_status?.replaceAll("_", " ")}
                  </span>
                </div>
              </div>

              <div className="bg-[#fdf6ee] rounded-xl p-4 flex justify-between items-center mt-3 border border-[#bfa363]">
                <span className="text-xs font-bold text-[#C6A969] uppercase tracking-wider">Total Settlement</span>
                <span className="font-bold text-xl text-gray-900">
                  RM {selectedBooking.total_paid ?? selectedBooking.total}
                </span>
              </div>

              <div className="mt-6 flex gap-3 text-xs font-semibold">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 border border-[#e2c8aa] hover:bg-[#fdf6ee] text-gray-600 hover:text-gray-900 py-3.5 rounded-xl transition-all duration-150"
                >
                  Close
                </button>

                <button
                  onClick={() => sendWhatsApp(selectedBooking)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-md"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.006 5.256 5.261 0 11.748 0c3.141.001 6.098 1.223 8.322 3.451C22.294 5.68 23.514 8.634 23.514 11.78c-.004 6.495-5.259 11.753-11.743 11.753-2.007-.001-3.982-.51-5.732-1.48L0 24zm6.49-3.414c1.658.984 3.284 1.498 4.981 1.5 5.421 0 9.833-4.385 9.836-9.778.003-2.613-1.011-5.068-2.858-6.918-1.847-1.85-4.307-2.869-6.924-2.87-5.422 0-9.835 4.386-9.839 9.779-.001 1.77.472 3.498 1.371 5.018l-.973 3.548 3.652-.951z" />
                  </svg>
                  <span>WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}