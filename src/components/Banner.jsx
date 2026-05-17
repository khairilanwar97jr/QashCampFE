import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1631635589499-afd87d52bf64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
];

const phrases = [
  "Escape to Nature",
  "Adventure Awaits",
  "Relax & Recharge",
];

const subtexts = [
  "Discover peace and adventure with our cozy camping packages. Your next outdoor getaway starts here.",
  "Get ready for thrilling outdoor activities and unforgettable experiences with us.",
  "Unwind and rejuvenate surrounded by beautiful landscapes and fresh air.",
];

// FIXED FOR MOBILE: Animates entire words together instead of letters to prevent weird wrapping
function AnimatedText({ text, delayPerWord = 150, className = "" }) {
  return (
    <h1 className={`inline-flex flex-wrap ${className}`}>
      {text.split(" ").map((word, index) => (
        <span
          key={index}
          className="opacity-0 inline-block transform translate-y-4 animate-modern-lift mr-[0.25em]"
          style={{ animationDelay: `${index * delayPerWord}ms` }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}

export default function Banner() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [buttonAppeared, setButtonAppeared] = useState(false);

  // Background slider loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Sync state transitions safely
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      setPhraseIndex(currentImage);
      setVisible(true);
      if (!buttonAppeared) setButtonAppeared(true);
    }, 400);
    return () => clearTimeout(t);
  }, [currentImage]);

  return (
    <div className="relative h-[85vh] min-h-[650px] md:h-screen w-full flex flex-col justify-center items-start text-white overflow-hidden bg-black font-sans">
      
      {/* Background Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-center bg-cover transition-all duration-[1800ms] cubic-bezier(0.4, 0, 0.2, 1) ${
            index === currentImage ? "opacity-75 scale-100 z-10" : "opacity-0 scale-105 z-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Cinematic Gradient Mask Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20 pointer-events-none" />

      {/* Content Container (Tailored text heights for fluid phone rendering) */}
      <div className="relative z-30 px-6 md:px-16 lg:px-24 max-w-2xl w-full">
        
        {/* Category Tagline */}
        <div className="mb-4 overflow-hidden">
          <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-[#FFC107] bg-[#FFC107]/10 border border-[#FFC107]/20 px-3 py-1.5 rounded-md inline-block shadow-sm">
            Premium Campsite Experience
          </span>
        </div>

        {/* Headline Container with mobile size reductions */}
        <div className={`h-28 sm:h-24 md:h-32 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
          <AnimatedText
            key={phraseIndex}
            text={phrases[phraseIndex]}
            delayPerWord={120}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase leading-[1.1] text-white"
          />
        </div>

        {/* Subtext Paragraph */}
        <div className="h-20 mt-4 mb-8">
          <p
            className={`text-xs sm:text-sm md:text-base text-neutral-300 max-w-lg leading-relaxed transition-all duration-700 transform ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {subtexts[phraseIndex]}
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => navigate("/gallery")}
            className={`group/btn relative inline-flex items-center gap-3 bg-[#FFC107] hover:bg-white text-[#111111] font-black py-4 px-8 rounded-xl shadow-2xl uppercase tracking-wider text-xs transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
              buttonAppeared ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span>Explore Gallery</span>
            <svg 
              className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>

      {/* BOTTOM STATUS BAR (Hidden on tiny devices to prevent crowding) */}
      <div className="absolute bottom-8 left-6 md:left-16 lg:left-24 z-30 hidden sm:flex items-center gap-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className="group/dot flex items-center py-2 focus:outline-none"
          >
            <div className="relative h-[3px] transition-all duration-500 rounded-full overflow-hidden bg-white/20 w-8 group-hover/dot:bg-white/40">
              <div 
                className={`absolute inset-y-0 left-0 bg-[#FFC107] transition-all rounded-full ${
                  idx === currentImage ? "w-full duration-[6000ms] ease-linear" : "w-0 duration-300"
                }`}
              />
            </div>
            <span className={`ml-2 text-[10px] font-mono tracking-tighter transition-opacity duration-300 ${
              idx === currentImage ? "text-[#FFC107] opacity-100" : "text-white/40 opacity-0 group-hover/dot:opacity-100"
            }`}>
              0{idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Global CSS Inject */}
      <style>{`
        @keyframes modern-lift {
          0% { opacity: 0; transform: translateY(1rem); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-modern-lift {
          animation: modern-lift 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}