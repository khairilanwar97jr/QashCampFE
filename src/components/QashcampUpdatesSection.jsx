import { useEffect, useRef, useState } from "react";
import "./QashcampUpdatesSection.css";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Megaphone, Tent, Camera, ArrowUpRight } from "lucide-react";
import { FaTiktok, FaFacebook } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

function BulletinImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <p className="text-sm text-[#636252]">Photo unavailable</p>;
  return <img src={src} alt={alt} draggable={false} onError={() => setFailed(true)}
    className="pointer-events-none block h-auto max-h-full max-w-full select-none rounded-xl" />;
}

function StoryDialog({ story, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);
  return <dialog ref={dialog} className="bulletin-dialog" aria-labelledby="bulletin-story-title" onCancel={onClose}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="bulletin-dialog-inner">
      <button type="button" className="bulletin-close" onClick={onClose} autoFocus aria-label="Close story">×</button>
      <p className="bulletin-kicker">The Qashcamp journal</p>
      <h2 id="bulletin-story-title">{story.title}</h2>
      <StoryDate date={story.date} />
      <p className="bulletin-full-text">{story.body}</p>
      <div className="bulletin-gallery">
        {story.images.map((src, i) => <figure key={src}>
          <BulletinImage src={src} alt={`${story.title} — photo ${i + 1}`} />
          <figcaption>Photo {i + 1} of {story.images.length}</figcaption>
        </figure>)}
      </div>
    </div>
  </dialog>;
}

function StoryDate({ date }) {
  if (!date || Number.isNaN(Date.parse(date))) return null;
  return <time className="bulletin-date" dateTime={date}>{new Date(date).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kuala_Lumpur" })}</time>;
}

export default function QashcampUpdatesSection() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [index, setIndex] = useState(0);
  const [touching, setTouching] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [direction, setDirection] = useState(1);
  const [openedStory, setOpenedStory] = useState(null);
  const dragged = useRef(false);
  const timeline = useRef(null);
  const activeIndex = updates.length ? index % updates.length : 0;
  const active = updates[activeIndex];
  const move = (step) => {
    if (updates.length < 2) return;
    setDirection(step > 0 ? 1 : -1);
    setIndex((current) => (current + step + updates.length) % updates.length);
  };
  const autoPlaying = !openedStory && !touching && !pageHidden && !reducedMotion;

  useEffect(() => {
    const strip = timeline.current;
    const selected = strip?.querySelector('[aria-current="step"]');
    if (!strip || !selected) return;
    strip.scrollTo({
      left: strip.scrollLeft + selected.getBoundingClientRect().left - strip.getBoundingClientRect().left - strip.clientWidth / 2 + selected.offsetWidth / 2,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }, [activeIndex, updates, reducedMotion]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchBulletin() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/api/buletin`, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok || result.success !== true || !Array.isArray(result.buletin)) {
          throw new Error(result.message || "Unable to load Qashcamp updates. Please try again.");
        }
        const slides = [...result.buletin]
          .filter((post) => post && typeof post === "object")
          .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
          .map((post) => {
            const images = [post.image_url, post.image_url_2].filter((url) => typeof url === "string" && url.trim());
            return {
              id: post.id,
              title: post.topic,
              body: post.content,
              date: post.date,
              images,
            };
          });
        if (!controller.signal.aborted) {
          setUpdates(slides);
          setIndex(0);
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message || "Unable to load Qashcamp updates. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchBulletin();
    return () => controller.abort();
  }, [retry]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageHidden(document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!autoPlaying || updates.length < 2) return undefined;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % updates.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [autoPlaying, index, updates.length]);
  const controlClass = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#b9bda7] bg-[#faf9f3] text-[#405537] transition-colors hover:bg-[#e3e9d7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#476440]";

  return (
    <section id="qashcamp-updates" aria-labelledby="qashcamp-updates-title" className="my-8 w-full bg-[#eee9de]">
      <div className="grid gap-4 px-5 py-5 sm:px-8 sm:py-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#526641]"><Megaphone size={17} aria-hidden="true" /> From the Qashcamp team</p>
          <h2 id="qashcamp-updates-title" className="text-2xl leading-tight text-[#344b30] sm:text-3xl" style={{ fontFamily: "'Fredoka One', cursive" }}>What’s happening at Qashcamp?</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#636252] sm:text-base">A little peek into our day. Camp activities, behind-the-scenes stories and news from our team, all in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="What we share">
          <span className="flex items-center gap-2 rounded-full border border-[#d4ccb9] bg-[#faf8f1] px-4 py-2 text-xs font-bold text-[#596144]"><Tent size={15} aria-hidden="true" /> Camp life</span>
          <span className="flex items-center gap-2 rounded-full border border-[#d4ccb9] bg-[#faf8f1] px-4 py-2 text-xs font-bold text-[#596144]"><Camera size={15} aria-hidden="true" /> Behind the scenes</span>
          <span className="flex items-center gap-2 rounded-full border border-[#d4ccb9] bg-[#faf8f1] px-4 py-2 text-xs font-bold text-[#596144]"><Megaphone size={15} aria-hidden="true" /> Announcements</span>
        </div>
      </div>

      <div className="mx-5 mb-4 sm:mx-8 sm:mb-5">
      {loading ? <p className="py-8 text-[#636252]" role="status">Loading Qashcamp updates…</p> : error ? (
        <div className="py-6">
          <p className="text-[#923c25]" role="alert">{error}</p>
          <button type="button" onClick={() => setRetry((current) => current + 1)} className="mt-3 rounded-lg bg-[#476440] px-4 py-2 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#476440]">Try again</button>
        </div>
      ) : active ? (
        <div role="region" aria-roledescription="carousel" aria-label="Qashcamp announcements" tabIndex={0}
          className="overflow-hidden outline-offset-[-3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#476440]"
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget || updates.length < 2) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}>
          <nav ref={timeline} className="bulletin-timeline" aria-label="Event timeline">
            <ol>
              {updates.map((story, storyIndex) => (
                <li key={story.id}>
                  <button type="button" aria-current={storyIndex === activeIndex ? "step" : undefined}
                    aria-label={`${story.date || "Undated event"}: ${story.title}`}
                    onClick={() => { setDirection(storyIndex > activeIndex ? 1 : -1); setIndex(storyIndex); }}>
                    {story.date && !Number.isNaN(Date.parse(story.date)) ? <time dateTime={story.date}>{new Date(story.date).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kuala_Lumpur" })}</time> : <span>Undated event</span>}
                    <span className="bulletin-timeline-dot" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="bulletin-stage" style={{ touchAction: "pan-y" }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div key={active.id} custom={direction}
                variants={{ enter: (way) => ({ x: reducedMotion ? 0 : `${way * 100}%` }), center: { x: 0 }, exit: (way) => ({ x: reducedMotion ? 0 : `${way * -100}%` }) }}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                drag={updates.length > 1 ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.8} dragMomentum={false}
                onPointerDownCapture={() => { dragged.current = false; }}
                onDragStart={() => { dragged.current = true; setTouching(true); }}
                onDragEnd={(_, info) => {
                  setTouching(false);
                  if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 400) move(info.offset.x < 0 ? 1 : -1);
                }}
                className="bulletin-feature absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{ touchAction: "pan-y" }}
                role="group" aria-roledescription="slide" aria-label={`${activeIndex + 1} of ${updates.length}: ${active.title || "Announcement"}`}>
                <button type="button" className={`bulletin-photo-stack ${active.images.length > 1 ? "has-two" : ""}`}
                  onClick={() => { if (!dragged.current) setOpenedStory(active); }} aria-label={`Open story and photos: ${active.title}`}>
                  {active.images.length > 1 && <span className="bulletin-photo-back" aria-hidden="true"><BulletinImage key={active.images[1]} src={active.images[1]} alt="" /></span>}
                  <span className="bulletin-photo-front"><BulletinImage key={active.images[0] || active.id} src={active.images[0]} alt={active.title || "Qashcamp story"} />
                    <span className="bulletin-photo-note"><Camera size={14} aria-hidden="true" /> {active.images.length > 1 ? "2 photos · Open the story" : "Take a closer look"}</span>
                  </span>
                </button>
                <div className="bulletin-story-copy">
                  <p className="bulletin-kicker">The latest from camp</p>
                  <StoryDate date={active.date} />
                  <h3>{active.title}</h3>
                  <p className="bulletin-excerpt">{active.body}</p>
                  <button type="button" className="bulletin-read" onClick={() => { if (!dragged.current) setOpenedStory(active); }}>Read the story <ArrowUpRight size={18} aria-hidden="true" /></button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-stretch justify-between gap-4 px-1 py-4 sm:flex-row sm:items-start sm:px-5">
            <div className="min-w-0" aria-live={autoPlaying ? "off" : "polite"} aria-atomic="true">
              <span className="sr-only">{active.title}</span>
            </div>
            {updates.length > 1 && <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <button type="button" className={controlClass} onClick={() => move(-1)} aria-label="Previous announcement"><ChevronLeft size={22} /></button>
              <div className="hidden max-w-52 flex-wrap justify-center sm:flex">
                {updates.map((update, slideIndex) => <button key={update.id} type="button" onClick={() => { setDirection(slideIndex > activeIndex ? 1 : -1); setIndex(slideIndex); }}
                  aria-label={`Show announcement ${slideIndex + 1}: ${update.title || "Announcement"}`} aria-current={slideIndex === activeIndex ? "true" : undefined}
                  className="flex h-11 w-8 items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#476440]">
                  <span className={`h-2.5 rounded-full ${slideIndex === activeIndex ? "w-6 bg-[#476440]" : "w-2.5 bg-[#a5ad95]"}`} />
                </button>)}
              </div>
              <button type="button" className={controlClass} onClick={() => move(1)} aria-label="Next announcement"><ChevronRight size={22} /></button>
            </div>}
          </div>
        </div>
      ) : <p className="px-5 pb-10 text-[#636252] sm:px-10">New announcements are on the way. Check back soon!</p>}
      </div>
      <div className="flex flex-col gap-4 border-t border-[#d8d1c1] bg-[#e6e2d5] px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm font-bold text-[#4e5940]">Catch more of our everyday adventures</p>
        <div className="flex flex-wrap gap-3">
          <a href="https://www.tiktok.com/@qashcamp" target="_blank" rel="noopener noreferrer" aria-label="Qashcamp on TikTok (opens in a new tab)" className="flex items-center gap-2 rounded-xl bg-[#476440] px-4 py-3 text-sm font-bold text-white hover:bg-[#344e2e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#476440]"><FaTiktok aria-hidden="true" /> TikTok <ArrowUpRight size={16} aria-hidden="true" /></a>
          <a href="https://www.facebook.com/profile.php?id=61589566700509" target="_blank" rel="noopener noreferrer" aria-label="Qashcamp on Facebook (opens in a new tab)" className="flex items-center gap-2 rounded-xl border border-[#bdc1aa] bg-[#faf9f3] px-4 py-3 text-sm font-bold text-[#415337] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#476440]"><FaFacebook aria-hidden="true" /> Facebook <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
      {openedStory && <StoryDialog story={openedStory} onClose={() => setOpenedStory(null)} />}
    </section>
  );
}
