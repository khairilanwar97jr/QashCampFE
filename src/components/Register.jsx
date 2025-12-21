import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ onClose, setAuthMode }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Placeholder for future backend API call
    const payload = { name, email, password };
    console.log("Register payload:", payload);
    // Example: await api.register(payload);

    alert("Registration successful!"); // Temporary feedback
    onClose(); // close modal
    navigate("/dashboard"); // or wherever you want to go after register
  };

  return (
    <div className="text-center animate-fade">
      <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors mt-4"
      >
        Register
      </button>

      <button
        onClick={() => setAuthMode("login")}
        className="w-full py-3 border border-indigo-600 text-indigo-600 rounded-xl mt-2 hover:bg-indigo-50 transition-colors"
      >
        Back to Login
      </button>

      <button
        onClick={() => { onClose(); navigate("/"); }}
        className="w-full py-3 border border-gray-400 rounded-xl mt-2 hover:bg-gray-100 transition-colors"
      >
        Continue as Guest
      </button>
    </div>
  );
}
