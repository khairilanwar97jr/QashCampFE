import { useEffect, useState } from "react";

function Packages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/packages`)
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div>
      <h2>Available Packages</h2>

      {packages.map(pkg => (
        <label key={pkg.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={pkg.enabled}
            readOnly
          />
          <span style={{ marginLeft: "8px" }}>{pkg.name}</span>
        </label>
      ))}
    </div>
  );
}

export default Packages;
