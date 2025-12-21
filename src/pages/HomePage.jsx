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
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    setShowModal(true); // modal pops automatically
  }, []);

  return (
    <div id="top" className="bg-gray-50 min-h-screen text-gray-900">
      <Navbar />
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)}>
        {authMode === "login" ? (
          <LoginForm
            onClose={() => setShowModal(false)}
            setAuthMode={setAuthMode}
          />
        ) : (
          <Register
            onClose={() => setShowModal(false)}
            setAuthMode={setAuthMode}
          />
        )}
      </AuthModal>
      <div>
        <Banner />
        {/* other content like your packages and booking table */}
      </div>
      {/* Timeline Section Title */}
      <h2
        className="text-4xl md:text-5xl font-bold text-center mt-16 mb-6"
        style={{
          fontFamily: "'Fredoka One', cursive",
          background:
            "linear-gradient(90deg,rgb(246, 249, 59),rgb(161, 197, 3), #018e0cff)", // remove alpha
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
        Share your moments here!
      </h2>
      <div>
        {/* other sections */}
        <TimelineSection />
      </div>
      <h2
        className="text-4xl md:text-5xl font-bold text-center mt-16 mb-16"
        style={{
          fontFamily: "'Fredoka One', cursive",
          background:
            "linear-gradient(90deg,rgb(246, 249, 59),rgb(161, 197, 3), #018e0cff)", // remove alpha
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
        className="text-4xl md:text-5xl font-bold text-center mt-16 mb-6"
        style={{
          fontFamily: "'Fredoka One', cursive",
          background:
            "linear-gradient(90deg,rgb(246, 249, 59),rgb(161, 197, 3), #018e0cff)", // remove alpha
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
      prices: ["RM50 - 2 days 1 night", "RM80 - 3 days 2 nights"],
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
