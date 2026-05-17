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
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b font-sans ${
          isScrolled 
            ? "bg-[#F9F6EE]/90 backdrop-blur-md border-black/10 py-3 shadow-sm" 
            : "bg-[#F9F6EE] border-black/[0.05] py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6">
          
          {/* LOGO & BRAND NAME (VISIBLE ON ALL MOBILE SIZES NOW) */}
          <HashLink smooth to="/#top" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 group focus:outline-none">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-black/10 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
              <img
                src={LogoImg}
                alt="Kaiso Camp Logo"
                className="h-full w-full object-cover scale-110"
              />
            </div>
            <div className="text-left">
              <span className="font-mono text-[8px] md:text-[9px] block tracking-[0.15em] text-gray-500 font-bold uppercase leading-none">
                Outdoor Rental
              </span>
              <span className="text-[#111111] text-xs sm:text-sm font-black tracking-tight uppercase leading-tight whitespace-nowrap">
                QASH CAMP<span className="text-[#FFC107]">.</span>
              </span>
            </div>
          </HashLink>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-10 text-xs font-bold uppercase tracking-widest text-[#111111]">
            <HashLink
              smooth
              to={location.pathname === "/" ? "#choosePackage" : "/#choosePackage"}
              scroll={scrollWithOffset}
              className="hover:text-[#FFC107] transition-colors relative py-1"
            >
              Home
            </HashLink>
            
            <Link to="/contact" className="hover:text-[#FFC107] transition-colors relative py-1">
              Contact
            </Link>

            <HashLink
              smooth
              to="/#choosePackage"
              scroll={scrollWithOffset}
              className="hover:text-[#FFC107] transition-colors relative py-1"
            >
              Booking
            </HashLink>

            <HashLink
              smooth
              to="/why-us"
              scroll={scrollWithOffset}
              className="hover:text-[#FFC107] transition-colors relative py-1"
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
                className="text-xs font-bold uppercase tracking-wider bg-[#111111] hover:bg-[#FFC107] text-white hover:text-[#111111] px-5 py-2.5 rounded-full transition-all duration-300"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
                  Hi, {user.first_name}!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold uppercase tracking-wider border border-black/20 text-gray-600 px-4 py-2 rounded-full"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden flex-col justify-center items-center h-9 w-9 bg-black/[0.03] border border-black/10 rounded-full space-y-1 focus:outline-none shrink-0"
          >
            <span className={`h-0.5 w-3.5 bg-[#111111] transition-all duration-300 ${isOpen ? "transform rotate-45 translate-y-1.5" : ""}`} />
            <span className={`h-0.5 w-3.5 bg-[#111111] transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-3.5 bg-[#111111] transition-all duration-300 ${isOpen ? "transform -rotate-45 -translate-y-1.5" : ""}`} />
          </button>

        </div>

        {/* MOBILE DROPDOWN OVERLAY */}
        <div 
          className={`md:hidden absolute left-0 right-0 top-full bg-[#F9F6EE] border-b border-black/10 px-6 py-6 shadow-xl transition-all duration-300 transform ease-in-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-5 text-xs font-bold uppercase tracking-widest text-[#111111]">
            <HashLink
              smooth
              to={location.pathname === "/" ? "#choosePackage" : "/#choosePackage"}
              scroll={scrollWithOffset}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#FFC107] py-1 border-b border-black/[0.04]"
            >
              Home
            </HashLink>

            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#FFC107] py-1 border-b border-black/[0.04]"
            >
              Contact
            </Link>

            <HashLink
              smooth
              to="/#choosePackage"
              scroll={scrollWithOffset}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#FFC107] py-1 border-b border-black/[0.04]"
            >
              Booking
            </HashLink>

            <HashLink
              smooth
              to="/why-us"
              scroll={scrollWithOffset}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#FFC107] py-1 pb-3"
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
                  className="w-full text-center bg-[#111111] text-white font-bold py-3 rounded-full"
                >
                  Login
                </button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-gray-600 text-xs">Logged in: {user.first_name}</span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center bg-transparent text-red-600 border border-red-200 py-2.5 rounded-full font-bold text-xs"
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