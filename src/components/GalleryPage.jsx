import React, { useState } from "react";
import brandLogo from "../assets/qashcamp-logo-optimized.png";
import watermarkLogo from "../assets/qashcamp-navbar-invert-optimized.png";
import PackageFlipCard from "./PackageFlipCard";
import priceImage from "../assets/price_list-optimized.jpg";
import TentCareSection from "./TentCareSection";
import { useNavigate } from "react-router-dom";

// Importing your image assets
import img1 from "../assets/sewa_1-optimized.jpg";
import img2 from "../assets/sewa_2-optimized.jpg";
import img3 from "../assets/sewa_3-optimized.jpg";
import img4 from "../assets/add_on1-optimized.jpg";
import img5 from "../assets/add_on2-optimized.jpg";
import img6 from "../assets/add_on3-optimized.jpg";
import img7 from "../assets/term-optimized.jpg";

export default function GalleryPage() {
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(null);

  // Each rental collection alternates with the shared price list.
  const galleryItems = [
    {
      img: img1, rental: true,
      tag: "Rental Package 01",
      title: "Awan, Purnama, Senja & Lestari",
      description: "Dari getaway berdua hingga santai bersama keluarga. Explore pilihan Naturehike, Black Dog dan Vidalido dengan gaya natural untuk campsite pilihan anda."
    },
    {
      img: img2, rental: true,
      tag: "Rental Package 02",
      title: "Embun, Aurora, Gelora & Rimbayu",
      description: "Lebih ruang untuk berkumpul, berehat dan menikmati alam. Pilihan khemah 4-8 orang dengan tona bumi dan ruang santai untuk camping bersama keluarga atau kawan-kawan."
    },
    {
      img: img3, rental: true, featured: true,
      tag: "Hot Pick / Naturehike",
      title: "Rimbayu - A Premium Naturehike Escape",
      description: "Your next escape, elevated. Khemah Naturehike untuk 6-8 orang dengan warna earthy dan siluet elegan. Ruang untuk berkumpul, suasana untuk slow down. a standout setup for your next camping trip."
    },
    {
      img: img4,
      tag: "Add-On Utility",
      title: "Comfort & Power Upgrades",
      description: "Extra essential power stations, lighting extensions, and utility upgrades to keep your campsite running smoothly all night long."
    },
    {
      img: img5,
      tag: "Add-On Comfort",
      title: "Premium Outdoor Accessories",
      description: "Cozy additions, premium chairs, and modular tables to enhance your chill zones and maximize outdoor relaxation."
    },
    {
      img: img6,
      tag: "Sleep Well",
      title: "Add-On Sleeping Comfort",
      description: "Sometimes the night gets chilly. Upgrade your sleeping setup with extra blankets, sleeping pads, and cozy bedding for a warm and restful sleep under the stars."
    },
    {
      img: img7,
      tag: "Guidelines",
      title: "Terms & Safety Regulations",
      description: "Sila baca panduan dan peraturan keselamatan kami demi memastikan pengalaman perkhemahan yang selamat, harmoni, dan menyeronokkan."
    },
  ];

  const handleImageClick = (clickedImg) => setSelectedImg(clickedImg);

  return (
    <div className="min-h-screen bg-[#F7F1DE] text-[#111111] pt-32 px-4 pb-24 font-sans selection:bg-[#597E52]/20 relative isolate">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 flex select-none items-center justify-center overflow-hidden">
        <img src={watermarkLogo} alt="" width="668" height="319" draggable="false"
          className="w-[88vw] max-w-[800px] -rotate-12 opacity-[0.10]" />
      </div>

      {/* STICKY / FLOATING BACK BUTTON */}
      <div className="absolute top-8 left-4 md:left-8 z-40">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-[#111111] hover:bg-[#597E52] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 border border-transparent group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </button>
      </div>

      <div className="mx-auto mb-10 flex max-w-3xl justify-center md:mb-14">
        <img
          src={brandLogo}
          alt="QashCamp Outdoor Rental"
          width="655"
          height="319"
          fetchPriority="high"
          className="h-auto w-full max-w-[620px] object-contain"
        />
      </div>

      <TentCareSection onExpand={setSelectedImg} />

      {/* HEADER SECTION */}
      <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white bg-[#597E52] px-4 py-1.5 rounded-full inline-block shadow-sm">
          Visual Catalog
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#111111] mt-5 mb-4 uppercase">
          Stay Close to Nature<span className="text-[#C6A969]">.</span>
        </h1>
        <div className="w-12 h-1 bg-[#C6A969] mx-auto my-4 rounded-full"></div>
        <p className="text-xs md:text-sm text-gray-600 max-w-sm mx-auto font-bold tracking-wide uppercase">
          Discover your tent, explore the details, and find your next outdoor escape.
        </p>
      </div>

      {/* CONTINUOUS VISUAL STREAM CONTAINER */}
      <div className="max-w-3xl mx-auto space-y-12 md:space-y-20">
        {galleryItems.map((item, index) => (
          <div
            key={index}
            className={`group relative rounded-2xl md:rounded-3xl overflow-hidden p-3 md:p-5 transition-all duration-300 ${item.featured ? "bg-[#fffaf0] border-2 border-[#C6A969] shadow-[0_16px_60px_rgba(145,110,45,0.15)]" : "bg-white/90 border border-black/[0.03] hover:bg-white hover:shadow-xl"}`}
          >

            {item.featured && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#263D32] px-4 py-4 text-[#F7F1DE]">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#E6CA8D]">Hot Pick / Premium Collection</span>
                <span className="text-xs font-medium">Naturehike / 6-8 guests</span>
              </div>
            )}
            {item.rental ? <PackageFlipCard item={item} priceImage={priceImage} onExpand={setSelectedImg} /> : (
            <>
            <button
              onClick={() => handleImageClick(item.img)}
              className="w-full text-left overflow-hidden rounded-xl md:rounded-2xl bg-[#EFEAD8] relative block group/img cursor-zoom-in focus:outline-none"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-auto object-contain max-h-[85vh] mx-auto transition-transform duration-500 ease-out group-hover/img:scale-[1.01]"
                loading="lazy"
              />

              {/* Click Context Overlay Badge */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-[#597E52] text-white text-[10px] font-black tracking-widest uppercase px-4 py-2.5 rounded-xl backdrop-blur-sm shadow-lg scale-95 group-hover/img:scale-100 transition-all duration-300">
                  View Full Screen
                </span>
              </div>

              {/* Floating Index Stamp */}
              <div className="absolute top-4 right-4 bg-[#111111] text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                [ 0{index + 1} ]
              </div>
            </button>

            </>
            )}

            {/* LOWER CARD FOOTER */}
            <div className="mt-5 px-1 md:px-2 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="max-w-xl">
                <span className="text-[10px] font-black tracking-widest text-white uppercase bg-[#597E52] px-2 py-0.5 rounded">
                  {item.tag}
                </span>
                <h3 className="text-lg md:text-xl font-black text-[#111111] mt-2 tracking-tight group-hover:text-[#597E52] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Scroll Hint Indicator */}
              <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#597E52] transition-colors duration-300 self-end sm:self-auto pt-2">
                <span className="text-[10px] font-black tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
                  Keep Exploring
                </span>
                <div className="h-9 w-9 rounded-full border border-black/[0.05] flex items-center justify-center bg-white/50 group-hover:bg-[#fff7ed] group-hover:border-[#e2c8aa] transition-all duration-300 shadow-sm shrink-0">
                  <svg className="w-3.5 h-3.5 text-gray-700 group-hover:text-[#597E52]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* MINIMALIST ENDPLATE */}
      <div className="max-w-md mx-auto text-center mt-24 border-t border-black/[0.06] pt-12">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
          End of Visual Menu
        </p>
      </div>

      {/* CLEAN FULL SCREEN IMAGE LIGHTBOX MODAL */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          {/* Close Button Top Right */}
          <button
            aria-label="Close expanded image"
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all focus:outline-none z-52 border border-white/10"
            onClick={() => setSelectedImg(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Large Image Frame - Maxed safely for mobile screens */}
          <div className="relative w-full max-w-5xl max-h-[85vh] md:max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedImg}
              alt="Expanded view"
              className="w-full h-auto max-h-[85vh] md:max-h-[90vh] object-contain rounded-xl shadow-2xl scale-97 animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

    </div>
  );
}
