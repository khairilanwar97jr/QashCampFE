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
        <h2 className="text-2xl font-bold text-center mb-4">
          📋 Booking Details
        </h2>
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Start Date</th>
              <th className="py-2 px-4 border">End Date</th>
              <th className="py-2 px-4 border">Location</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr key={index} className="text-center hover:bg-green-50">
                <td className="py-2 px-4 border">{b.name}</td>
                <td className="py-2 px-4 border">{b.startDate}</td>
                <td className="py-2 px-4 border">{b.endDate}</td>
                <td className="py-2 px-4 border">{b.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 py-6 text-gray-500 border-t">
        © 2025 Kaiso Camp. All rights reserved.
      </footer>
    </div>
  );
}
