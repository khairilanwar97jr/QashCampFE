import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import packageAImg from "@/assets/packageA.jpg";
import packageBImg from "@/assets/packageB.jpg";
import packageCImg from "@/assets/packageC.jpg";
import { useNavigate } from "react-router-dom";

export default function PackageSection() {
  const navigate = useNavigate();
  const items = [
    {
      displayName: "Package A", // what user sees
      name: "A", // value we send
      desc: "Tent size: 240cm x 240cm, Height: 160cm",
      img: packageAImg,
      price: ["RM80 - 2 days 1 night", "RM110 - 3 days 2 nights"],
      available: true,
    },
    {
      displayName: "Package B",
      name: "B",
      desc: "Tent size: 210cm x 320cm, Height: 180cm",
      img: packageBImg,
      price: ["RM110 - 2 days 1 night", "RM150 - 3 days 2 nights"],
      available: true,
    },
    {
      displayName: "Package C",
      name: "C",
      desc: "Tent size: 450cm x 608cm x 195cm",
      img: packageCImg,
      price: ["RM150 - 2 days 1 night", "RM200 - 3 days 1 night"],
      available: true,
    },
  ];

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
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() =>
                      navigate("/booking", {
                        state: { packageName: item.name, price: item.price }, // pass package name
                      })
                    }
                  >
                    Book Now
                  </Button>
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
