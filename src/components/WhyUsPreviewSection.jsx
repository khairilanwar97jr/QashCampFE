import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/Card";
import { useNavigate } from "react-router-dom";
import { whyUsItems } from "../pages/WhyChooseUs";

export default function WhyUsPreviewSection() {
  const navigate = useNavigate();
  const previewItems = whyUsItems.slice(0, 3); // first 3 cards for sneak peek

  return (
    <div id="why-us" className="w-full flex flex-col items-center py-24 px-4 md:px-10 bg-[#F4F1EA] text-[#111111] font-sans overflow-hidden">
      
      {/* SECTION HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-16 px-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold block mb-3">
          The Kaiso Standard
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-neutral-900">
          Why Rent From Us<span className="text-[#FFC107]">?</span>
        </h2>
        <p className="text-xs md:text-sm text-neutral-600 mt-4 max-w-xl mx-auto leading-relaxed">
          Here’s a look at the technical execution, sanitization, and premium support architectures that set our camp gear rentals apart.
        </p>
      </div>

      {/* GRID CONTAINER - RESPONSIVE 2 COLUMNS ON MOBILE, 3 ON LARGE SCREENS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 max-w-6xl w-full auto-rows-fr">
        {previewItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="h-full"
          >
            <Card
              className="group relative overflow-hidden rounded-xl md:rounded-2xl h-full border border-neutral-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 flex flex-col"
            >
              <CardContent className="p-3 md:p-6 flex flex-col h-full bg-white text-left">
                
                {/* COMPACT IMAGE CONTAINER */}
                <div className="w-full h-32 sm:h-44 md:h-56 overflow-hidden rounded-lg bg-neutral-100 relative mb-4">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* STEP INDEX ACCENT */}
                  <div className="absolute bottom-2 left-2 font-mono text-[10px] bg-white/90 backdrop-blur-sm text-neutral-800 px-2 py-0.5 rounded font-bold shadow-sm border border-black/5">
                    0{index + 1}
                  </div>
                </div>

                {/* TEXT INFORMATION AREA */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-sm md:text-xl font-black uppercase tracking-tight text-neutral-900 mb-1.5 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-neutral-500 font-normal text-[11px] md:text-xs md:leading-relaxed line-clamp-3 md:line-clamp-none">
                      {item.text}
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* HIGH-CONTRAST ACTION BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/why-us")}
        className="mt-14 px-8 py-3.5 bg-[#111111] hover:bg-[#FFC107] text-white hover:text-[#111111] font-bold text-xs uppercase tracking-widest rounded-full shadow-md transition-all duration-300"
      >
        Learn More
      </motion.button>

    </div>
  );
}