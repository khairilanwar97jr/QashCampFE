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
    if (!item.available) return; // Prevent selection if unavailable
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemove = (id) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn">
      {/* Main Container styled with Toasted Cream Canvas (#FDFBF7) and Rich Taupe Trace (#E5DCB9) */}
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row gap-6 border max-h-[90vh] p-5 sm:p-6 md:p-8 relative overflow-hidden"
        style={{ backgroundColor: "#FDFBF7", borderColor: "#E5DCB9" }}
      >
        
        {/* Left: Add-ons Content Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b pb-3 mb-4 flex items-center justify-between" style={{ borderColor: "#E5DCB9" }}>
            <h2 
              className="text-xl sm:text-2xl font-bold tracking-wide pl-3 border-l-4"
              style={{ color: "#43613D", borderColor: "#B39658" }}
            >
              🏕️ Choose Your Add-Ons
            </h2>
            <button
              className="text-stone-400 hover:text-stone-700 text-xl font-bold transition-colors md:hidden"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {addons.length === 0 ? (
            <p className="text-center py-8 text-xs font-semibold italic text-stone-500">No auxiliary customizations available.</p>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[40vh] md:max-h-[55vh]">
              {addons.map((addon) => {
                const isSelected = selectedItems.some((i) => i.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon)}
                    className={`border rounded-xl p-3 flex flex-col items-center text-center transition-all duration-200 relative group
                      ${!addon.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-md transform active:scale-[0.99]"}
                    `}
                    style={{ 
                      backgroundColor: isSelected ? "#F3EDE0" : "#EBE2CD", 
                      borderColor: isSelected ? "#43613D" : "#D3C6A2"
                    }}
                  >
                    {/* Status Ribbon Badge */}
                    <span 
                      className={`absolute top-2 right-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border
                        ${addon.available 
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300" 
                          : "bg-stone-200 text-stone-500 border-stone-300"
                        }
                      `}
                    >
                      {addon.available ? "Ready" : "Sold Out"}
                    </span>

                    <img
                      src={addon.imageUrl || "https://via.placeholder.com/150"}
                      alt={addon.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg mb-2 shadow-xs border bg-white"
                      style={{ borderColor: "#D3C6A2" }}
                    />
                    
                    <h3 className="text-sm font-bold text-stone-800 tracking-tight">{addon.name}</h3>
                    <p className="text-xs font-bold mt-0.5" style={{ color: "#43613D" }}>RM {addon.price}</p>
                    
                    <input 
                      type="checkbox" 
                      readOnly 
                      disabled={!addon.available}
                      checked={isSelected} 
                      className="mt-2 w-4 h-4 cursor-pointer accent-stone-900 pointer-events-none" 
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Add-Ons Panel - Roasted Latte Style (#EBE2CD) */}
        <div 
          className="w-full md:w-80 rounded-xl p-4 flex flex-col border max-h-[30vh] md:max-h-full"
          style={{ backgroundColor: "#EBE2CD", borderColor: "#D3C6A2" }}
        >
          <p className="font-bold text-[10px] uppercase tracking-wider mb-2 border-b pb-1.5" style={{ color: "#9E8243", borderColor: "#D3C6A2" }}>
            Auxiliary Customizations Selected
          </p>
          
          {selectedItems.length === 0 ? (
            <p className="text-xs italic text-stone-500 py-4 text-center">No auxiliary items items selected yet.</p>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1">
              <ul className="space-y-2 text-xs">
                {selectedItems.map(item => (
                  <li 
                    key={item.id} 
                    className="flex justify-between items-center bg-stone-100/60 px-2.5 py-2 rounded-lg border animate-fadeIn"
                    style={{ borderColor: "#D3C6A2" }}
                  >
                    <div className="max-w-[80%]">
                      <div className="font-semibold text-stone-800 truncate">{item.name}</div>
                      <div className="font-bold text-[11px]" style={{ color: "#43613D" }}>+RM {item.price}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                      className="text-stone-400 hover:text-red-600 transition-colors text-sm p-1"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Row Actions (Desktop Bottom Snap) */}
          <div className="flex gap-2 pt-4 mt-auto border-t" style={{ borderColor: "#D3C6A2" }}>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-colors bg-white text-stone-800 hover:bg-stone-50"
              style={{ borderColor: "#D3C6A2" }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(selectedItems)}
              className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all shadow-md active:scale-95 border bg-stone-950 hover:bg-stone-900 border-stone-950"
              style={{ borderColor: "#FFD700" }} // Sharp Brand Yellow Active Border Accent
            >
              Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}