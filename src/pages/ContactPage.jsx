import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleWhatsAppSend = (e) => {
    e.preventDefault();

    // Ensure fields aren't completely blank
    if (!name || !message) {
      alert("Please fill in at least your Name and Message!");
      return;
    }

    // Target Phone Number (Malaysia Country Code prefixed without '+')
    const phoneNumber = "601116113722";

    // Format a clean text layout for your WhatsApp chat window
    const text = `*New Contact Form Submission*\n\n` +
                 `👤 *Name:* ${name}\n` +
                 `✉️ *Email:* ${email || "Not provided"}\n\n` +
                 `💬 *Message:* ${message}`;

    // Encode text securely to protect spaces and special symbols
    const encodedText = encodeURIComponent(text);

    // Dynamic URL trigger launch string
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    // Redirect the current window straight to the WhatsApp API link
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#fdf6ee] min-h-screen pt-28 pb-14 px-4">
        <div className="max-w-xl mx-auto">
          {/* Title */}
          <h2
            className="text-3xl md:text-6xl font-bold text-center mb-10"
            style={{
              fontFamily: "'Fredoka One', cursive",
              color: "#597E52",
            }}
          >
            Contact Us
          </h2>

          {/* Khaki / Sand Form Card matching your checker style */}
          <div
            className="bg-[#C6A969] rounded-2xl p-6 md:p-8 space-y-5
                 transition-transform duration-300 hover:-translate-y-2 text-left"
            style={{
              boxShadow: `
                0 4px 6px rgba(0,0,0,0.2),
                0 10px 20px rgba(0,0,50,0.1),
                0 20px 40px rgba(0,0,50,0.08)
              `,
            }}
          >
            <form onSubmit={handleWhatsAppSend} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fff7ed] border border-[#e2c8aa] rounded-lg p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fff7ed] border border-[#e2c8aa] rounded-lg p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F]"
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-white">
                  Message Details
                </label>
                <textarea
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full bg-[#fff7ed] border border-[#e2c8aa] rounded-lg p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6D1F] resize-none"
                  required
                ></textarea>
              </div>

              {/* Submit Trigger Action Block */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3.5 mt-2 rounded-xl font-semibold
                   hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
              >
                {/* Minimal clean speech icon */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.006 5.256 5.261 0 11.748 0c3.141.001 6.098 1.223 8.322 3.451C22.294 5.68 23.514 8.634 23.514 11.78c-.004 6.495-5.259 11.753-11.743 11.753-2.007-.001-3.982-.51-5.732-1.48L0 24zm6.49-3.414c1.658.984 3.284 1.498 4.981 1.5 5.421 0 9.833-4.385 9.836-9.778.003-2.613-1.011-5.068-2.858-6.918-1.847-1.85-4.307-2.869-6.924-2.87-5.422 0-9.835 4.386-9.839 9.779-.001 1.77.472 3.498 1.371 5.018l-.973 3.548 3.652-.951z" />
                </svg>
                Chat on WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
