import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onClose, setAuthMode, setUser }) {
  const navigate = useNavigate();
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
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
        setWelcomeMessage(`Welcome, ${data.user.first_name}!`);
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
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      setError("Server error");
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
<div
  className={`text-center animate-fade p-6 rounded-3xl shadow-lg w-full max-w-md mx-auto transition-opacity duration-700 ${
    modalVisible ? "opacity-100" : "opacity-0"
  }`}
  style={{ backgroundColor: "#F1E4C3", color: "#3B2F1F" }}
>
      <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-xl border border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors mt-4"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <button
        onClick={handleGuest}
        className="w-full py-3 border border-gray-400 rounded-xl mt-2 hover:bg-gray-100 transition-colors"
      >
        Continue as Guest
      </button>

      <button
        onClick={() => setAuthMode("register")}
        className="w-full py-3 border border-indigo-600 text-indigo-600 rounded-xl mt-2 hover:bg-indigo-50 transition-colors"
      >
        Register
      </button>

      <button
        onClick={handleForgot}
        className="mt-4 block text-sm hover:underline"
        style={{ color: "#9f760eff" }}
      >
        Forgot Password?
      </button>

      {welcomeMessage && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-opacity duration-500 ${
            showToast ? "opacity-100" : "opacity-0"
          }`}
        >
          {welcomeMessage}
        </div>
      )}
    </div>
  );
}
