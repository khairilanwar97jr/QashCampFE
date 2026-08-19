import { useEffect, useState } from "react";

export default function AddOnModal({ onClose, onSave, selected, startDate, endDate, readOnly = false }) {
  const [addons, setAddons] = useState([]);
  const [selectedItems, setSelectedItems] = useState(selected);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL; // your Node.js backend

  useEffect(() => {
    const controller = new AbortController();

    if (!startDate || !endDate) {
      setAddons([]);
      setError("Select a start date and end date before choosing add-ons.");
      setIsLoading(false);
      return () => controller.abort();
    }

    const params = new URLSearchParams({ startDate, endDate });
    setIsLoading(true);
    setError("");

    fetch(`${API_URL}/api/addon/availability?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load add-on availability.");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid availability response.");

        setAddons(data);
        setSelectedItems((items) =>
          items.flatMap((item) => {
            const current = data.find((addOn) => addOn.id === item.id);
            const availableQuantity = Math.max(
              0,
              Math.floor(Number(current?.availableQuantity) || 0)
            );

            if (!current?.available || availableQuantity === 0) return [];

            return [{
              ...current,
              selectedQuantity: Math.min(
                Math.max(1, Math.floor(Number(item.selectedQuantity) || 1)),
                availableQuantity
              ),
            }];
          })
        );
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Error fetching add-on availability:", err);
        setAddons([]);
        setSelectedItems([]);
        setError(err.message || "Unable to load add-on availability.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [API_URL, startDate, endDate]);

  const getQuantity = (item) => {
    const quantity = Number(item.availableQuantity);
    return Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0;
  };

  const isAddOnAvailable = (item) => item.available && getQuantity(item) > 0;

  const toggleAddOn = (item) => {
    if (readOnly || !isAddOnAvailable(item)) return; // Preview only or unavailable
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, { ...item, selectedQuantity: 1 }]);
    }
  };

  const changeSelectedQuantity = (item, change) => {
    const currentQuantity = Number(item.selectedQuantity || 1);
    const nextQuantity = currentQuantity + change;

    if (nextQuantity < 1) {
      handleRemove(item.id);
      return;
    }

    if (nextQuantity > getQuantity(item)) return;

    setSelectedItems((items) =>
      items.map((selectedItem) =>
        selectedItem.id === item.id
          ? { ...selectedItem, selectedQuantity: nextQuantity }
          : selectedItem
      )
    );
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
            <div>
              <h2 
                className="text-xl sm:text-2xl font-bold tracking-wide pl-3 border-l-4"
                style={{ color: "#43613D", borderColor: "#B39658" }}
              >
                🏕️ Choose Your Add-Ons
              </h2>
              <p className="mt-1.5 pl-4 text-[11px] font-bold text-stone-500">
                Availability for {startDate} to {endDate}
              </p>
            </div>
            <button
              className="text-stone-400 hover:text-stone-700 text-xl font-bold transition-colors md:hidden"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {isLoading ? (
            <p className="text-center py-8 text-xs font-semibold italic text-stone-500">
              Checking add-on availability…
            </p>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-center">
              <p className="text-xs font-bold text-red-700">Add-on selection is unavailable</p>
              <p className="mt-1 text-xs text-red-600">{error}</p>
            </div>
          ) : addons.length === 0 ? (
            <p className="text-center py-8 text-xs font-semibold italic text-stone-500">No auxiliary customizations available.</p>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 max-h-[40vh] md:max-h-[55vh]">
              {addons.map((addon) => {
                const isSelected = selectedItems.some((i) => i.id === addon.id);
                const selectedItem = selectedItems.find((i) => i.id === addon.id);
                const quantity = getQuantity(addon);
                const isAvailable = isAddOnAvailable(addon);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon)}
                    className={`border rounded-xl p-2 sm:p-3 flex flex-col items-center text-center transition-all duration-200 relative group
                      ${readOnly || !isAvailable ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md transform active:scale-[0.99]"}
                      ${!isAvailable ? "opacity-50" : ""}
                      ${readOnly ? "shadow-[0_5px_14px_rgba(75,85,99,0.22)] grayscale-[20%]" : ""}
                    `}
                    style={{ 
                      backgroundColor: readOnly ? "#F3F4F6" : isSelected ? "#F3EDE0" : "#EBE2CD", 
                      borderColor: readOnly ? "#B8BDC5" : isSelected ? "#43613D" : "#D3C6A2"
                    }}
                  >
                    {/* Status Ribbon Badge */}
                    <span 
                      className={`absolute top-2 right-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border
                        ${isAvailable && !readOnly
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300" 
                          : "bg-stone-200 text-stone-500 border-stone-300"
                        }
                      `}
                    >
                      {isAvailable ? (readOnly ? "View Only" : "Ready") : "Sold Out"}
                    </span>

                    <img
                      src={addon.imageUrl || "https://via.placeholder.com/150"}
                      alt={addon.name}
                      className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg mb-2 shadow-xs border bg-white"
                      style={{ borderColor: "#D3C6A2" }}
                    />
                    
                    <h3 className="text-sm font-bold text-stone-800 tracking-tight">{addon.name}</h3>
                    <p className="text-xs font-bold mt-0.5" style={{ color: "#43613D" }}>RM {addon.price}</p>
                    {isAvailable && (
                      <span
                        className="mt-1 rounded-md border bg-white/90 px-2 py-0.5 text-[10px] font-bold text-stone-700"
                        style={{ borderColor: "#D3C6A2" }}
                      >
                        {quantity} available
                      </span>
                    )}
                    
                    <input 
                      type="checkbox" 
                      readOnly 
                      disabled={readOnly || !isAvailable}
                      checked={isSelected} 
                      className="mt-2 w-4 h-4 cursor-pointer accent-stone-900 pointer-events-none" 
                    />

                    {!readOnly && isSelected && quantity > 1 && (
                      <div
                        className="mt-2 flex items-center gap-2 rounded-lg border bg-white px-2 py-1"
                        style={{ borderColor: "#D3C6A2" }}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => changeSelectedQuantity(selectedItem, -1)}
                          className="h-6 w-6 rounded-md bg-stone-200 font-bold text-stone-700 hover:bg-stone-300"
                          aria-label={`Remove one ${addon.name}`}
                        >
                          −
                        </button>
                        <span className="min-w-5 text-xs font-bold text-stone-800">
                          {selectedItem.selectedQuantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeSelectedQuantity(selectedItem, 1)}
                          disabled={(selectedItem.selectedQuantity || 1) >= quantity}
                          className="h-6 w-6 rounded-md bg-stone-800 font-bold text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Add one ${addon.name}`}
                        >
                          +
                        </button>
                      </div>
                    )}
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
            {readOnly ? "Add-on Information" : "Auxiliary Customizations Selected"}
          </p>
          
          {readOnly ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-900">
              <p className="font-bold">Available during final payment</p>
              <p className="mt-1 leading-relaxed">
                This is preview only. Add-ons can be selected for a walk-in booking or when completing final payment. Your initial booking reserves the tent package only.
              </p>
            </div>
          ) : selectedItems.length === 0 ? (
            <p className="text-xs italic text-stone-500 py-4 text-center">No auxiliary items selected yet.</p>
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
                      <div className="font-semibold text-stone-800 truncate">
                        {item.name}{(item.selectedQuantity || 1) > 1 ? ` × ${item.selectedQuantity}` : ""}
                      </div>
                      <div className="font-bold text-[11px]" style={{ color: "#43613D" }}>
                        +RM {Number(item.price || 0) * (item.selectedQuantity || 1)}
                      </div>
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
              onClick={() => readOnly ? onClose() : onSave(selectedItems)}
              disabled={!readOnly && (isLoading || Boolean(error))}
              className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all shadow-md active:scale-95 border bg-stone-950 hover:bg-stone-900 border-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ borderColor: "#FFD700" }} // Sharp Brand Yellow Active Border Accent
            >
              {readOnly ? "Close" : "Save"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
