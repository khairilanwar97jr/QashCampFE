import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function TermsModal({ onClose, onAgree, existingSignature, setMainAgreed }) {
  const [agreed, setAgreed] = useState(false);
  const sigRef = useRef(null);

  // Fixes Issue 2: Wait for canvas layout to load, then inject old signature
  useEffect(() => {
    if (existingSignature && sigRef.current) {
      const timer = setTimeout(() => {
        sigRef.current.fromDataURL(existingSignature);
        setAgreed(true); // Auto-tick local checkbox since it's already signed
      }, 50); 
      return () => clearTimeout(timer);
    }
  }, [existingSignature]);

  const clearSignature = () => {
    sigRef.current.clear();
  };

const handleAgree = () => {
    if (sigRef.current.isEmpty()) {
      alert("Please sign before continuing");
      return;
    }

    try {
      // 1. Grab raw canvas data to prevent mobile dimension freezing bugs
      const signatureImage = sigRef.current.getCanvas().toDataURL("image/png");
      
      // 2. Sync the checkbox state back to the main page
      if (typeof setMainAgreed === "function") {
        setMainAgreed(agreed);
      }
      
      // 3. Send the image back to the main page and close it
      onAgree(signatureImage);
    } catch (error) {
      console.error("Signature capture failed:", error);
      // Fallback if raw canvas has an issue:
      const fallbackImage = sigRef.current.toDataURL("image/png");
      if (typeof setMainAgreed === "function") setMainAgreed(agreed);
      onAgree(fallbackImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-md flex flex-col border max-h-[90vh]"
        style={{ backgroundColor: "#FDFBF7", borderColor: "#E5DCB9" }}
      >
        {/* Header */}
        <div className="p-5 text-center border-b" style={{ borderColor: "#E5DCB9" }}>
          <h2 className="text-lg font-bold tracking-tight text-stone-900">Terms & Agreement</h2>
          <p className="text-xs font-medium uppercase tracking-wider mt-0.5 text-stone-500">Sign to continue</p>
        </div>

        {/* Terms Box */}
        <div 
          className="mx-4 mt-4 max-h-[42vh] p-4 text-xs space-y-3 rounded-xl border overflow-y-auto font-medium shadow-inner leading-relaxed text-stone-800"
          style={{ backgroundColor: "#EBE2CD", borderColor: "#D3C6A2" }}
        >
          <div><strong>1. Equipment Responsibility</strong><p>Renters are responsible for all equipment during the rental period.</p></div>
          <div><strong>2. Loss &amp; Damage</strong><p>Lost, damaged, or stolen items must be fully compensated.</p></div>
          <div><strong>3. Security Deposit</strong><p>A security deposit is required before the camping period begins.</p></div>
          <div><strong>4. Equipment Return</strong><p>Equipment can be returned after the camping activity ends, preferably on the day after camping. Late returns may be subject to additional charges.</p></div>
          <div><strong>5. Return Condition</strong><p>All equipment must be returned in its original condition for a full deposit refund.</p></div>
          <div><strong>6. Deposit Refund</strong><p>Deposits will be refunded within 1 day after camping, subject to equipment inspection.</p></div>
          <div><strong>7. No Smoking &amp; Fire</strong><p>Smoking and any fire-related activities are prohibited inside or near the tent.</p></div>
          <div><strong>8. Tent Setup</strong><p>Setup order: sunshade → ground sheet → tent.</p></div>
          <div><strong>9. Personal Safety</strong><p>QashCamp is not responsible for personal injuries or accidents during camping activities.</p></div>
          <div><strong>10. Camp Rules</strong><p>Renters must follow all campsite rules and safety guidelines.</p></div>
          <div><strong>11. Cancellation &amp; Refund</strong><p>Cancellation must be informed at least 2 days (48 hours) before camping to receive a refund. Otherwise, the booking is non-refundable.</p></div>
          <div><strong>12. Last-Minute Booking</strong><p>For bookings made less than 2 days before camping, cancellation must be informed at least 12 hours before camping to receive a refund. Otherwise, the booking is non-refundable.</p></div>
        </div>

        {/* Signature Box */}
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-600">Signature:</p>
            <button
              onClick={clearSignature}
              className="text-xs font-bold tracking-wide underline transition-colors hover:text-stone-900"
              style={{ color: "#8B7E66" }}
            >
              Clear Canvas
            </button>
          </div>

          <div 
            className="border rounded-xl bg-white shadow-inner overflow-hidden"
            style={{ borderColor: "#D3C6A2" }}
          >
            <SignatureCanvas
              ref={sigRef}
              penColor="#1A1A1A"
              canvasProps={{
                className: "w-full h-28 cursor-crosshair"
              }}
            />
          </div>
        </div>

        {/* Checkbox Frame */}
        <div className="px-4 pb-3">
          <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-stone-900 border-stone-400"
            />
            I agree to the terms & conditions
          </label>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 p-4 border-t mt-auto" style={{ borderColor: "#E5DCB9" }}>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-colors bg-white text-stone-800 hover:bg-stone-50"
            style={{ borderColor: "#D3C6A2" }}
          >
            Back
          </button>

          <button
            disabled={!agreed}
            onClick={handleAgree}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md
              ${agreed 
                ? "bg-stone-950 text-white hover:bg-stone-900 border border-stone-950 active:scale-95" 
                : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              }
            `}
            style={agreed ? { borderColor: "#FFD700" } : {}}
          >
            Sign & Continue
          </button>
        </div>

      </div>
    </div>
  );
}
