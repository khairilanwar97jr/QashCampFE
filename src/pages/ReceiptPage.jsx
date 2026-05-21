import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

  const API_URL = import.meta.env.VITE_API_URL;

export default function ReceiptPage() {
  const { bookingRef } = useParams();

  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState(null);
  const [finalSnapshot, setFinalSnapshot] = useState(null);
  const [error, setError] = useState("");

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
        <p style={styles.ref}>{bookingRef}</p>
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
    marginBottom: "30px"
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
    color: "#888"
  },

  ref: {
    fontSize: "14px",
    marginTop: "6px",
    color: "#444",
    fontWeight: "600",
    letterSpacing: "0.5px"
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