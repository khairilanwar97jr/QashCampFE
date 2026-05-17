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
import React, { useState, useEffect } from "react";
import Register from "../components/Register";
import LatestBookingsTable from "../components/LatestBookingsTable";
import BookingChecker from "../components/BookingChecker";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const hasSeenAuth = localStorage.getItem("hasSeenAuth");
    if (!hasSeenAuth) {
      setShowModal(true); // show modal only once
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenAuth", "true"); // mark as seen
    setShowModal(false);
  };

  return (
    <div id="top" className="bg-[#fdf6ee] min-h-screen text-gray-900">
      <Navbar />

      <AuthModal isOpen={showModal} onClose={handleClose}>
        {authMode === "login" ? (
          <LoginForm onClose={handleClose} setAuthMode={setAuthMode} />
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
        <CheckAvailabilitySection />
        <BookingChecker/>

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
          <div className="flex gap-16 text-left text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-xs uppercase tracking-wider text-[#C6A969]">Navigation</span>
              <a href="#choosePackage" className="text-gray-300 hover:text-[#597E52] transition-colors font-bold">Our Packages</a>
              <a href="#why-us" className="text-gray-300 hover:text-[#597E52] transition-colors font-bold">Why Kaiso</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-xs uppercase tracking-wider text-[#C6A969]">Support</span>
              <span className="text-gray-300 font-semibold">Selangor, MY</span>
              <span className="text-gray-300 font-semibold">Terms & Deposit</span>
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
          <div className="flex items-center gap-1.5 text-xs tracking-wide text-gray-500 font-bold">
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
    </footer>

    </div>
  );
}
