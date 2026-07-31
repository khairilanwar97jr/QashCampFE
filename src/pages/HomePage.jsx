import Navbar from "../components/Navbar";
import "../index.css";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import packageAImg from "../assets/packageA.jpg";
import packageBImg from "../assets/packageB.jpg";
import packageCImg from "../assets/packageC.jpg";
import TimelineSection from "../components/TimelineSection";
import WhyUsPreviewSection from "../components/WhyUsPreviewSection";
import PackagesSection from "../components/PackagesSection";
import CheckAvailabilitySection from "../components/CheckAvailabilitySection";
import AuthModal from "../components/AuthModal";
import LoginForm from "../components/LoginForm";
import WelcomeAdsCard from "../components/WelcomeAdsCard";
import React, { useState, useEffect } from "react";
import Register from "../components/Register";
import LatestBookingsTable from "../components/LatestBookingsTable";
import BookingChecker from "../components/BookingChecker";
import CalendarBooked from "../components/CalendarBooked";
import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

export default function HomePage() {
  const bookings = [
    {
      name: "Ali Bin Ahmad",
      startDate: "2025-10-20",
      endDate: "2025-10-22",
      location: "Taman Negara",
    },
    {
      name: "Sara Lim",
      startDate: "2025-10-25",
      endDate: "2025-10-27",
      location: "Gunung Ledang",
    },
    {
      name: "Mika Tan",
      startDate: "2025-11-01",
      endDate: "2025-11-03",
      location: "Janda Baik",
    },
  ];
  const moments = [
    {
      date: "2025-01-15",
      img: "/images/moment1.jpg",
      caption: "Had a great camping night with friends!",
    },
    {
      date: "2025-02-10",
      img: "/images/moment2.jpg",
      caption: "Early morning hike with amazing sunrise.",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // or "register"
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  const [showWhatsAppHint, setShowWhatsAppHint] = useState(false);

  useEffect(() => {
    const hasSeenAuth = localStorage.getItem("hasSeenAuth");
    if (!hasSeenAuth) {
      setShowModal(true); // show modal only once
    }
  }, []);

  useEffect(() => {
    const hasSeenWhatsAppHint = localStorage.getItem("hasSeenWhatsAppHint");
    if (hasSeenWhatsAppHint) return;

    setShowWhatsAppHint(true);

    const timer = setTimeout(() => {
      localStorage.setItem("hasSeenWhatsAppHint", "true");
      setShowWhatsAppHint(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenAuth", "true"); // mark as seen
    setShowModal(false);
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = whatsAppMessage.trim();
    if (!trimmedMessage) return;

    const phoneNumber = "60173469335";
    const message = `sender from web : ${trimmedMessage}`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setShowWhatsAppModal(false);
    setWhatsAppMessage("");
  };

  return (
    <div id="top" className="bg-[#fdf6ee] min-h-screen text-gray-900">
      <Navbar />

      <AuthModal isOpen={showModal} onClose={handleClose}>
        {authMode === "login" ? (
          <WelcomeAdsCard onContinue={handleClose} />
        ) : (
          <Register onClose={handleClose} setAuthMode={setAuthMode} />
        )}
      </AuthModal>
      <div className="">
        <Banner />
        {/* other content like your packages and booking table */}
      </div>

      {/* Timeline Section */}

      {/*
                  <div className="w-full bg-cover bg-center">
                    <h2
                      className="text-4xl md:text-5xl font-bold text-center mt-16 mb-16"
                      style={{
                        fontFamily: "'Fredoka One', cursive",
                        color: "#FF6D1F",
                        textShadow: `
                          3px 3px 0 #64350eff,
                          -1px -1px 0 #845025,
                          1px -1px 0 #bc8000ff,
                          -1px 1px 0 #845025,
                          1px 1px 0 #845025
                        `,
                      }}
                    >
                      Share your moments here!
                    </h2>
                  </div>
                  */}

        {/* Check Availability Section */}
        <CalendarBooked/>
        <BookingChecker/>
        <CheckAvailabilitySection />

      {/* Timeline Section */}
      <div className="bg-[#8b5a2b] mt-10 px-4 py-10">
        <TimelineSection />
      </div>


      <h2
        className="text-5xl md:text-6xl font-bold text-center mt-10 mb-10"
        style={{
          fontFamily: "'Fredoka One', cursive",
          background: "linear-gradient(90deg, #69b35aff, #597E52, #44683dff)", // smooth brand gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          // remove text-shadow for sharpness
          // add transform for sharper rendering
          transform: "translateZ(0)",
          // use font-smoothing
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        Why Choose Us ?
      </h2>
      <div>
        <WhyUsPreviewSection />
      </div>
      {/* Timeline Section Title */}
      <h2
        id="choosePackage"
        className="text-4xl md:text-6xl font-bold text-center mt-10 mb-10"
        style={{
          fontFamily: "'Fredoka One', cursive",
          background: "linear-gradient(90deg, #69b35aff, #597E52, #44683dff)", // smooth brand gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          // remove text-shadow for sharpness
          // add transform for sharper rendering
          transform: "translateZ(0)",
          // use font-smoothing
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        Choose Your Package
      </h2>

      <PackagesSection
        packages={[
          {
            name: "🔥 Package A",
            code: "A",
            image: packageAImg,
            available: false,
            details: "Tent size: 200cm x 205cm | Height: 135cm",
            prices: ["RM80 - 2 days 1 night", "RM110 - 3 days 2 nights"],
          },
          {
            name: "🔥 Package B",
            code: "B",
            image: packageBImg,
            available: true,
            details: "Tent size: 210cm x 320cm | Height: 180cm",
            prices: ["RM110 - 2 days 1 night", "RM150 - 3 days 2 nights"],
          },
          {
            name: "🔥 Package C",
            code: "C",
            image: packageCImg,
            available: true,
            details: "Tent size: 450cm x 608cm x 195cm",
            prices: ["RM150 - 2 days 1 night", "RM200 - 3 days 1 night"],
          },
        ]}
      />

      {/* Booking Details Table */}
      <div className="mt-16 mx-auto max-w-4xl bg-white shadow-lg rounded-xl p-6">
         <div>
      {/* your other homepage content */}

      <LatestBookingsTable />
    </div>
      </div>


<footer 
      className="w-full bg-[#191C1A] text-gray-300 font-sans mt-24"
      style={{
        borderTop: "3px solid #597E52" // Using the premium green as the top accent bar
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* TOP / MAIN FOOTER BLOCK */}
        <div 
          className="flex flex-col md:flex-row justify-between items-start gap-8 pb-10"
          style={{
            borderBottom: "2px solid #2A2F2B" // Darker complementary divider rule
          }}
        >
          
          {/* BRAND AND SSM INFORMATION */}
          <div className="text-left max-w-sm">
            {/* Premium, High-Contrast Editorial Brand Header Execution */}
            <h3 className="text-2xl font-black tracking-[0.14em] text-white uppercase leading-none mb-3">
              QASH CAMP<span className="text-[#597E52] ml-0.5 font-extrabold">.</span>
            </h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed tracking-wide mb-5">
              Premium Outdoor & Field Gear Rental Systems.
            </p>
            
            {/* OFFICIAL SSM REGISTERED BADGE - High Contrast Dark Mode Variant */}
            <div 
              className="inline-block bg-[#222623] rounded-xl p-4 text-left"
              style={{
                border: "2px solid #C6A969",
                boxShadow: "0 4px 0px rgba(198, 169, 105, 0.2)"
              }}
            >
              <span className="block text-[9px] font-bold text-[#C6A969] uppercase tracking-widest mb-1">
                Registered Entity
              </span>
              <span className="block text-sm font-bold text-white uppercase tracking-wide">
                Qashcamp Enterprise
              </span>
              <span className="block font-mono text-[10px] text-gray-400 mt-0.5 font-semibold">
                Reg No: 202603102331 (IP0624208-V)
              </span>
            </div>
          </div>

          {/* QUICK UTILITY LINKS */}
          <div className="flex flex-wrap gap-8 sm:gap-16 text-left text-sm">
            <div className="flex flex-col gap-3 min-w-[120px]">
              <span className="font-bold text-xs uppercase tracking-wider text-[#C6A969]">Navigation</span>
              <a href="#choosePackage" className="text-gray-300 hover:text-[#597E52] transition-colors font-bold">Our Packages</a>
              <a href="#why-us" className="text-gray-300 hover:text-[#597E52] transition-colors font-bold">Why Kaiso</a>
            </div>
            <div className="flex flex-col gap-3 min-w-[120px]">
              <span className="font-bold text-xs uppercase tracking-wider text-[#C6A969]">Support</span>
              <span className="text-gray-300 font-semibold">Selangor, MY</span>
              <span className="text-gray-300 font-semibold">Terms & Deposit</span>
            </div>
            <div className="flex flex-col gap-3 min-w-[120px]">
              <span className="font-bold text-xs uppercase tracking-wider text-[#C6A969]">Social</span>
              <a
                href="https://www.tiktok.com/@qashcamp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 truncate text-gray-300 hover:text-[#597E52] transition-colors font-bold"
              >
                <FaTiktok className="h-4 w-4 shrink-0" />
                <span className="truncate">@qashcamp</span>
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & ATTRIBUTION */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-center sm:text-left">
          
          {/* COPYRIGHT */}
          <p className="text-xs text-gray-500 font-bold">
            &copy; {new Date().getFullYear()} Kaiso Camp. All rights reserved.
          </p>

          {/* BINAIDEA ATTRIBUTION */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs tracking-wide text-gray-500 font-bold">
            <div className="flex items-center gap-1.5">
              <span>Powered by</span>
              <a
                href="https://binaidea.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#597E52] font-extrabold transition-all duration-200 underline decoration-[#C6A969] decoration-2 underline-offset-4 hover:scale-105 inline-block"
              >
                BinaIdea
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>

      <div className="group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[80] flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
        <div
          className={`relative whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#597E52] shadow-lg ring-1 ring-black/5 transition-all duration-200 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 ${
            showWhatsAppHint
              ? "opacity-100 translate-y-0 animate-whatsapp-hint-shake"
              : "pointer-events-none opacity-0 translate-y-1"
          }`}
        >
          chat me !
          <span className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-white" />
        </div>
        <button
          type="button"
          onClick={() => setShowWhatsAppModal(true)}
          aria-label="Open WhatsApp message"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 sm:h-14 sm:w-14"
        >
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.6} />
        </button>
      </div>

      {showWhatsAppModal && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-16 sm:items-center sm:px-4 sm:py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 text-left shadow-2xl sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-[#597E52] sm:text-lg">
                Message us on WhatsApp
              </h3>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                aria-label="Close WhatsApp modal"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#597E52]/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <textarea
                value={whatsAppMessage}
                onChange={(e) => setWhatsAppMessage(e.target.value)}
                rows={4}
                placeholder="Enter your message..."
                className="max-h-[38vh] w-full resize-none rounded-xl border border-[#e2c8aa] bg-[#fff7ed] p-3 text-base text-gray-800 outline-none transition focus:border-[#597E52] focus:ring-2 focus:ring-[#597E52]/20 sm:text-sm"
                autoFocus
              />
              <button
                type="submit"
                disabled={!whatsAppMessage.trim()}
                className="w-full rounded-xl bg-[#25D366] px-4 py-3 font-bold text-white shadow-md transition hover:bg-[#1ebe5d] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
