import { Card, CardContent } from "./ui/Card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { whyUsItems } from "../pages/WhyChooseUs";

export default function WhyUsPreviewSection() {
  const navigate = useNavigate();
  const previewItems = whyUsItems.slice(0, 3); // first 3 cards for sneak peek

  return (
    <div className="w-full flex flex-col items-center py-12 px-4 md:px-10 bg-green-50">
      <p className="text-center text-gray-600 max-w-2xl mb-10">
        Here’s a sneak peek at what makes our service different.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {previewItems.map((item, index) => (
          <Card
            key={index}
            className="p-4 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <CardContent className="flex flex-col gap-3">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-32 object-cover rounded-lg"
              />

              <CheckCircle className="w-8 h-8 text-green-500" />

              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </CardContent>
          </Card>
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
