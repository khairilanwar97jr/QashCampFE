import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  function logout() {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  }

  return (
    <div className="center">
      <div className="card">
        <h2>
          {isLoggedIn ? `Welcome, ${user.name}` : "Welcome, Guest"}
        </h2>

        {isLoggedIn && <button onClick={logout}>Logout</button>}
      </div>
    </div>
  );
}
