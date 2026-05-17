import { useState } from "react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";
import packageAwanImg from "@/assets/package_A_awan.png";
import packagePurnamaImg from "@/assets/package_B_purnama.png";
import packageSenjaImg from "@/assets/package_C_senja.png";
import packageLestariImg from "@/assets/package_D_lestari.png";
import packageEmbunImg from "@/assets/package_E_embun.png";
import packageAuroraImg from "@/assets/package_F_aurora.png";
import packageRimbayuImg from "@/assets/package_G_rimbayu.png";
import { useNavigate } from "react-router-dom";

export default function PackageSection() {
  const navigate = useNavigate();
  // Tracks active loading element format: "packageId-type" (e.g. "1-BOOKING")
  const [loadingTarget, setLoadingTarget] = useState(null);

  const getApiPrice = (pkg, fallback) =>
    Number(
      pkg?.packagePrice ??
        pkg?.package_price ??
        pkg?.price ??
        pkg?.package_price_amount ??
        fallback
    );

  const getApiDeposit = (pkg, fallback) =>
    Number(
      pkg?.depositAmount ??
        pkg?.deposit_amount ??
        pkg?.deposit ??
        pkg?.bookingPrice ??
        pkg?.booking_price ??
        fallback
    );

  const items = [
    {
      packageId: 1,
      displayName: "Package Awan",
      name: "Awan",
      desc: "240cm × 240cm • H: 160cm",
      img: packageAwanImg,
      price: "RM70",
      packagePrice: 70,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 2,
      displayName: "Package Purnama",
      name: "Purnama",
      desc: "210cm × 320cm • H: 180cm",
      img: packagePurnamaImg,
      price: "RM90",
      packagePrice: 90,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 3,
      displayName: "Package Senja",
      name: "Senja",
      desc: "450cm × 608cm × 195cm",
      img: packageSenjaImg,
      price: "RM100",
      packagePrice: 100,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 4,
      displayName: "Package Lestari",
      name: "Lestari",
      desc: "240cm × 240cm • H: 160cm",
      img: packageLestariImg,
      price: "RM120",
      packagePrice: 120,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 5,
      displayName: "Package Embun",
      name: "Embun",
      desc: "210cm × 320cm • H: 180cm",
      img: packageEmbunImg,
      price: "RM140",
      packagePrice: 140,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 6,
      displayName: "Package Aurora",
      name: "Aurora",
      desc: "450cm × 608cm × 195cm",
      img: packageAuroraImg,
      price: "RM160",
      packagePrice: 160,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 7,
      displayName: "Package Rimbayu",
      name: "Rimbayu",
      desc: "300cm × 300cm • H: 180cm",
      img: packageRimbayuImg,
      price: "RM210",
      packagePrice: 210,
      depositAmount: 100,
      available: true,
    },
  ];

  const handleSelectPackage = async (type, item) => {
    // Prevent multiple clicks while loading
    if (loadingTarget) return;
    
    setLoadingTarget(`${item.packageId}-${type}`);
    let packageDetail = null;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/packages/${item.packageId}`
      );
      if (res.ok) {
        packageDetail = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch selected package:", err);
    } finally {
      // Small timeout guarantees user catches visual feedback before navigation transition
      setTimeout(() => {
        const packagePrice = getApiPrice(packageDetail, item.packagePrice);
        const depositAmount = getApiDeposit(packageDetail, item.depositAmount);

        navigate("/booking", {
          state: {
            type: type === "WALK_IN" ? "WALK_IN" : "BOOKING",
            packageName: item.name,
            packageId: packageDetail?.id ?? item.packageId,
            packagePrice,
            depositAmount,
          },
        });
        setLoadingTarget(null);
      }, 600);
    }
  };

  return (
    <div id="choosePackage" className="w-full py-24 bg-[#FAF9F5] text-[#111111] font-sans">
      
      {/* SECTION HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-16 px-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold block mb-3">
          Premium Field Gear
        </span>
        <p className="text-sm md:text-base text-neutral-600 mt-4 max-w-xl mx-auto leading-relaxed">
          High-performance premium rental systems configured for rugged weekend explorations and optimal outdoor luxury.
        </p>
      </div>

      {/* PACKAGES GRID CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-6 auto-rows-fr">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="h-full"
          >
            <Card
              className={`rounded-2xl overflow-hidden bg-white border border-neutral-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full relative group ${
                !item.available ? "opacity-60 filter grayscale" : ""
              }`}
            >
              
              {/* IMAGE WRAPPER */}
              <div className="w-full h-72 overflow-hidden bg-neutral-100 relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-neutral-800 shadow-sm border border-black/5">
                    Dep: RM{item.depositAmount}
                  </span>
                </div>
              </div>

              {/* CARD DETAILS */}
              <CardContent className="p-6 flex flex-col justify-between flex-1 bg-white">
                <div className="text-left">
                  
                  {/* PRICE & NAME LINE */}
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900">
                      {item.displayName}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-black tracking-tight text-neutral-900">{item.price}</span>
                    </div>
                  </div>

                  {/* SPECIFICATIONS SUMMARY */}
                  <div className="flex items-center gap-1.5 text-neutral-500 mb-6">
                    <svg className="w-3.5 h-3.5 shrink-0 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5m0-16.5h16.5m-16.5 0L19.5 19.5M19.5 3.75v16.5m0-16.5H3.75" />
                    </svg>
                    <span className="font-mono text-[11px] tracking-tight">{item.desc}</span>
                  </div>

                </div>

                {/* CALL TO ACTIONS AREA */}
                <div className="mt-auto pt-4 border-t border-neutral-100">
                  {item.available ? (
                    <div className="flex gap-3">
                      
                      {/* WALK IN BUTTON WITH LOADING TOGGLE */}
                      <Button
                        disabled={!!loadingTarget}
                        className="w-1/2 bg-neutral-100 hover:bg-[#FFC107] text-[#111111] font-bold text-xs uppercase tracking-wider py-5 rounded-xl transition-all duration-300 shadow-sm border border-neutral-200/50 flex items-center justify-center gap-2"
                        onClick={() => handleSelectPackage("WALK_IN", item)}
                      >
                        {loadingTarget === `${item.packageId}-WALK_IN` ? (
                          <svg className="animate-spin h-4 w-4 text-[#111111]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          "Walk In"
                        )}
                      </Button>

                      {/* BOOKING BUTTON WITH LOADING TOGGLE */}
                      <Button
                        disabled={!!loadingTarget}
                        className="w-1/2 bg-[#111111] hover:bg-[#FFC107] text-white hover:text-[#111111] font-bold text-xs uppercase tracking-wider py-5 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                        onClick={() => handleSelectPackage("BOOKING", item)}
                      >
                        {loadingTarget === `${item.packageId}-BOOKING` ? (
                          <svg className="animate-spin h-4 w-4 text-white group-hover:text-[#111111]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          "Booking"
                        )}
                      </Button>

                    </div>
                  ) : (
                    <Button className="w-full bg-neutral-100 text-neutral-400 font-bold text-xs uppercase tracking-widest py-5 rounded-xl cursor-not-allowed shadow-none border border-neutral-200/50">
                      Unavailable
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}