import { useEffect, useState } from "react";

export default function LatestBookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // ⏳ NEW: Tracks initial data fetching state to trigger skeleton frames
  const [loadingTable, setLoadingTable] = useState(true);
  
  // 📸 CHANGED: Holds both snapshots together as an object
  const [snapshots, setSnapshots] = useState({ initial: null, final: null });
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);

  // 🔒 AUTHENTICATION STATES
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const ADMIN_PASSCODE = "CAMP97"; 

  // 1. Fetch table rows immediately for the public layout view
  useEffect(() => {
    setLoadingTable(true); // ◄ Start loading animation
    fetch(`${API_URL}/api/bookings/latest`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoadingTable(false); // ◄ Turn off skeleton once data maps
      })
      .catch((err) => {
        console.error(err);
        setLoadingTable(false);
      });
  }, []);

  // 2. Action handler when someone clicks the Details button
  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setSnapshots({ initial: null, final: null }); // ◄ Reset snapshot object values
    setAuthError(false);
    setDetailsError("");
    setPasswordInput(""); 
  };

  // 3. Verifies passcode when submitted inside the modal popup split
const handleVerifyPasscode = async (e) => {
  e.preventDefault();

  if (passwordInput === ADMIN_PASSCODE) {
    setAuthError(false);
    setDetailsError("");
    setLoadingSnapshot(true);

    try {
      // The public latest endpoint only returns summary data. Fetch the full
      // booking after the existing details passcode has been entered.
      const detailsRes = await fetch(
        `${API_URL}/api/bookings/latest/details/${selectedBooking.id}`
      );

      if (!detailsRes.ok) {
        throw new Error(`Unable to load booking details (${detailsRes.status})`);
      }

      const fullBooking = await detailsRes.json();
      setSelectedBooking(fullBooking);

      if (fullBooking.booking_attch?.id && fullBooking.booking_ref) {
        try {
          const attachmentRes = await fetch(
            `${API_URL}/api/bookings/${fullBooking.booking_ref}/attachment`
          );

          if (attachmentRes.ok) {
            const result = await attachmentRes.json();

            if (result.success) {
              setSnapshots({
                initial: result.summarySnapshot,
                final: result.summarySnapshotFinal
              });
            }
          }
        } catch (attachmentError) {
          console.error("Error fetching layout snapshots:", attachmentError);
        }
      }

      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setDetailsError("Unable to load booking details. Please try again.");
    } finally {
      setLoadingSnapshot(false);
    }

  } else {
    setAuthError(true);
  }
};

  // 4. Fully clear memory states when closing modal container down
  const handleCloseModal = () => {
    setSelectedBooking(null);
    setIsAuthenticated(false);
  };

  // 🚀 UPDATED: Programmatic Base64 local downloader function with context labels
  const handleDownloadSnapshot = (base64String, typeLabel) => {
    if (!base64String) return;
    
    const downloadLink = document.createElement("a");
    downloadLink.href = base64String;
    // Names the file contextually based on the downloaded view type
    downloadLink.download = `${typeLabel}-${selectedBooking.booking_ref || "booking"}.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

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

  const getTotalSettlement = (booking) => {
    const paidAmount = Number(booking?.total_paid ?? booking?.total ?? 0);
    return (paidAmount + 1.25).toFixed(2);
  };

  const sendWhatsApp = (b) => {
    const liveReceiptUrl = `${window.location.origin}/receipt/${b.booking_ref}`;
    const message = `*Receipt Request*\n\n👤 *Name:* ${b.first_name} ${b.last_name}\n🆔 *Booking ID:* ${b.id}\n📅 *Start:* ${b.start_date}\n📅 *End:* ${b.end_date}\n📍 *Location:* ${b.camp_place}\n🔖 *Ref:* ${b.booking_ref}\n📦 *Package:* ${b.package?.name || "N/A"}\n💰 *Total:* RM${getTotalSettlement(b)}\n\n🗺️ *View Layout Blueprint & Receipt:* \n${liveReceiptUrl}`;
    const phone = "60173469335";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const explicitGridStyle = { border: "2px solid #C6A969", borderCollapse: "collapse" };
  const cellBorderStyle = { borderBottom: "2px solid #C6A969", borderRight: "2px solid #C6A969" };

  return (
    <div className="w-full py-16 bg-[#fdf6ee] text-gray-800 font-sans">
      <div className="w-full max-w-[95%] mx-auto px-4 md:px-6">
        
        {/* Title & Premium Live Signal Indicator */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center gap-3">
          <h2 
            className="text-3xl md:text-5xl font-bold mb-2 md:mb-0"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#597E52" }}
          >
            Latest Bookings
          </h2>
          
          {/* 📡 UPGRADED: Live Signal / Radar Pulse Component */}
          <div className="flex items-center justify-center gap-2 self-center md:self-end md:mb-1 bg-[#fff7ed] px-3 py-1.5 rounded-xl border border-[#e2c8aa] shadow-xs">
            <div className="relative flex items-center justify-center h-4 w-4">
              {/* Outer Pulse Ring 2 */}
              <span className="animate-[ping_2s_infinite] absolute inline-flex h-full w-full rounded-full bg-[#597E52] opacity-20"></span>
              {/* Outer Pulse Ring 1 */}
              <span className="animate-[ping_1.5s_infinite] absolute inline-flex h-[75%] w-[75%] rounded-full bg-[#597E52] opacity-40"></span>
              {/* Solid Core Dot */}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#597E52]"></span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#597E52] uppercase font-mono">Live Syncing</span>
          </div>
        </div>

        {/* ================= DESKTOP VIEW ================= */}
        <div 
          className="hidden md:block bg-[#fff7ed] rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
          style={{
            boxShadow: "0 4px 6px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,50,0.08), 0 20px 40px rgba(0,0,50,0.06)",
            border: "3px solid #bfa363"
          }}
        >
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left table-auto text-sm" style={explicitGridStyle}>
              <thead>
                <tr className="bg-[#C6A969] text-white font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 whitespace-nowrap" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Customer Name</th>
                  <th className="py-4 px-5 whitespace-nowrap" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Created At</th>
                  <th className="py-4 px-5 whitespace-nowrap" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Start Date</th>
                  <th className="py-4 px-5 whitespace-nowrap" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>End Date</th>
                  <th className="py-4 px-6" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Camp Location</th>
                  <th className="py-4 px-5 text-center whitespace-nowrap" style={{ borderBottom: "3px solid #bfa363", borderRight: "2px solid #bfa363" }}>Status</th>
                  <th className="py-4 px-6 text-center whitespace-nowrap" style={{ borderBottom: "3px solid #bfa363" }}>Action</th>
                </tr>
              </thead>

              <tbody className="bg-[#fff7ed] text-gray-700">
                {loadingTable ? (
                  /* ⏳ DESKTOP LOADING SKELETON: Loops 4 pulsing rows styled exactly like your cells */
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={`skeleton-row-${idx}`} className="animate-pulse">
                      <td className="py-5 px-6" style={cellBorderStyle}>
                        <div className="h-4 bg-gray-300/70 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-300/40 rounded w-16"></div>
                      </td>
                      <td className="py-5 px-5" style={cellBorderStyle}>
                        <div className="h-3.5 bg-gray-300/50 rounded w-20"></div>
                      </td>
                      <td className="py-5 px-5" style={cellBorderStyle}>
                        <div className="h-3.5 bg-gray-300/50 rounded w-16"></div>
                      </td>
                      <td className="py-5 px-5" style={cellBorderStyle}>
                        <div className="h-3.5 bg-gray-300/50 rounded w-16"></div>
                      </td>
                      <td className="py-5 px-6" style={cellBorderStyle}>
                        <div className="h-4 bg-gray-300/50 rounded w-48"></div>
                      </td>
                      <td className="py-5 px-5 text-center" style={cellBorderStyle}>
                        <div className="h-5 bg-gray-300/60 rounded-md w-20 mx-auto"></div>
                      </td>
                      <td className="py-5 px-6 text-center" style={{ borderBottom: "2px solid #C6A969" }}>
                        <div className="h-8 bg-gray-300/60 rounded-xl w-20 mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#fbf1e3] transition-colors duration-150">
                      <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap" style={cellBorderStyle}>
                        {b.first_name}
                        {b.has_layout && (
                          <span className="ml-2 text-[10px] text-[#C6A969] bg-[#fff7ed] px-1.5 py-0.5 rounded border border-[#e2c8aa]">📸 Layout</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-gray-500 font-mono text-xs whitespace-nowrap" style={cellBorderStyle}>
                        {b.created_date}
                      </td>
                      <td className="py-4 px-5 font-mono text-xs whitespace-nowrap" style={cellBorderStyle}>{b.start_date}</td>
                      <td className="py-4 px-5 font-mono text-xs whitespace-nowrap" style={cellBorderStyle}>{b.end_date}</td>
                      <td className="py-4 px-6 max-w-sm break-words text-gray-600" style={cellBorderStyle}>{b.camp_place}</td>
                      <td className="py-4 px-5 text-center whitespace-nowrap" style={cellBorderStyle}>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${getPaymentBadge(b.payment_status)}`}>
                          {b.payment_status?.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap" style={{ borderBottom: "2px solid #C6A969" }}>
                        <button
                          onClick={() => handleOpenDetails(b)}
                          className="bg-[#597E52] hover:bg-[#466340] text-white font-medium text-xs py-2 px-5 rounded-xl transition-all duration-200 shadow-xs"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MOBILE VIEW ================= */}
        <div className="md:hidden space-y-6">
          {loadingTable ? (
            /* ⏳ MOBILE LOADING SKELETON: Loops 2 pulsing item stacks matching your card layouts */
            Array.from({ length: 2 }).map((_, idx) => (
              <div 
                key={`skeleton-mob-${idx}`}
                className="bg-[#C6A969]/70 rounded-2xl p-4 flex flex-col justify-between border-2 border-[#bfa363] animate-pulse"
              >
                <div className="bg-[#fff7ed] rounded-xl p-4 space-y-4 border border-[#e2c8aa]">
                  <div className="flex items-center justify-between gap-3 border-b-2 border-[#e2c8aa] pb-3">
                    <div className="h-4 bg-gray-300 rounded-md w-28"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-14 shrink-0"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between"><div className="h-3 bg-gray-300 rounded w-12"></div><div className="h-3 bg-gray-300 rounded w-16"></div></div>
                    <div className="flex justify-between"><div className="h-3 bg-gray-300 rounded w-14"></div><div className="h-3 bg-gray-300 rounded w-28"></div></div>
                    <div className="pt-2 border-t border-dashed border-[#e2c8aa]"><div className="h-3 bg-gray-300 rounded w-24 mb-1.5"></div><div className="h-4 bg-gray-300 rounded w-full"></div></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded-xl w-full mt-2"></div>
                </div>
              </div>
            ))
          ) : (
            bookings.map((b) => (
              <div 
                key={b.id} 
                className="bg-[#C6A969] rounded-2xl p-4 flex flex-col justify-between text-left border-2 border-[#bfa363]"
                style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,50,0.08)" }}
              >
                <div className="bg-[#fff7ed] rounded-xl p-4 space-y-3 border border-[#e2c8aa]">
                  <div className="flex items-center justify-between gap-3 border-b-2 border-[#e2c8aa] pb-3">
                    <h3 className="font-bold text-base text-gray-900 tracking-tight flex items-center">
                      {b.first_name}
                      {b.has_layout && (
                        <span className="ml-1.5 text-[9px] text-[#C6A969] bg-[#fff7ed] px-1 py-0.2 rounded border border-[#e2c8aa]">📸</span>
                      )}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide shrink-0 ${getPaymentBadge(b.payment_status)}`}>
                      {b.payment_status?.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Created:</span>
                      <span className="font-mono">{b.created_date}</span>
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
                    onClick={() => handleOpenDetails(b)}
                    className="w-full bg-[#597E52] hover:bg-[#466340] text-white font-semibold text-xs py-3 rounded-xl transition-all duration-200 mt-2 shadow-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ================= ACTIONS MODAL ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div 
            className="bg-[#C6A969] rounded-2xl w-full max-w-2xl p-4 relative my-auto flex flex-col border-2 border-[#bfa363]"
            style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
          >
            <div className="bg-[#fff7ed] rounded-xl p-6 relative border border-[#e2c8aa]">
              
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-[#fdf6ee] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {!isAuthenticated ? (
                <div className="text-center py-4 font-sans max-w-md mx-auto">
                  <div className="w-14 h-14 bg-[#C6A969] rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-black">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-bold text-black mb-1">Passcode Required</h3>
                  <p className="text-xs text-gray-500 mb-6">Enter terminal key to unlock secure summary assets.</p>

                  <form onSubmit={handleVerifyPasscode} className="space-y-4">
                    <input 
                      type="password"
                      placeholder="Enter passcode..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-white text-black font-mono text-center text-sm py-3 px-4 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#C6A969]"
                    />

                    {authError && (
                      <p className="text-xs text-rose-600 font-semibold">⚠️ Invalid passcode token.</p>
                    )}

                    {detailsError && (
                      <p className="text-xs text-rose-600 font-semibold">⚠️ {detailsError}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="flex-1 bg-white border border-gray-300 text-gray-600 font-bold text-xs py-3 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loadingSnapshot}
                        className="flex-1 bg-black text-white font-bold text-xs py-3 rounded-xl border border-black active:translate-y-0.5"
                      >
                        {loadingSnapshot ? "Loading..." : "Unlock"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
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
                      <span className="text-gray-700 text-right truncate">
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

                  {/* ================= SNAPSHOTS LAYOUT CONTAINER ================= */}
                  {selectedBooking.booking_attch && selectedBooking.booking_attch.id && (
                    <div className="mt-5 text-left">
                      {loadingSnapshot ? (
                        <div className="w-full bg-[#fdf6ee] rounded-xl border border-[#e2c8aa] flex flex-col items-center justify-center py-10 min-h-[160px]">
                          <div className="w-6 h-6 border-2 border-[#597E52] border-t-transparent rounded-full animate-spin mb-2"></div>
                          <span className="text-xs text-gray-400 font-mono">Loading transaction blueprints...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                          
                          {/* 1. INITIAL SNAPSHOT */}
                          <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-1.5 h-6">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Initial Setup Layout</span>
                              {snapshots.initial && (
                                <button
                                  onClick={() => handleDownloadSnapshot(snapshots.initial, "Initial-Layout")}
                                  className="text-[10px] font-bold text-[#597E52] hover:text-[#466340] flex items-center gap-1 bg-[#fdf6ee] px-2 py-0.5 rounded border border-[#e2c8aa] transition-colors"
                                >
                                  Save Setup
                                </button>
                              )}
                            </div>
                            <div className="w-full bg-[#fdf6ee] rounded-xl border border-[#e2c8aa] p-2 flex items-center justify-center min-h-[140px] overflow-hidden">
                              {snapshots.initial ? (
                                <img 
                                  src={snapshots.initial} 
                                  alt="Initial Camp Setup Blueprint" 
                                  className="w-full h-auto object-contain rounded-lg border border-neutral-200 max-h-[220px] shadow-sm cursor-pointer"
                                  onClick={() => handleDownloadSnapshot(snapshots.initial, "Initial-Layout")}
                                  title="Click to download initial setup map"
                                />
                              ) : (
                                <span className="text-xs text-rose-500 font-mono">Initial map snapshot missing.</span>
                              )}
                            </div>
                          </div>

                          {/* 2. FINAL SNAPSHOT */}
                          <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-1.5 h-6">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Final Receipt Snapshot</span>
                              {snapshots.final && (
                                <button
                                  onClick={() => handleDownloadSnapshot(snapshots.final, "Final-Receipt")}
                                  className="text-[10px] font-bold text-[#597E52] hover:text-[#466340] flex items-center gap-1 bg-[#fdf6ee] px-2 py-0.5 rounded border border-[#e2c8aa] transition-colors"
                                >
                                  Save Receipt
                                </button>
                              )}
                            </div>
                            <div className="w-full bg-[#fdf6ee] rounded-xl border border-[#e2c8aa] p-2 flex items-center justify-center min-h-[140px] overflow-hidden">
                              {snapshots.final ? (
                                <img 
                                  src={snapshots.final} 
                                  alt="Final Receipt Layout Blueprint" 
                                  className="w-full h-auto object-contain rounded-lg border border-neutral-200 max-h-[220px] shadow-sm cursor-pointer"
                                  onClick={() => handleDownloadSnapshot(snapshots.final, "Final-Receipt")}
                                  title="Click to download final receipt map"
                                />
                              ) : (
                                <div className="text-center p-4">
                                  <span className="text-xs text-gray-400 italic block">Pending settlement</span>
                                  <span className="text-[10px] text-neutral-400 block font-mono mt-0.5">(Final snapshot not generated)</span>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-[#fdf6ee] rounded-xl p-4 flex justify-between items-center mt-5 border border-[#bfa363]">
                    <span className="text-xs font-bold text-[#C6A969] uppercase tracking-wider">Total Settlement</span>
                    <span className="font-bold text-xl text-gray-900">
                      RM {getTotalSettlement(selectedBooking)}
                    </span>
                  </div>

                  <div className="mt-6 flex gap-3 text-xs font-semibold">
                    <button
                      onClick={handleCloseModal}
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
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
