import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/Card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { whyUsItems } from "../pages/WhyChooseUs";

export default function WhyUsPreviewSection() {
  const navigate = useNavigate();
  const previewItems = whyUsItems.slice(0, 3); // first 3 cards for sneak peek

  return (
    <div className="w-full flex flex-col items-center py-20 px-4 md:px-10 bg-[#C6A969] min-h-[700px]">
      <p className="text-center text-gray-600 max-w-2xl mb-10">
        Here’s a sneak peek at what makes our service different.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {previewItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              y: -12,
              rotateX: 4,
              rotateY: -4,
              scale: 1.03,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
          >
            <div
  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
  style={{
    boxShadow: "0 0 60px 10px rgba(255,255,255,0.25)",
  }}
/>
<Card
  className="group relative overflow-hidden rounded-2xl min-h-[500px]
  shadow-[0_25px_60px_rgba(0,0,0,0.28)]
  hover:shadow-[0_45px_100px_rgba(0,0,0,0.45)]
  transition-all duration-300"
>
<CardContent className="relative z-10 flex flex-col gap-3">                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-60 object-cover rounded-lg"
                />
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => navigate("/why-us")}
        className="mt-10 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Learn More
      </button>
    </div>
  );
}
