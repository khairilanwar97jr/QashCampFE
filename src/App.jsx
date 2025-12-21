import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Booking from "./pages/Booking";
import AddOn from "./pages/AddOn";
import ContactPage from "./pages/ContactPage";
import WhyChooseUs from "./pages/WhyChooseUs";

// Auth Pages
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/addon" element={<AddOn />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/why-us" element={<WhyChooseUs />} />

            {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
