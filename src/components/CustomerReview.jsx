import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Expand, MapPin, MessageSquareQuote, Package, Star, X } from "lucide-react";
import { loadCustomerReviews } from "./customerReviewData";
import reviewBackground from "../assets/parraleximage.jpg";
import "./CustomerReview.css";

const API_URL = import.meta.env.VITE_API_URL;

const wrap = (index, count) => ((index % count) + count) % count;

function ReviewStars({ rating }) {
  return (
    <span className="inline-flex gap-1 text-[#b77912]" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star key={value} size={17} fill={value <= Math.round(rating) ? "currentColor" : "none"} aria-hidden="true" />
      ))}
    </span>
  );
}

function ReviewPhotoDialog({ selected, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="customer-review-photo-dialog" aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="customer-review-photo-dialog-inner">
        <div className="customer-review-photo-dialog-header">
          <h3 id={titleId}>Camping photo {selected.index + 1} from {selected.name}</h3>
          <button type="button" onClick={onClose} autoFocus aria-label="Close enlarged photo"><X size={22} aria-hidden="true" /><span>Close</span></button>
        </div>
        {failed ? <p className="customer-review-photo-dialog-error" role="status">This photo is unavailable.</p> : (
          <img src={selected.photo.url} alt={`Camping photo ${selected.index + 1} from ${selected.name}`} decoding="async" onError={() => setFailed(true)} />
        )}
      </div>
    </dialog>
  );
}

function ReviewPhoto({ photo, name, index, active, onOpenPhoto }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="customer-review-photo-fallback"><MessageSquareQuote size={32} aria-hidden="true" />Photo unavailable</span>;
  return (
    <button type="button" className="customer-review-photo-link" onClick={() => onOpenPhoto({ photo, name, index })} tabIndex={active ? 0 : -1}
      aria-haspopup="dialog" aria-label={`Enlarge camping photo ${index + 1} from ${name}`}>
      <img src={photo.url} alt={`Camping photo ${index + 1} from ${name}`} loading="eager" decoding="async" onError={() => setFailed(true)} />
      <span className="customer-review-photo-expand" aria-hidden="true"><Expand size={14} /><span>View full photo</span></span>
    </button>
  );
}

function ReviewGallery({ photos, name, active, onOpenPhoto }) {
  if (!photos.length) return null;
  return (
    <div className={`customer-review-gallery ${photos.length > 1 ? "has-multiple" : ""} ${photos.length === 3 ? "has-three" : ""}`}>
      {photos.map((photo, index) => (
        <ReviewPhoto key={`${photo.id ?? index}-${photo.url}`} photo={photo} name={name} index={index} active={active} onOpenPhoto={onOpenPhoto} />
      ))}
    </div>
  );
}

const ReviewCard = memo(function ReviewCard({ review, active, expanded, onToggle, onOpenPhoto }) {
  const textId = useId();
  const { name, feedback, campingDate, submittedDate } = review;

  return (
    <article className={`customer-review-card ${active ? "is-active" : ""}`}>
      <div className="customer-review-body">
      <div className="mb-4 flex shrink-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf0e4] text-lg font-bold text-[#476440]" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h3 className="break-words text-sm font-bold text-[#293b28]">{name}</h3>
          <p className="text-xs text-[#74766a]">
            {submittedDate ? <>Reviewed <time dateTime={submittedDate.iso}>{submittedDate.label}</time></> : "Review date unavailable"}
          </p>
        </div>
      </div>
      <ReviewStars rating={Number(review.rating)} />
      {feedback && (
        <div className="customer-review-copy mt-3" tabIndex={active ? 0 : -1} role="region" aria-label={`Review details from ${name}`}>
          <div className="customer-review-trip">
            {review.package_name && <p><Package size={14} aria-hidden="true" /><span>Package: {review.package_name}</span></p>}
            <p><MapPin size={14} aria-hidden="true" /><span>{review.camp_place}</span></p>
            <p><CalendarDays size={14} aria-hidden="true" /><span>{campingDate ? <>Camping date: <time dateTime={campingDate.iso}>{campingDate.label}</time></> : "Camping date not shared"}</span></p>
          </div>
          <p id={textId} className="whitespace-pre-wrap break-words text-sm leading-7 text-[#555c50]">
            {!expanded && feedback.length > 180 ? `${feedback.slice(0, 180).trimEnd()}…` : feedback}
          </p>
          {feedback.length > 180 && (
            <button type="button" onClick={onToggle} tabIndex={active ? 0 : -1} aria-expanded={expanded} aria-controls={textId}
              className="mt-2 min-h-11 rounded text-sm font-bold text-[#476440] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#476440]">
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}
      </div>
      <ReviewGallery key={review.id} photos={review.photos} name={name} active={active} onOpenPhoto={onOpenPhoto} />
    </article>
  );
});

export default function CustomerReview() {
  const titleId = useId();
  const stageId = useId();
  const sectionRef = useRef(null);
  const touchStart = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const [position, setPosition] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [validReviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const count = validReviews.length;
  const activeIndex = count ? wrap(position, count) : 0;
  const autoplay = count > 1 && inView && !reducedMotion && !hovered && !focused && !hidden && !expanded && !selectedPhoto;
  const firstDot = Math.max(0, Math.min(activeIndex - 2, count - 5));
  const dotReviews = validReviews.slice(firstDot, firstDot + 5);
  const toggleExpanded = useCallback(() => setExpanded((value) => !value), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    loadCustomerReviews(API_URL, controller.signal)
      .then((reviews) => {
        if (controller.signal.aborted) return;
        setReviews(reviews);
        setPosition(0);
        setExpanded(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Unable to load customer reviews. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);

  useEffect(() => {
    const updateVisibility = () => setHidden(document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!autoplay) return undefined;
    const timer = window.setTimeout(() => setPosition((current) => current + 1), 3500);
    return () => window.clearTimeout(timer);
  }, [autoplay, position]);

  function move(step) {
    setExpanded(false);
    setPosition((current) => current + step);
  }

  return (
    <section ref={sectionRef} id="customer-reviews" aria-labelledby={titleId} className="customer-reviews-section px-4 py-12 sm:px-8 sm:py-16">
      <div className="customer-reviews-backdrop" aria-hidden="true">
        <img className="customer-reviews-background" src={reviewBackground} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="customer-reviews-content mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="customer-reviews-heading max-w-xl text-left">
            <p className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#64764e]">
              <MessageSquareQuote size={16} aria-hidden="true" /> From our camping community
            </p>
            <h2 id={titleId} className="text-3xl leading-tight text-[#3f5d38] sm:text-4xl" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Happy campers, honest reviews.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#626953] sm:text-base">
              Little stories from the great outdoors. Hear what our campers have to say about their Qashcamp experience.
            </p>
          </div>
          <div className="customer-reviews-rating inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-[#d9ddce] bg-[#fffdf8] px-5 py-3 text-[#476440]">
            <Star size={22} fill="currentColor" className="text-[#b77912]" aria-hidden="true" />
            <div>
              <p className="text-xl font-extrabold leading-tight" aria-label="Overall rating: 4.8 out of 5 stars">4.8 <span className="text-sm font-medium text-[#626953]">/ 5</span></p>
              <p className="mt-0.5 text-xs font-semibold">Customer reviews</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="customer-review-state" role="status">Loading camper reviews...</div>
        ) : error ? (
          <div className="customer-review-state">
            <p role="alert">{error}</p>
            <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-4 rounded-lg bg-[#476440] px-5 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#476440]">Try again</button>
          </div>
        ) : count ? (
          <div className="customer-review-carousel" role="region" aria-roledescription="carousel" aria-label="Customer reviews"
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
            <div id={stageId} className="customer-review-stage"
              onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; setHovered(true); }}
              onTouchCancel={() => { touchStart.current = null; setHovered(false); }}
              onTouchEnd={(event) => {
                if (touchStart.current && count > 1) {
                  const dx = event.changedTouches[0].clientX - touchStart.current.x;
                  const dy = event.changedTouches[0].clientY - touchStart.current.y;
                  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
                }
                touchStart.current = null;
                setHovered(false);
              }}>
              {(count === 1 ? [0] : [-2, -1, 0, 1, 2]).map((offset) => {
                const sequence = position + offset;
                const index = wrap(sequence, count);
                const active = offset === 0;
                return (
                  <div key={sequence} className="customer-review-slide"
                    style={{
                      transform: `translate3d(${offset * 96}%, 0, 0) scale(${active ? 1 : 0.84})`,
                      opacity: Math.abs(offset) > 1 ? 0 : active ? 1 : 0.65,
                      zIndex: active ? 2 : 1,
                      pointerEvents: active ? "auto" : "none",
                      transition: reducedMotion ? "none" : undefined,
                    }}
                    role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} aria-hidden={!active}>
                    <ReviewCard review={validReviews[index]} active={active} expanded={active && expanded} onToggle={toggleExpanded} onOpenPhoto={setSelectedPhoto} />
                  </div>
                );
              })}
            </div>
            {count > 1 && <div className="customer-review-controls">
              <button type="button" onClick={() => move(-1)} aria-label="Previous review" aria-controls={stageId}><ChevronLeft size={19} /></button>
              <div className="customer-review-dots" aria-label="Choose a review">
                {dotReviews.map((review, dotIndex) => {
                  const index = firstDot + dotIndex;
                  return (
                  <button key={review.id ?? index} type="button" onClick={() => move(index - activeIndex)}
                    aria-label={`Show review ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} aria-controls={stageId}>
                    <span className={index === activeIndex ? "is-active" : ""} />
                  </button>
                  );
                })}
              </div>
              <button type="button" onClick={() => move(1)} aria-label="Next review" aria-controls={stageId}><ChevronRight size={19} /></button>
            </div>}
            <p className="sr-only" aria-live={autoplay ? "off" : "polite"} aria-atomic="true">Review {activeIndex + 1} of {count}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-[#dfe2d5] bg-[#fffdf8] px-6 py-10 text-center sm:py-12">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf1e5] text-[#597e52]">
              <MessageSquareQuote size={27} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <h3 className="text-lg font-bold text-[#3f5136]">Every camping trip has a story</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#707364]">
              Camper reviews will appear here, from cosy tent nights to memorable outdoor adventures.
            </p>
          </div>
        )}
        <p className="customer-reviews-footer mt-5 text-center text-xs leading-5 text-[#737766]">A little feedback goes a long way. Thank you for being part of Qashcamp.</p>
      </div>
      {selectedPhoto && <ReviewPhotoDialog selected={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </section>
  );
}
