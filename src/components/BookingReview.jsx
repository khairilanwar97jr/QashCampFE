import { useEffect, useId, useRef, useState } from "react";
import "./BookingReview.css";
import { compressReviewPhoto } from "./compressReviewPhoto";

const API_URL = import.meta.env.VITE_API_URL;

function Photo({ file, src, alt }) {
  const [preview, setPreview] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, src]);

  const url = file ? preview : src;
  if (!url || failed) return <span className="review-photo-unavailable">Photo unavailable</span>;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`View ${alt} (opens in a new tab)`}>
      <img src={url} alt={alt} onError={() => setFailed(true)} />
    </a>
  );
}

export default function BookingReview({ bookingRef }) {
  const id = useId();
  const [status, setStatus] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState("");
  const processingRef = useRef(false);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [photos, setPhotos] = useState([]);
  const busy = useRef(false);
  const mounted = useRef(false);
  const endpoint = `${API_URL}/api/bookings/${encodeURIComponent(bookingRef)}/review`;

  async function readStatus(signal) {
    const response = await fetch(endpoint, { signal });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to load your review. Please try again.");
    if (!["HIDDEN", "AVAILABLE", "SUBMITTED"].includes(result.status)) {
      throw new Error("Unable to load your review. Please try again.");
    }
    if (result.status === "SUBMITTED" && !result.review) {
      throw new Error("Unable to load your saved review. Please try again.");
    }
    if (mounted.current && !signal?.aborted) {
      setStatus(result.status);
      setReview(result.review ?? null);
    }
  }

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    readStatus(controller.signal)
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      mounted.current = false;
      controller.abort();
    };
  }, [endpoint]);

  async function retryStatus() {
    setLoading(true);
    setError("");
    try {
      await readStatus();
    } catch (err) {
      if (mounted.current) setError(err.message);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  async function addPhotos(event) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (processingRef.current || busy.current || !selected.length) return;
    setPhotoError("");
    if (selected.length + photos.length > 3) {
      setPhotoError("You can upload up to 3 photos. Remove a photo before adding more.");
      return;
    }
    processingRef.current = true;
    setProcessing(true);
    try {
      const compressed = [];
      for (const file of selected) {
        compressed.push(await compressReviewPhoto(file));
        if (!mounted.current) return;
      }
      setPhotos((current) => [...current, ...compressed]);
    } catch (err) {
      if (mounted.current) setPhotoError(err.message || "Unable to process these photos. Please choose different images.");
    } finally {
      processingRef.current = false;
      if (mounted.current) setProcessing(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (busy.current || processingRef.current || status !== "AVAILABLE") return;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("Please select a rating from 1 to 5 stars.");
      return;
    }
    busy.current = true;
    setSending(true);
    setError("");
    try {
      const body = new FormData();
      body.append("rating", String(rating));
      body.append("feedback", feedback.trim());
      photos.forEach((file) => body.append("photos", file));
      const response = await fetch(endpoint, { method: "POST", body });
      const result = await response.json().catch(() => ({}));
      if (!mounted.current) return;
      if (response.status === 201) {
        setSuccess("Thank you! Your review was submitted successfully.");
        if (result.review) {
          setReview(result.review);
          setStatus("SUBMITTED");
          setPhotos([]);
        } else {
          setStatus(null);
          await readStatus();
        }
      } else if (response.status === 409) {
        // Hide the editable form until the existing review has been retrieved.
        setStatus(null);
        await readStatus();
      } else if (response.status === 429) {
        setError("Too many attempts. Please wait a moment before trying again.");
      } else {
        setError(result.message || "Unable to submit your review. Please try again.");
      }
    } catch (err) {
      if (mounted.current) setError(err.message || "Unable to submit your review. Please try again.");
    } finally {
      busy.current = false;
      if (mounted.current) setSending(false);
    }
  }

  return (
    <section className="booking-review" aria-labelledby={`${id}-title`} aria-busy={loading || sending || processing}>
      <div className="review-heading">
        <div>
          <p className="review-eyebrow">Your feedback matters</p>
          <h2 id={`${id}-title`}>{status === "SUBMITTED" ? "Your review" : "Share your feedback"}</h2>
        </div>
        {status === "SUBMITTED" && <span className="review-submitted" role="status">Already submitted</span>}
      </div>

      {loading && <p role="status">Loading your review...</p>}
      {status === "HIDDEN" && (
        <p className="review-intro">The review and feedback section will be available after your camping day.</p>
      )}
      {error && <p className="review-error" role="alert">{error}</p>}
      {success && <p className="review-submitted" role="status">{success}</p>}
      {!loading && status === null && (
        <button className="review-button" type="button" onClick={retryStatus} disabled={sending}>Retry loading review</button>
      )}

      {!loading && status === "SUBMITTED" && review && (
        <div className="review-saved">
          <p className="review-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((value) => (
              <span key={value} className={value <= Number(review.rating) ? "is-filled" : ""} aria-hidden="true">★</span>
            ))}
          </p>
          {review.feedback && <p className="review-feedback">{review.feedback}</p>}
          {Array.isArray(review.photos) && review.photos.length > 0 && (
            <div className="review-photos">
              {review.photos.map((photo, index) => (
                <div className="review-photo" key={photo.id ?? index}>
                  <Photo src={photo.photo_url} alt={`Review photo ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && status === "AVAILABLE" && (
        <form onSubmit={submit}>
          <p className="review-intro">We’d love to hear how our team did and how we can improve our service.</p>
          <fieldset className="review-rating" disabled={sending}>
            <legend>Rating <span>(required)</span></legend>
            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className={`review-star-option ${value <= rating ? "is-filled" : ""}`}>
                  <input type="radio" name={`${id}-rating`} value={value} checked={rating === value}
                    onChange={() => setRating(value)} required aria-label={`${value} out of 5 stars`} />
                  <span aria-hidden="true">★</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="review-label" htmlFor={`${id}-feedback`}>Feedback <span>(optional)</span></label>
          <textarea id={`${id}-feedback`} value={feedback} onChange={(event) => setFeedback(event.target.value)}
            maxLength={5000} rows={4} disabled={sending} placeholder="Tell us about our service, from booking to tent setup and support..."
            aria-describedby={`${id}-count`} />
          <p className="review-count" id={`${id}-count`}>{feedback.length.toLocaleString()} / 5,000 characters</p>

          <div className="review-photo-invite">
          <div className="review-photo-invite-heading">
            <span className="review-camera" aria-hidden="true">📸</span>
            <div>
              <span className="review-photo-kicker">Good times deserve a photo</span>
              <label className="review-photo-title" htmlFor={`${id}-photos`}>Show off your <span>camping moments!</span></label>
            </div>
          </div>
          <p className="review-photo-copy">Cosy tents, big smiles, epic memories — let’s see yours!</p>
          <div className="review-upload-area">
          <span className="review-upload-label">Add your favourite shots <span>· Optional</span></span>
          <p className="review-help" id={`${id}-photo-help`}>Up to 3 photos · JPEG, PNG, or WebP · Maximum 20 MB per original photo. We automatically resize and compress photos before upload.</p>
          <input id={`${id}-photos`} className="review-file" type="file" multiple accept="image/jpeg,image/png,image/webp"
            onChange={addPhotos} disabled={sending || processing || photos.length >= 3} aria-describedby={`${id}-photo-help ${id}-photo-error`} />
          </div>
          {processing && <p className="review-help" role="status">Preparing photos…</p>}
          <p id={`${id}-photo-error`} className={photoError ? "review-error" : ""} role="alert">{photoError}</p>
          {photos.length > 0 && (
            <div className="review-photos">
              {photos.map((file, index) => (
                <div className="review-photo" key={`${file.name}-${file.lastModified}-${index}`}>
                  <Photo file={file} alt={`Selected photo ${index + 1}: ${file.name}`} />
                  <p className="review-help">{Math.ceil(file.size / 1024)} KB · Ready to upload</p>
                  <button type="button" className="review-remove" disabled={sending || processing} aria-label={`Remove photo ${index + 1}: ${file.name}`}
                    onClick={() => { setPhotos((current) => current.filter((_, i) => i !== index)); setPhotoError(""); }}>Remove</button>
                </div>
              ))}
            </div>
          )}
          </div>
          <button className="review-button review-submit" type="submit" disabled={sending || processing}>
            {sending ? "Submitting review…" : processing ? "Preparing photos…" : "Submit review"}
          </button>
        </form>
      )}
    </section>
  );
}
