import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReceiptPage() {
  const { bookingRef } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState(null);
  const [finalSnapshot, setFinalSnapshot] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/bookings/${bookingRef}/attachment`
        );

        const data = await res.json();

        if (data.success) {
          setSnapshot(data.summarySnapshot);
          setFinalSnapshot(data.summarySnapshotFinal);
        } else {
          setError("Receipt not found");
        }
      } catch (err) {
        setError("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [bookingRef]);

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(bookingRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loader}></div>
        <p style={styles.subText}>Loading your receipt...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.center}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Payment Receipt</h1>
        <p style={styles.subtitle}>Booking Reference</p>
        
        {/* Booking Reference with Original Copy Button Style */}
        <div style={styles.refContainer}>
          <span style={styles.ref}>{bookingRef}</span>
          <button 
            onClick={handleCopyRef}
            style={{
              ...styles.copyButton,
              backgroundColor: copied ? "#222" : "#fff",
              color: copied ? "#FFD700" : "#222",
              borderColor: copied ? "#222" : "#ccc"
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
        </div>
      </div>

      {/* Primary Action Button in Green 3D Style */}
      <div style={styles.actionSection}>
        <button 
          onClick={() => navigate("/")} 
          className="text-xs md:text-sm font-black uppercase tracking-wider text-white transition-all duration-150 active:translate-y-0.5"
          style={styles.homeButton}
        >
          🏠 Go to Homepage
        </button>
      </div>

      {/* Cards */}
      <div style={styles.container}>
        {snapshot && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Initial</h3>
            <img src={snapshot} alt="initial" style={styles.image} />
          </div>
        )}

        {finalSnapshot && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Final</h3>
            <img src={finalSnapshot} alt="final" style={styles.image} />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px 20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f6f7fb, #eef1f7)",
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
  },

  header: {
    textAlign: "center",
    marginBottom: "20px"
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0",
    color: "#222"
  },

  subtitle: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#888",
    marginBottom: "4px"
  },

  refContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "6px"
  },

  ref: {
    fontSize: "18px",
    color: "#111",
    fontWeight: "800",
    letterSpacing: "0.8px",
    fontFamily: "monospace"
  },

  copyButton: {
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: "700",
    borderRadius: "6px",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none"
  },

  actionSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "35px"
  },

  homeButton: {
    width: "100%",
    maxWidth: "280px",
    padding: "12px 24px",
    backgroundColor: "#597E52",
    border: "2px solid #3b5435",
    boxShadow: "0 4px 0px #3b5435",
    borderRadius: "12px",
    cursor: "pointer",
    outline: "none"
  },

  container: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "wrap"
  },

  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    flex: 1,
    minWidth: "300px",
    maxWidth: "520px"
  },

  cardTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#333"
  },

  image: {
    width: "100%",
    borderRadius: "12px",
    border: "1px solid #eee"
  },

  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
  },

  subText: {
    marginTop: "10px",
    color: "#666",
    fontSize: "14px"
  },

  loader: {
    width: "42px",
    height: "42px",
    border: "4px solid #ddd",
    borderTop: "4px solid #333",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};