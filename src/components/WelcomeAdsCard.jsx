import React, { useEffect, useState } from "react";
import tiktokProf from "../assets/tiktokProf.jpg";
import termImg from "../assets/term.png";

export default function WelcomeAdsCard({ onContinue }) {
  const slides = [
    {
      title: "Follow our Tiktok",
      subtitle: "See camping stories, updates, and moments from our TikTok community.",
      image: tiktokProf,
      accent: "TikTok Preview",
    },
    {
      title: "Camp with comfort",
      subtitle: "Easy booking, trusted stays, and good outdoors energy in one place.",
      image: termImg,
      accent: "Basecamp Experience",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[index];

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div className="relative overflow-hidden rounded-[28px] border border-[#C6BCAB] bg-[#E6DFD3] text-[#2B261F] shadow-[0_18px_45px_rgba(43,38,31,0.16)]">
        <img
          src={current.image}
          alt={current.title}
          className="h-[420px] w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#2b261f]/90 via-[#2b261f]/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#F9E2A8]">
            {current.accent}
          </p>
          <h3 className="text-3xl font-black uppercase tracking-tight leading-tight">
            {current.title}
          </h3>

          <div className="mt-5 flex items-center gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === index ? "bg-[#FFC107]" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={onContinue}
            className="mt-5 inline-flex rounded-full bg-[#FFC107] px-5 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#2B261F] shadow-lg shadow-[#2b261f]/20 transition-all hover:bg-[#fff081]"
          >
            Continue to Home
          </button>
        </div>
      </div>
    </div>
  );
}
