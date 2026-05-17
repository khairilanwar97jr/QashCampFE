import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AddOn() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [addons, setAddons] = useState([]); // ✅ define state here
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/addon`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch addons");
        return res.json();
      })
      .then((data) => setAddons(data)) // ✅ set the response here
      .catch((err) => {
        console.error("Error fetching addons:", err);
        setError(err.message);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 p-10">
        <h1 className="text-3xl font-bold text-center mb-8">🌿 Choose Your Add-ons</h1>

        {error && (
          <p className="text-red-500 text-center mb-4">
            ❌ {error}
          </p>
        )}

        {addons.length === 0 ? (
          <p className="text-center text-gray-600">No add-ons available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center border border-gray-200"
              >
                <img
                  src={addon.imageUrl || "https://via.placeholder.com/150"}
                  alt={addon.name}
                  className="w-32 h-32 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold">{addon.name}</h2>
                <p className="text-gray-600 mt-2">RM {addon.price}</p>
                <p
                  className={`mt-1 text-sm ${
                    addon.avail ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {addon.avail ? "Available" : "Unavailable"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
