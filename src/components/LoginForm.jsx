import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register"; // make sure you have this component

export default function LoginForm({ onClose, setAuthMode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      alert("No user found. Please register first.");
      return;
    }
    if (email === savedUser.email && password === savedUser.password) {
      localStorage.setItem("loggedIn", "true");
      onClose();
      navigate("/dashboard"); // or "/" if you prefer
    } else {
      alert("Invalid credentials.");
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
      className="text-center animate-fade p-6 rounded-3xl shadow-lg w-full max-w-md mx-auto"
      style={{ backgroundColor: "#F1E4C3", color: "#3B2F1F" }} // background + text
    >
      {" "}
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
      <button
        onClick={handleLogin}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors mt-4"
      >
        Login
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
    </div>
  );
}
