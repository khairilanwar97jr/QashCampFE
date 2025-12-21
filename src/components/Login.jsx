import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
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
      navigate("/dashboard");
    } else {
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center animate-fade">
        <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>

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
          className="w-full p-3 rounded-xl border border-gray-300 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Login
        </button>

        <div className="mt-4 space-y-2">
          <Link className="text-indigo-600 block" to="/register">
            Don't have an account? Register
          </Link>
          <Link className="text-indigo-600 block" to="/">
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
