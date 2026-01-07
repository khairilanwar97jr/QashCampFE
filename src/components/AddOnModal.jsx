import { useEffect, useState } from "react";

export default function AddOnModal({ onClose, onSave, selected }) {
  const [addons, setAddons] = useState([]);
  const [selectedItems, setSelectedItems] = useState(selected);

 
  const API_URL = import.meta.env.VITE_API_URL; // your Node.js backend

  // Fetch add-ons from Node.js backend
  useEffect(() => {
    fetch(`${API_URL}/api/addon`)
      .then((res) => res.json())
      .then((data) => setAddons(data))
      .catch((err) => console.error("Error fetching addons:", err));
  }, []);

  const toggleAddOn = (item) => {
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemove = (id) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl relative flex flex-col md:flex-row gap-6">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Left: Add-ons Grid */}
        <div className="flex-1 max-h-[60vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
            🏕️ Choose Your Add-Ons
          </h2>

          {addons.length === 0 ? (
            <p className="text-center text-gray-600">No add-ons available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addons.map((addon) => {
                const isSelected = selectedItems.some((i) => i.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon)}
                    className={`bg-white border rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md cursor-pointer transition 
                      ${isSelected ? "ring-2 ring-blue-400" : "border-gray-200"}`}
                  >
                    <img
                      src={addon.imageUrl || "https://via.placeholder.com/150"}
                      alt={addon.name}
                      className="w-32 h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{addon.name}</h3>
                    <p className="text-gray-600 mt-1">RM {addon.price}</p>
                    <p className={`mt-1 text-sm ${addon.available  ? "text-green-600" : "text-red-500"}`}>
                      {addon.available  ? "Available" : "Unavailable"}
                    </p>
                    <input type="checkbox" readOnly checked={isSelected} className="mt-2 w-5 h-5 accent-blue-600" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Add-Ons Panel */}
        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-4 max-h-[60vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Selected Add-Ons</h2>
          {selectedItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No add-ons selected yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {selectedItems.map(item => (
                <li key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">RM {item.price}</div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buttons at bottom */}
        <div className="mt-6 w-full flex justify-end gap-3 md:absolute md:bottom-6 md:right-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedItems)}
            className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
