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
  const [activeTab, setActiveTab] = useState("receipt");
  const [packageName, setPackageName] = useState("");
  const [checklistItems, setChecklistItems] = useState([]);
  const [bookedAddOns, setBookedAddOns] = useState([]);
  const [checklistLoading, setChecklistLoading] = useState(true);
  const [checklistError, setChecklistError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

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

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        setChecklistLoading(true);
        setChecklistError("");

        const checklistResponse = await fetch(
          `${API_URL}/api/checklist/${encodeURIComponent(bookingRef)}`
        );

        const checklistResult = await checklistResponse.json();

        if (!checklistResponse.ok || checklistResult?.success === false) {
          throw new Error(
            checklistResult?.message || "The package checklist is not available yet"
          );
        }

        setPackageName(checklistResult?.package?.name ?? "");

        setChecklistItems(
          Array.isArray(checklistResult?.items) ? checklistResult.items : []
        );
        setBookedAddOns(
          Array.isArray(checklistResult?.addOns) ? checklistResult.addOns : []
        );
      } catch (err) {
        setChecklistError(err.message || "Failed to load the tent checklist");
      } finally {
        setChecklistLoading(false);
      }
    };

    fetchChecklist();
  }, [bookingRef]);

  useEffect(() => {
    if (!previewImage) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setPreviewImage(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewImage]);

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

      {/* Receipt and package checklist tabs */}
      <div style={styles.tabs} role="tablist" aria-label="Booking details">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "receipt"}
          onClick={() => setActiveTab("receipt")}
          style={{
            ...styles.tab,
            ...(activeTab === "receipt" ? styles.activeTab : {})
          }}
        >
          Receipt
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "checklist"}
          onClick={() => setActiveTab("checklist")}
          style={{
            ...styles.tab,
            ...(activeTab === "checklist" ? styles.activeTab : {})
          }}
        >
          Tent Checklist
        </button>
      </div>

      {activeTab === "receipt" ? (
        <div style={styles.container} role="tabpanel">
          {snapshot && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Initial</h3>
              <img src={snapshot} alt="Initial payment receipt" style={styles.image} />
            </div>
          )}

          {finalSnapshot && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Final</h3>
              <img src={finalSnapshot} alt="Final payment receipt" style={styles.image} />
            </div>
          )}
        </div>
      ) : (
        <div style={styles.checklistSection} role="tabpanel">
          <div style={styles.checklistHeading}>
            <div>
              <p style={styles.eyebrow}>Items included</p>
              <h2 style={styles.checklistTitle}>{packageName || "Your tent package"}</h2>
            </div>
            {!checklistLoading && !checklistError && (
              <span style={styles.itemCount}>
                {checklistItems.length} {checklistItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {checklistLoading && (
            <p style={styles.checklistMessage}>Loading your tent checklist...</p>
          )}

          {!checklistLoading && checklistError && (
            <div style={styles.checklistAlert}>{checklistError}</div>
          )}

          {!checklistLoading && !checklistError && checklistItems.length === 0 && (
            <p style={styles.checklistMessage}>No items have been added to this package yet.</p>
          )}

          {!checklistLoading && !checklistError && checklistItems.length > 0 && (
            <div style={styles.itemGrid}>
              {checklistItems.map((packageItem, index) => {
                const item = packageItem.item ?? packageItem;
                const name = item.name ?? packageItem.item_name ?? "Package item";
                const imageUrl = item.image_url ?? item.imageUrl ?? packageItem.image_url;
                const quantity =
                  packageItem.expected_quantity ?? packageItem.expectedQuantity ?? packageItem.quantity ?? 0;
                const description = item.description ?? packageItem.description;

                return (
                  <article
                    key={packageItem.id ?? item.id ?? `${name}-${index}`}
                    style={styles.itemCard}
                  >
                    <div style={styles.itemImageWrap}>
                      {imageUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ src: imageUrl, alt: name })}
                          style={styles.imageButton}
                          aria-label={`Enlarge image of ${name}`}
                        >
                          <img src={imageUrl} alt={name} style={styles.itemImage} />
                          <span style={styles.zoomHint} aria-hidden="true">＋</span>
                        </button>
                      ) : (
                        <span style={styles.imagePlaceholder} aria-hidden="true">📦</span>
                      )}
                    </div>
                    <div style={styles.itemDetails}>
                      <h3 style={styles.itemName}>{name}</h3>
                      {description && <p style={styles.itemDescription}>{description}</p>}
                    </div>
                    <div style={styles.quantityBadge} aria-label={`Quantity ${quantity}`}>
                      <span style={styles.quantityLabel}>Qty</span>
                      <strong style={styles.quantityValue}>{quantity}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!checklistLoading && !checklistError && (
            <section style={styles.addOnSection}>
              <div style={styles.sectionHeading}>
                <div>
                  <p style={styles.eyebrow}>Your reservation</p>
                  <h2 style={styles.sectionTitle}>Booked Add-ons</h2>
                </div>
                {bookedAddOns.length > 0 && (
                  <span style={styles.itemCount}>
                    {bookedAddOns.length} {bookedAddOns.length === 1 ? "add-on" : "add-ons"}
                  </span>
                )}
              </div>

              {bookedAddOns.length === 0 ? (
                <p style={styles.addOnEmpty}>No add-ons were booked for this reservation.</p>
              ) : (
                <div style={styles.itemGrid}>
                  {bookedAddOns.map((addOn, index) => (
                    <article
                      key={addOn.id ?? `${addOn.name}-${index}`}
                      style={styles.itemCard}
                    >
                      <div style={styles.itemImageWrap}>
                        {addOn.imageUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewImage({
                                src: addOn.imageUrl,
                                alt: addOn.name || "Booked add-on"
                              })
                            }
                            style={styles.imageButton}
                            aria-label={`Enlarge image of ${addOn.name || "booked add-on"}`}
                          >
                            <img
                              src={addOn.imageUrl}
                              alt={addOn.name || "Booked add-on"}
                              style={styles.itemImage}
                            />
                            <span style={styles.zoomHint} aria-hidden="true">＋</span>
                          </button>
                        ) : (
                          <span style={styles.imagePlaceholder} aria-hidden="true">📦</span>
                        )}
                      </div>
                      <div style={styles.itemDetails}>
                        <h3 style={styles.itemName}>{addOn.name || "Booked add-on"}</h3>
                      </div>
                      <div
                        style={styles.quantityBadge}
                        aria-label={`Quantity ${addOn.quantity ?? 0}`}
                      >
                        <span style={styles.quantityLabel}>Qty</span>
                        <strong style={styles.quantityValue}>{addOn.quantity ?? 0}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {previewImage && (
        <div
          style={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Image preview: ${previewImage.alt}`}
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            style={styles.lightboxClose}
            aria-label="Close image preview"
          >
            ×
          </button>
          <div style={styles.lightboxContent} onClick={(event) => event.stopPropagation()}>
            <img
              src={previewImage.src}
              alt={previewImage.alt}
              style={styles.lightboxImage}
            />
            <p style={styles.lightboxCaption}>{previewImage.alt}</p>
          </div>
        </div>
      )}
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
    marginBottom: "22px"
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

  tabs: {
    display: "flex",
    width: "100%",
    maxWidth: "520px",
    margin: "0 auto 28px",
    padding: "5px",
    gap: "5px",
    border: "1px solid #dfe4dc",
    borderRadius: "14px",
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
  },

  tab: {
    flex: 1,
    padding: "11px 14px",
    border: "none",
    borderRadius: "10px",
    background: "transparent",
    color: "#667063",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  activeTab: {
    background: "#597E52",
    color: "#fff",
    boxShadow: "0 4px 10px rgba(89,126,82,0.25)"
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

  checklistSection: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "22px",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },

  checklistHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    paddingBottom: "18px",
    borderBottom: "1px solid #edf0eb"
  },

  eyebrow: {
    margin: "0 0 3px",
    color: "#70816b",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    textTransform: "uppercase"
  },

  checklistTitle: {
    margin: 0,
    color: "#253322",
    fontSize: "21px",
    fontWeight: "800"
  },

  itemCount: {
    flexShrink: 0,
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#edf4ea",
    color: "#476641",
    fontSize: "12px",
    fontWeight: "800"
  },

  checklistMessage: {
    margin: "28px 0 8px",
    color: "#687064",
    textAlign: "center",
    fontSize: "14px"
  },

  checklistAlert: {
    marginTop: "20px",
    padding: "13px 15px",
    border: "1px solid #ead9b4",
    borderRadius: "10px",
    background: "#fff8e8",
    color: "#725b25",
    fontSize: "13px",
    textAlign: "center"
  },

  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px",
    paddingTop: "18px"
  },

  addOnSection: {
    marginTop: "28px",
    paddingTop: "22px",
    borderTop: "1px solid #e4e9e1"
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px"
  },

  sectionTitle: {
    margin: 0,
    color: "#253322",
    fontSize: "18px",
    fontWeight: "800"
  },

  addOnEmpty: {
    margin: "16px 0 2px",
    padding: "14px",
    borderRadius: "10px",
    background: "#f6f8f5",
    color: "#737b70",
    fontSize: "13px",
    textAlign: "center"
  },

  itemCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minWidth: 0,
    padding: "12px",
    border: "1px solid #e5eae2",
    borderRadius: "13px",
    background: "#fbfcfa"
  },

  itemImageWrap: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "62px",
    height: "62px",
    overflow: "hidden",
    borderRadius: "11px",
    background: "#edf1ea"
  },

  itemImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  imageButton: {
    position: "relative",
    display: "block",
    width: "100%",
    height: "100%",
    padding: 0,
    overflow: "hidden",
    border: 0,
    background: "transparent",
    cursor: "zoom-in"
  },

  zoomHint: {
    position: "absolute",
    right: "4px",
    bottom: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "rgba(24,35,22,0.78)",
    color: "#fff",
    fontSize: "15px",
    lineHeight: 1
  },

  imagePlaceholder: {
    fontSize: "25px"
  },

  itemDetails: {
    flex: 1,
    minWidth: 0
  },

  itemName: {
    margin: 0,
    color: "#293326",
    fontSize: "15px",
    fontWeight: "800"
  },

  itemDescription: {
    display: "-webkit-box",
    margin: "4px 0 0",
    overflow: "hidden",
    color: "#7a8177",
    fontSize: "12px",
    lineHeight: 1.35,
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2
  },

  quantityBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    minWidth: "48px",
    padding: "6px 8px",
    borderRadius: "10px",
    background: "#e9f1e6",
    color: "#3d5d37"
  },

  quantityLabel: {
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.7px",
    textTransform: "uppercase"
  },

  quantityValue: {
    fontSize: "18px",
    lineHeight: 1.1
  },

  lightbox: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "rgba(13,18,12,0.88)",
    backdropFilter: "blur(5px)",
    cursor: "zoom-out"
  },

  lightboxContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "min(920px, 94vw)",
    maxHeight: "90vh",
    cursor: "default"
  },

  lightboxImage: {
    display: "block",
    maxWidth: "100%",
    maxHeight: "calc(90vh - 52px)",
    objectFit: "contain",
    borderRadius: "14px",
    background: "#fff",
    boxShadow: "0 24px 70px rgba(0,0,0,0.45)"
  },

  lightboxCaption: {
    margin: "12px 0 0",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    textAlign: "center"
  },

  lightboxClose: {
    position: "fixed",
    top: "18px",
    right: "18px",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    padding: 0,
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    fontSize: "28px",
    lineHeight: 1,
    cursor: "pointer"
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
