import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function TermsModal({ onClose, onAgree }) {
  const [agreed, setAgreed] = useState(false);
  const sigRef = useRef(null);

  const clearSignature = () => {
    sigRef.current.clear();
  };

  const handleAgree = () => {
    if (sigRef.current.isEmpty()) {
      alert("Please sign before continuing");
      return;
    }

    const signatureImage = sigRef.current.toDataURL("image/png");

    onAgree(signatureImage); // send to parent/backend
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">

        {/* Header */}
        <div className="p-5 text-center border-b">
          <h2 className="text-lg font-semibold">Terms & Agreement</h2>
          <p className="text-sm text-gray-500">Sign to continue</p>
        </div>

        {/* Terms */}
        <div className="p-4 text-sm text-gray-600 max-h-[180px] overflow-y-auto">
          <p>1. The renter is responsible for all equipment during the rental period.</p>
          <p>2. Any loss, damage, or theft of items will require full compensation.</p>
          <p>3. A security deposit must be paid before the start of the camping period.</p>
          <p>4. Return can be done after the camping day, preferably after the activity ends.</p>
          <p>5. The tent must be returned in its original condition to get the deposit refund.</p>
          <p>6. Deposit will be refunded one day after camping (inspection period for the tent condition).</p>
          <p>7. No smoking or any fire-related activities inside or near the tent.</p>
          <p>8. Setup order: sunshade first, then ground sheet, then the tent on top.</p>
          <p>9. Qash Camp is not liable for personal injuries or accidents during the camping activity.</p>
          <p>10. All renters must follow camp rules and safety guidelines.</p>
        </div>

        {/* Signature box */}
        <div className="px-4 py-3">
          <p className="text-sm mb-2 text-gray-600">Signature:</p>

          <div className="border rounded-lg bg-gray-50">
            <SignatureCanvas
              ref={sigRef}
              penColor="black"
              canvasProps={{
                className: "w-full h-32"
              }}
            />
          </div>

          <button
            onClick={clearSignature}
            className="text-xs text-blue-600 mt-1"
          >
            Clear
          </button>
        </div>

        {/* Checkbox */}
        <div className="px-4 pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to the terms & conditions
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border"
          >
            Back
          </button>

          <button
            disabled={!agreed}
            onClick={handleAgree}
            className={`flex-1 py-2 rounded-lg text-white
              ${agreed ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"}
            `}
          >
            Sign & Continue
          </button>
        </div>

      </div>
    </div>
  );
}