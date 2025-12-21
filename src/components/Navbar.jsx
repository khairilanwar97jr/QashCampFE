import React, { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import LogoImg from "../assets/logo.jpg";
import AuthModal from "./AuthModal";
import Login from "./LoginForm";
import Register from "./Register";

const scrollWithOffset = (el) => {
  const yOffset = -85;
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
};

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white text-gray-800 py-3 px-6 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">

          {/* LOGO */}
          <HashLink smooth to="/#top" className="flex items-center">
            <div className="h-14 w-14 rounded-full overflow-hidden shadow-sm">
              <img
                src={LogoImg}
                alt="Kaiso Camp Logo"
                className="h-full w-full object-cover object-center scale-125"
              />
            </div>
          </HashLink>

          {/* MENU */}
          <div className="hidden md:flex space-x-10 text-lg font-medium">
            <HashLink smooth to="/" scroll={scrollWithOffset} className="hover:text-green-600 transition">
              Home
            </HashLink>
            <a href="/contact" className="hover:text-green-600 transition">
              Contact
            </a>
            <HashLink smooth to="/#choosePackage" scroll={scrollWithOffset} className="hover:text-green-600 transition">
              Booking
            </HashLink>
            <HashLink smooth to="/why-us" scroll={scrollWithOffset} className="hover:text-green-600 transition">
              Why Us?
            </HashLink>
          </div>

          {/* AUTH BUTTONS */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <button
                  onClick={() => { setAuthMode("login"); setShowModal(true); }}
                  className="px-5 py-2 border border-gray-700 rounded-full hover:bg-gray-800 hover:text-white transition"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <span className="font-medium">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 border border-gray-700 rounded-full hover:bg-gray-800 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <AuthModal isOpen={showModal} onClose={() => setShowModal(false)}>
          {authMode === "login" ? (
            <Login onClose={() => setShowModal(false)} setAuthMode={setAuthMode} setUser={setUser} />
          ) : (
            <Register onClose={() => setShowModal(false)} setAuthMode={setAuthMode} setUser={setUser} />
          )}
        </AuthModal>
      )}
    </>
  );
}
