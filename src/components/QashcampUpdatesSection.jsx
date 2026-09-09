import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Megaphone, Tent, Camera, ArrowUpRight } from "lucide-react";
import { FaTiktok, FaFacebook } from "react-icons/fa";
import awanPoster from "../assets/awan_ads1.webp";
import auroraPoster from "../assets/aurora_ads1.webp";
import lestariPoster from "../assets/lestari_ads1.webp";

// Existing package posters provide initial slides. Replace with published news artwork.
const defaultUpdates = [
  { id: "awan", title: "Awan", imageUrl: awanPoster, imageAlt: "Qashcamp Awan package poster" },
  { id: "aurora", title: "Aurora", imageUrl: auroraPoster, imageAlt: "Qashcamp Aurora package poster" },
  { id: "lestari", title: "Lestari", imageUrl: lestariPoster, imageAlt: "Qashcamp Lestari package poster" },
];

export default function QashcampUpdatesSection({ updates = defaultUpdates }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [direction, setDirection] = useState(1);
  const activeIndex = updates.length ? index % updates.length : 0;
  const active = updates[activeIndex];
  const move = (step) => {
    if (updates.length < 2) return;
    setDirection(step > 0 ? 1 : -1);
    setIndex((current) => (current + step + updates.length) % updates.length);
  };
  const autoPlaying = !hovered && !focused && !touching && !pageHidden && !reducedMotion;

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
      {active ? (
        <div role="region" aria-roledescription="carousel" aria-label="Qashcamp announcements" tabIndex={0}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
          className="overflow-hidden outline-offset-[-3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#476440]"
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget || updates.length < 2) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}>
          <div className="relative h-[260px] w-full overflow-hidden sm:h-[320px] lg:h-[360px]" style={{ touchAction: "pan-y" }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div key={active.id} custom={direction}
                variants={{ enter: (way) => ({ x: reducedMotion ? 0 : `${way * 100}%` }), center: { x: 0 }, exit: (way) => ({ x: reducedMotion ? 0 : `${way * -100}%` }) }}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                drag={updates.length > 1 ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.8} dragMomentum={false}
                onDragStart={() => setTouching(true)}
                onDragEnd={(_, info) => {
                  setTouching(false);
                  if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 400) move(info.offset.x < 0 ? 1 : -1);
                }}
                className="absolute inset-0 flex cursor-grab items-center justify-center active:cursor-grabbing"
                style={{ touchAction: "pan-y" }}
                role="group" aria-roledescription="slide" aria-label={`${activeIndex + 1} of ${updates.length}: ${active.title || "Announcement"}`}>
                <img src={active.imageUrl} alt={active.imageAlt || active.title || "Qashcamp announcement"} draggable={false}
                  className="pointer-events-none block h-auto max-h-full max-w-full select-none rounded-xl" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-2 sm:px-5">
            <div className="min-w-0" aria-live={autoPlaying ? "off" : "polite"} aria-atomic="true">
              <p className="text-xs font-bold uppercase tracking-widest text-[#67705b]">{String(activeIndex + 1).padStart(2, "0")} / {String(updates.length).padStart(2, "0")}</p>
              {active.title && <h3 className="mt-1 break-words text-lg font-extrabold text-[#344b30]">{active.title}</h3>}
              {active.body && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#636252]">{active.body}</p>}
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
    </section>
  );
}
