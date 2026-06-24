import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

// Importing your image assets
import img1 from "../assets/sewa_1.png";
import img2 from "../assets/sewa_2.png";
import img3 from "../assets/sewa_3.png"; // Price list board asset
import img4 from "../assets/add_on1.png";
import img5 from "../assets/add_on2.png";
import img6 from "../assets/add_on3.png";
import img7 from "../assets/term.png";

export default function GalleryPage() {
  const navigate = useNavigate(); 
  const [selectedImg, setSelectedImg] = useState(null);

  // img3 is excluded from this array so it doesn't show as a separate card in the feed
  const galleryItems = [
    { 
      img: img1, 
      tag: "Rental Package 01", 
      title: "Standard Ground Gear",
      description: "Sesuai sangat untuk yang jenis just nak chilling santai. Barang sikit, tak banyak, dan sesuai kalau orang tak ramai. Simple, light, and hassle-free."
    },
    { 
      img: img2, 
      tag: "Rental Package 02", 
      title: "Premium Campsite Setup",
      description: "High-end luxury tent experience. Automatic and super easy to setup with beautiful premium colors. Sesuai untuk yang inginkan keselesaan maksima dan setup gambar yang estetik."
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

  // Logic: Clicking img1 or img2 pops up the price list card (img3)
  const handleImageClick = (clickedImg) => {
    if (clickedImg === img1 || clickedImg === img2) {
      setSelectedImg(img3); // Pop up the price list board instead
    } else {
      setSelectedImg(clickedImg); // Pop up itself for addons/terms
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1DE] text-[#111111] pt-32 px-4 pb-24 font-sans selection:bg-[#597E52]/20 relative">
      
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

      {/* HEADER SECTION */}
      <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white bg-[#597E52] px-4 py-1.5 rounded-full inline-block shadow-sm">
          Visual Catalog
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#111111] mt-5 mb-4 uppercase">
          The Gallery<span className="text-[#C6A969]">.</span>
        </h1>
        <div className="w-12 h-1 bg-[#C6A969] mx-auto my-4 rounded-full"></div>
        <p className="text-xs md:text-sm text-gray-600 max-w-sm mx-auto font-bold tracking-wide uppercase">
          Scroll down to explore our full setup configurations & equipment menu
        </p>
      </div>

      {/* CONTINUOUS VISUAL STREAM CONTAINER */}
      <div className="max-w-3xl mx-auto space-y-12 md:space-y-20">
        {galleryItems.map((item, index) => (
          <div 
            key={index} 
            className="group relative bg-white/90 border border-black/[0.03] rounded-2xl md:rounded-3xl overflow-hidden p-3 md:p-5 transition-all duration-300 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
          >
            
            {/* CLICKABLE IMAGE HOLDER FRAME */}
            <button
              onClick={() => handleImageClick(item.img)}
              className="w-full text-left overflow-hidden rounded-xl md:rounded-2xl bg-[#EFEAD8] relative block group/img cursor-zoom-in focus:outline-none"
            >
              <img
                src={item.img}
                alt={`gallery-item-${index}`}
                className="w-full h-auto object-contain max-h-[85vh] mx-auto transition-transform duration-500 ease-out group-hover/img:scale-[1.01]"
                loading="lazy"
              />
              
              {/* Click Context Overlay Badge */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-[#597E52] text-white text-[10px] font-black tracking-widest uppercase px-4 py-2.5 rounded-xl backdrop-blur-sm shadow-lg scale-95 group-hover/img:scale-100 transition-all duration-300">
                  {item.img === img1 || item.img === img2 ? "See Pricing & Package Info" : "View Full Screen"}
                </span>
              </div>

              {/* Floating Index Stamp */}
              <div className="absolute top-4 right-4 bg-[#111111] text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                [ 0{index + 1} ]
              </div>
            </button>

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