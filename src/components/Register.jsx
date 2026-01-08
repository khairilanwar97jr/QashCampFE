import React, { useState } from "react";

export default function Register({ onClose, setAuthMode }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // ✅ Success message state

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      role: "USER",
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

        // ✅ Show success message
      setSuccessMsg(`Welcome to our community, ${firstName}!`);
     

      // Optional: reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      
// Wait 2 seconds before switching to login and closing modal
setTimeout(() => {
  setAuthMode("login"); // switch to login modal
  onClose();            // close register modal
  setSuccessMsg("");    // clear success message
}, 2000); // 2 seconds
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative text-center animate-fade p-6 bg-white rounded-xl shadow-lg w-96 mx-auto">
      {/* Top-right buttons: Close X + Reset */}
      <div className="absolute top-2 right-2 flex gap-2">

        {/* Reset button */}
        <button
          onClick={() => {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          }}
          className="text-gray-500 hover:text-gray-800 font-bold text-xl"
        >
          ⟳
        </button>
      </div>

            {/* Success message toast */}
      {successMsg && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md animate-fade-in-out">
          {successMsg}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

      <input
        type="text"
        placeholder="First Name"
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Last Name"
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
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
        onClick={() => onClose()}
        className="w-full py-3 border border-gray-400 rounded-xl mt-2 hover:bg-gray-100 transition-colors"
      >
        Continue as Guest
      </button>
    </div>
  );
}
