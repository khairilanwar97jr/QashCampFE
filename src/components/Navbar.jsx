import React, { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { Link, useLocation } from "react-router-dom";
import LogoImg from "../assets/logo.jpg";
import AuthModal from "./AuthModal";
import Login from "./LoginForm";
import Register from "./Register";

const scrollWithOffset = (el) => {
  const yOffset = -120; 
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
};

export default function Navbar() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); 
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 font-sans ${
          isScrolled 
            ? "bg-[#fff7ed]/90 backdrop-blur-md py-2.5 shadow-sm" 
            : "bg-[#fff7ed] py-4"
        }`}
        style={{
          borderBottom: "3px solid #bfa363"
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6">
          
          {/* LOGO & PREMIUM BRAND BRANDING */}
          <HashLink smooth to="/#top" onClick={() => setIsOpen(false)} className="flex items-center gap-3 group focus:outline-none">
            <div 
              className="h-10 w-10 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105 shrink-0"
              style={{ border: "2px solid #597E52" }}
            >
              <img
                src={LogoImg}
                alt="Kaiso Camp Logo"
                className="h-full w-full object-cover scale-110"
              />
            </div>
            <div className="text-left">
              <span className="font-mono text-[8px] md:text-[9px] block tracking-[0.22em] text-[#C6A969] font-black uppercase leading-none">
                Outdoor Rental
              </span>
              {/* Premium, High-Contrast Editorial Brand Header Execution */}
              <span className="text-sm md:text-base font-black tracking-[0.14em] text-gray-900 uppercase leading-none block mt-1 font-sans">
                QASH CAMP<span className="text-[#597E52] ml-0.5 font-extrabold">.</span>
              </span>
            </div>
          </HashLink>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-wider text-gray-700">
            <HashLink
              smooth
              to={location.pathname === "/" ? "#choosePackage" : "/#choosePackage"}
              scroll={scrollWithOffset}
              className="hover:text-[#597E52] transition-colors relative py-1"
            >
              Home
            </HashLink>
            
            <Link to="/contact" className="hover:text-[#597E52] transition-colors relative py-1">
              Contact
            </Link>

            <HashLink
              smooth
              to="/#choosePackage"
              scroll={scrollWithOffset}
              className="hover:text-[#597E52] transition-colors relative py-1"
            >
              Booking
            </HashLink>

            <HashLink
              smooth
              to="/why-us"
              scroll={scrollWithOffset}
              className="hover:text-[#597E52] transition-colors relative py-1"
            >
              Why Us?
            </HashLink>
          </div>

          {/* AUTH ACTIONS */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowModal(true);
                }}
                className="text-xs font-black uppercase tracking-wider text-white px-5 py-2.5 rounded-xl transition-all duration-150 active:translate-y-0.5"
                style={{
                  backgroundColor: "#597E52",
                  border: "2px solid #3b5435",
                  boxShadow: "0 3px 0px #3b5435"
                }}
              >
                Login
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-black uppercase tracking-wide text-gray-700">
                  Hi, {user.first_name}!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold uppercase tracking-wider text-gray-600 px-4 py-2 rounded-xl transition-all bg-[#fdf6ee]"
                  style={{ border: "2px solid #e2c8aa" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden flex-col justify-center items-center h-9 w-9 bg-[#fdf6ee] rounded-xl space-y-1 focus:outline-none shrink-0 transition-transform active:scale-95"
            style={{ border: "2px solid #e2c8aa" }}
          >
            <span className={`h-0.5 w-3.5 bg-gray-800 transition-all duration-300 ${isOpen ? "transform rotate-45 translate-y-1.5" : ""}`} />
            <span className={`h-0.5 w-3.5 bg-gray-800 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-3.5 bg-gray-800 transition-all duration-300 ${isOpen ? "transform -rotate-45 -translate-y-1.5" : ""}`} />
          </button>

        </div>

        {/* MOBILE DROPDOWN OVERLAY */}
        <div 
          className={`md:hidden absolute left-0 right-0 top-full bg-[#fff7ed] px-6 py-6 transition-all duration-300 transform ease-in-out ${
            isOpen ? "opacity-100 translate-y-0 shadow-lg" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          style={{
            borderBottom: "3px solid #bfa363"
          }}
        >
          <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-wider text-gray-700">
            <HashLink
              smooth
              to={location.pathname === "/" ? "#choosePackage" : "/#choosePackage"}
              scroll={scrollWithOffset}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#597E52] py-2"
              style={{ borderBottom: "2px solid #e2c8aa" }}
            >
              Home
            </HashLink>

            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#597E52] py-2"
              style={{ borderBottom: "2px solid #e2c8aa" }}
            >
              Contact
            </Link>

            <HashLink
              smooth
              to="/#choosePackage"
              scroll={scrollWithOffset}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#597E52] py-2"
              style={{ borderBottom: "2px solid #e2c8aa" }}
            >
              Booking
            </HashLink>

            <HashLink
              smooth
              to="/why-us"
              scroll={scrollWithOffset}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#597E52] py-2 pb-3"
            >
              Why Us?
            </HashLink>

            <div className="pt-2">
              {!user ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setAuthMode("login");
                    setShowModal(true);
                  }}
                  className="w-full text-center text-white font-black py-3 rounded-xl transition-all active:translate-y-0.5"
                  style={{
                    backgroundColor: "#597E52",
                    border: "2px solid #3b5435",
                    boxShadow: "0 4px 0px #3b5435"
                  }}
                >
                  Login
                </button>
              ) : (
                <div className="flex flex-col items-center gap-3 bg-[#fdf6ee] p-3 rounded-xl" style={{ border: "2px solid #e2c8aa" }}>
                  <span className="text-gray-600 font-bold text-xs">Logged in: {user.first_name}</span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center bg-transparent text-red-600 py-2 rounded-xl font-black text-xs"
                    style={{ border: "2px solid #fca5a5" }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MODAL CONFIG */}
      {showModal && (
        <AuthModal isOpen={showModal} onClose={() => setShowModal(false)}>
          {authMode === "login" ? (
            <Login
              onClose={() => setShowModal(false)}
              setAuthMode={setAuthMode}
              setUser={setUser}
            />
          ) : (
            <Register
              onClose={() => setShowModal(false)}
              setAuthMode={setAuthMode}
              setUser={setUser}
            />
          )}
        </AuthModal>
      )}
    </>
  );
}