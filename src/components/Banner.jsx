import { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1631635589499-afd87d52bf64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
];

const phrases = [
  "Escape to Nature ",
  "Adventure Awaits ",
  "Relax & Recharge ",

];

const subtexts = [
  "Discover peace and adventure with our cozy camping packages. Your next outdoor getaway starts here.",
  "Get ready for thrilling outdoor activities and unforgettable experiences with us.",
  "Unwind and rejuvenate surrounded by beautiful landscapes and fresh air.",
 
];

function AnimatedText({ text, delayPerLetter = 80, className = "" }) {
  return (
    <h1 className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="opacity-0 inline-block transform translate-y-6 animate-fade-in"
          style={{ animationDelay: `${index * delayPerLetter}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

export default function Banner() {
  const [currentImage, setCurrentImage] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [buttonAppeared, setButtonAppeared] = useState(false); // track first button animation

  // background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // rotate phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setVisible(true);
        if (!buttonAppeared) setButtonAppeared(true); // animate button only first time
      }, 800);
    }, 6000);
    return () => clearInterval(interval);
  }, [buttonAppeared]);

  return (
    <div className="relative h-[800px] flex flex-col justify-center items-center text-white text-center overflow-hidden">
      {/* Background */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-center bg-cover transition-opacity duration-[1500ms] ${
            index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-20" />

      {/* Content */}
      <div className="relative z-30 px-4 max-w-3xl">
        {/* Headline */}
        <div
          className={`transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <AnimatedText
            key={phraseIndex}
            text={phrases[phraseIndex]}
            delayPerLetter={80}
            className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
          />
        </div>

        {/* Subtext */}
        <p
          className={`text-lg md:text-xl mt-4 mb-6 drop-shadow transition-all duration-700 transform ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: visible ? `${phrases[phraseIndex].length * 0.08}s` : "0s",
          }}
        >
          {subtexts[phraseIndex]}
        </p>

        {/* Button (animate once) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById("packages");
            if (element) {
              const yOffset = -64;
              const y =
                element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }}
          className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-700 transform ${
            buttonAppeared ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: visible
              ? `${phrases[phraseIndex].length * 0.08 + 0.3}s`
              : "0s",
          }}
        >
          Book Now
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(1rem); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s forwards;
        }
      `}</style>
    </div>
  );
}
