import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onClose, setAuthMode, setUser }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        // Show toast
        setWelcomeMessage(`Welcome back, ${data.user.first_name}!`);
        setShowToast(true);

        setLoading(false);

        // Start fade out toast
        setTimeout(() => setShowToast(false), 1500);

        // Start fade out modal slightly later (for smooth effect)
        setTimeout(() => setModalVisible(false), 1500);

        // Actually close the modal in parent after fade finishes
        setTimeout(() => onClose(), 2000);
      } else {
        setLoading(false);
        setError(data.message || "Login credentials invalid");
      }
    } catch (err) {
      setLoading(false);
      setError("Server connectivity error");
      console.error(err);
    }
  };

  const handleGuest = () => {
    onClose();
    navigate("/"); // continue as guest
  };

  const handleForgot = () => {
    alert("Password reset feature coming soon!");
  };

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div
        className={`w-full p-8 rounded-2xl bg-[#E6DFD3] border border-[#C6BCAB] shadow-[0_20px_50px_rgba(43,38,31,0.15)] text-[#2B261F] font-sans transition-all duration-700 relative overflow-hidden ${
          modalVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#736B5E] font-bold block mb-2">
            Basecamp Access
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#2B261F]">
            Welcome Back<span className="text-[#FFC107]">.</span>
          </h2>
        </div>

        {/* INPUT FIELDS */}
        <div className="space-y-4 text-left">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#736B5E] font-bold mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              className="w-full p-3.5 rounded-xl border border-[#C6BCAB] bg-[#DCD3C1]/50 focus:bg-[#DCD3C1] text-sm text-[#2B261F] placeholder-[#8A8070] focus:outline-none focus:border-[#2B261F] transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#736B5E] font-bold">
                Password
              </label>
              <button
                onClick={handleForgot}
                className="font-mono text-[10px] uppercase tracking-wider text-[#736B5E] hover:text-[#2B261F] font-bold transition-colors"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3.5 rounded-xl border border-[#C6BCAB] bg-[#DCD3C1]/50 focus:bg-[#DCD3C1] text-sm text-[#2B261F] placeholder-[#8A8070] focus:outline-none focus:border-[#2B261F] transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-[#D4C3B3] border border-[#BFA895] flex items-center gap-2 text-left">
            <svg className="w-4 h-4 text-red-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-xs font-semibold text-red-900 font-sans">{error}</p>
          </div>
        )}

        {/* PRIMARY SUBMIT CONTROL */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 py-4 bg-[#2B261F] hover:bg-[#FFC107] text-white hover:text-[#2B261F] font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-[#C6BCAB] disabled:text-[#8A8070] disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            "Sign In"
          )}
        </button>

        {/* SEPARATOR LINER */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute w-full border-t border-[#C6BCAB]"></div>
          <span className="relative bg-[#E6DFD3] px-3 font-mono text-[9px] uppercase tracking-wider text-[#736B5E] font-bold">
            Or Account Options
          </span>
        </div>

        {/* SECONDARY CONTROL ACTION GRID */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGuest}
            className="w-full py-3.5 border border-[#C6BCAB] hover:border-[#2B261F] rounded-xl font-bold text-xs uppercase tracking-wider text-[#524A3E] hover:text-[#2B261F] transition-all bg-transparent"
          >
            As Guest
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className="w-full py-3.5 bg-[#DCD3C1] hover:bg-[#FFC107]/20 text-[#2B261F] border border-transparent hover:border-[#FFC107]/30 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
          >
            Register
          </button>
        </div>
      </div>

      {/* MINIMALIST POP-UP STATUS TOAST */}
      {welcomeMessage && (
        <div
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#2B261F] text-white px-5 py-3.5 rounded-xl shadow-xl z-50 flex items-center gap-2.5 transition-all duration-500 border border-neutral-800/50 max-w-sm w-[90%] ${
            showToast ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <svg className="w-4 h-4 text-[#FFC107] shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="font-sans text-xs font-bold tracking-wide uppercase">{welcomeMessage}</span>
        </div>
      )}
    </div>
  );
}