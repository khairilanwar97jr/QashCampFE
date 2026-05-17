import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook to handle going back home

// Importing your image assets
import img1 from "../assets/sewa_1.png";
import img2 from "../assets/sewa_2.png";
import img4 from "../assets/add_on1.png";
import img5 from "../assets/add_on2.png";
import img6 from "../assets/term.png";

export default function GalleryPage() {
  const navigate = useNavigate(); // Navigation hook instance
  const [selectedImg, setSelectedImg] = useState(null);

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
      tag: "Guidelines", 
      title: "Terms & Safety Regulations",
      description: "Sila baca panduan dan peraturan keselamatan kami demi memastikan pengalaman perkhemahan yang selamat, harmoni, dan menyeronokkan."
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F1DE] text-[#111111] pt-32 px-4 pb-24 font-sans selection:bg-[#FFC107]/30 relative">
      
      {/* STICKY / FLOATING BACK BUTTON */}
      <div className="absolute top-8 left-4 md:left-8 z-40">
        <button
          onClick={() => navigate("/")} // Routes back to the home/banner screen
          className="flex items-center gap-2 bg-[#111111] hover:bg-[#FFC107] text-white hover:text-[#111111] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 border border-transparent hover:border-[#111111] group"
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
        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white bg-[#111111] px-4 py-1.5 rounded-full inline-block shadow-sm">
          Visual Catalog
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#111111] mt-5 mb-4 uppercase">
          The Gallery<span className="text-[#FFC107]">.</span>
        </h1>
        <div className="w-12 h-1 bg-[#FFC107] mx-auto my-4 rounded-full"></div>
        <p className="text-xs md:text-sm text-gray-600 max-w-sm mx-auto font-medium tracking-wide uppercase">
          Scroll down to explore our full setup configurations & equipment menu
        </p>
      </div>

      {/* CONTINUOUS VISUAL STREAM CONTAINER */}
      <div className="max-w-3xl mx-auto space-y-12 md:space-y-20">
        {galleryItems.map((item, index) => (
          <div 
            key={index} 
            className="group relative bg-white/80 border border-black/[0.03] rounded-2xl md:rounded-3xl overflow-hidden p-3 md:p-5 transition-all duration-500 hover:bg-white hover:border-[#FFC107]/40 hover:shadow-[0_40px_80px_rgba(47,62,47,0.12)]"
          >
            
            {/* CLICKABLE IMAGE HOLDER FRAME */}
            <button
              onClick={() => setSelectedImg(item.img)}
              className="w-full text-left overflow-hidden rounded-xl md:rounded-2xl bg-[#EFEAD8] relative block group/img cursor-zoom-in focus:outline-none"
            >
              <img
                src={item.img}
                alt={`gallery-item-${index}`}
                className="w-full h-auto object-contain max-h-[85vh] mx-auto transition-transform duration-700 ease-out group-hover/img:scale-[1.02]"
                loading="lazy"
              />
              
              {/* Click Context Overlay Badge */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-[#111111]/90 text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg scale-95 group-hover/img:scale-100 transition-transform duration-300">
                  View Full Screen
                </span>
              </div>

              {/* Floating Index Stamp */}
              <div className="absolute top-4 right-4 bg-[#111111] text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-md border border-gray-800">
                [ 0{index + 1} ]
              </div>
            </button>

            {/* LOWER CARD FOOTER */}
            <div className="mt-5 px-1 md:px-2 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="max-w-xl">
                <span className="text-[10px] font-black tracking-widest text-[#FFC107] uppercase bg-[#111111] px-2 py-0.5 rounded-md inline-block">
                  {item.tag}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-[#111111] mt-2 tracking-tight group-hover:text-[#FFC107] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
              
              {/* Scroll Hint Indicator */}
              <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#111111] transition-colors duration-300 self-end sm:self-auto pt-2">
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
                  Keep Exploring
                </span>
                <div className="h-9 w-9 rounded-full border border-black/[0.05] flex items-center justify-center bg-white/50 group-hover:bg-[#FFC107] group-hover:border-[#FFC107] transition-all duration-300 shadow-sm shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#111111] transform group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
        <div className="inline-block p-2 bg-white/40 rounded-full mb-3">
          <div className="w-2 h-2 bg-[#FFC107] rounded-full animate-pulse"></div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
          End of Visual Menu
        </p>
      </div>

      {/* BIG PICTURE LIGHTBOX MODAL */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          {/* Close Button Top Right */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all focus:outline-none z-52"
            onClick={() => setSelectedImg(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Large Image Frame */}
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <img 
              src={selectedImg} 
              alt="Expanded view" 
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl scale-95 animate-scaleUp"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}

      {/* Embedded Animations for the Lightbox Pop */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

    </div>
  );
}