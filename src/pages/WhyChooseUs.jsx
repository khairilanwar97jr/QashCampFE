import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

// Export the items array separately
export const whyUsItems = [
  {
    title: "Regular Maintenance",
    text: "We make sure every item is properly serviced and maintained on schedule so you always receive it in top condition.",
    img: "https://picsum.photos/400/300?random=1",
  },
  {
    title: "Every Rental = Fresh Setup",
    text: "After each rental, our team checks, cleans, and resets the item before passing it to the next customer.",
    img: "https://picsum.photos/400/300?random=2",
  },
  {
    title: "Safe & Reliable Equipment",
    text: "Our equipment is monitored closely to ensure safety, reliability, and consistent performance.",
    img: "https://picsum.photos/400/300?random=3",
  },
  {
    title: "Responsive Support Team",
    text: "If there’s an issue, our support team responds quickly so your experience stays smooth.",
    img: "https://picsum.photos/400/300?random=4",
  },
  {
    title: "Fair & Transparent Pricing",
    text: "We don’t believe in hidden charges — what you see is what you pay.",
    img: "https://picsum.photos/400/300?random=5",
  },
  {
    title: "Our Tent",
    text: "High-quality tent from trusted brands to ensure durability, safety, and comfort for every camping experience.",
    img: "https://picsum.photos/400/300?random=6",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <Navbar />
      <div className="w-full flex flex-col items-center py-12 px-4 md:px-10">
        <h1 className="pt-10 text-3xl font-bold mb-6 text-center">
          Why Customers Trust Us
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mb-10">
          Our service focuses on quality, transparency, and reliability — here’s
          what makes us different.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {whyUsItems.map((item, index) => (
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
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
