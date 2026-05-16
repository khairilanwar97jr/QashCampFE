import { Card, CardContent } from "./ui/Card";
import { Button } from "@/components/ui/button";
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
      displayName: "Package Awan", // what user sees
      name: "Awan", // value we send
      desc: "Tent size: 240cm x 240cm, Height: 160cm",
      img: packageAwanImg,
      price: ["RM70"],
      packagePrice: 70,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 2,
      displayName: "Package Purnama",
      name: "Purnama",
      desc: "Tent size: 210cm x 320cm, Height: 180cm",
      img: packagePurnamaImg,
      price: ["RM90"],
      packagePrice: 90,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 3,
      displayName: "Package Senja",
      name: "Senja",
      desc: "Tent size: 450cm x 608cm x 195cm",
      img: packageSenjaImg,
      price: ["RM100"],
      packagePrice: 100,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 4,
      displayName: "Package Lestari",
      name: "Lestari",
      desc: "Tent size: 240cm x 240cm, Height: 160cm",
      img: packageLestariImg,
      price: ["RM120"],
      packagePrice: 120,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 5,
      displayName: "Package Embun",
      name: "Embun",
      desc: "Tent size: 210cm x 320cm, Height: 180cm",
      img: packageEmbunImg,
      price: ["RM140"],
      packagePrice: 140,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 6,
      displayName: "Package Aurora",
      name: "Aurora",
      desc: "Tent size: 450cm x 608cm x 195cm",
      img: packageAuroraImg,
      price: ["RM160"],
      packagePrice: 160,
      depositAmount: 50,
      available: true,
    },
    {
      packageId: 7,
      displayName: "Package Rimbayu",
      name: "Rimbayu",
      desc: "Tent size: 300cm x 300cm, Height: 180cm",
      img: packageRimbayuImg,
      price: ["RM210"],
      packagePrice: 210,
      depositAmount: 100,
      available: true,
    },
  ];

  const handleSelectPackage = async (type, item) => {
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
    }

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
  };

  return (
    <div className="w-full py-16 flex flex-col items-center bg-[#C6A969]">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl px-4 auto-rows-fr">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className={`rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-200 flex flex-col h-full ${
                !item.available ? "filter grayscale" : ""
              }`}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-56 object-cover"
              />

              <CardContent className="p-6 text-center flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {item.displayName}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.desc}</p>

                  <div className="space-y-1 mb-4">
                    {item.price.map((p, index) => (
                      <p key={index} className="text-gray-800 font-medium">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

{item.available ? (
  <div className="flex gap-3">
    <Button
      className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
      onClick={() => handleSelectPackage("WALK_IN", item)}
    >
      Walk In
    </Button>

    <Button
      className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
      onClick={() => handleSelectPackage("BOOKING", item)}
    >
      Booking
    </Button>
  </div>
) : (
  <Button className="w-full bg-gray-400 text-white cursor-not-allowed">
    Unavailable
  </Button>
)}

              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
