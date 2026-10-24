import { useEffect, useRef, useState } from "react";

export default function PackageFlipCard({ item, priceImage, onExpand }) {
  const container = useRef(null);
  const tapTimer = useRef(null);
  const [showPrice, setShowPrice] = useState(false);
  const [paused, setPaused] = useState(false);
  const [jiggling, setJiggling] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => () => window.clearTimeout(tapTimer.current), []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(container.current);
    return () => {
      preference.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!visible || paused) return;
    const jiggleTimer = window.setTimeout(() => {
      if (!document.hidden && !reducedMotion) setJiggling(true);
    }, 2500);
    const timer = window.setInterval(() => {
      setJiggling(false);
      if (!document.hidden) setShowPrice((current) => !current);
    }, 3000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(jiggleTimer);
      setJiggling(false);
    };
  }, [reducedMotion, visible, showPrice, paused]);

  const handleImageTap = (event) => {
    setPaused(true);
    setJiggling(false);
    if (event.detail === 0) {
      setShowPrice((current) => !current);
      return;
    }
    if (tapTimer.current !== null) {
      window.clearTimeout(tapTimer.current);
      tapTimer.current = null;
      onExpand(showPrice ? priceImage : item.img);
      return;
    }
    // Wait briefly to distinguish a single tap from a double-tap on touch or mouse.
    tapTimer.current = window.setTimeout(() => {
      tapTimer.current = null;
      setShowPrice((current) => !current);
    }, 300);
  };

  return (
    <div ref={container}>
      <button type="button" onClick={handleImageTap}
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            window.clearTimeout(tapTimer.current);
            tapTimer.current = null;
            setPaused(true);
            setJiggling(false);
            onExpand(showPrice ? priceImage : item.img);
          }
        }}
        aria-label={`Flip to ${showPrice ? item.title : "price list"}. Double-tap or press Shift+Enter to enlarge the current image.`}
        className="block w-full touch-manipulation cursor-pointer rounded-xl bg-[#EFEAD8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#597E52]"
        style={{ perspective: "1600px", animation: jiggling ? "package-jiggle 500ms ease-in-out" : "none" }}>
        <span className="relative grid w-full transition-transform duration-700 motion-reduce:transition-none" style={{ transformStyle: "preserve-3d", transform: showPrice ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          {[item.img, priceImage].map((src, index) => (
            <img key={src} src={src} alt={index ? "Rental package price list" : item.title} aria-hidden={showPrice !== Boolean(index)}
              width="1587" height="2245" loading="lazy" decoding="async"
              className="col-start-1 row-start-1 w-full max-h-[85vh] rounded-xl object-contain"
              style={{ backfaceVisibility: "hidden", transform: index ? "rotateY(180deg)" : "rotateY(0deg)" }} />
          ))}
        </span>
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">
        {paused ? "Auto-flip stopped. Tap to flip. Double-tap to enlarge." : "Auto-flips every 3 seconds. Tap to flip manually. Double-tap to enlarge."}
      </p>
      <style>{`
        @keyframes package-jiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-0.6deg); }
          75% { transform: rotate(0.6deg); }
        }
      `}</style>
    </div>
  );
}
