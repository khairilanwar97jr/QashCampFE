import { CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import maintenance1 from "../assets/maintenance1.jpg";
import maintenance2 from "../assets/maintenance2.jpg";
import maintenance3 from "../assets/maintenance3.jpg";
import maintenance4 from "../assets/maintenance4.jpg";
import maintenance5 from "../assets/maintenance5.jpg";
import maintenance6 from "../assets/maintenance6.jpg";

export const whyUsItems = [
  {
    title: "Regular Maintenance",
    text: "We make sure every item is properly serviced and maintained on schedule so you always receive it in top condition.",
    img: maintenance6,
  },
  {
    title: "Every Rental = Fresh Setup",
    text: "After each rental, our team checks, cleans, and resets the item before passing it to the next customer.",
    img: maintenance1,
  },
  {
    title: "Safe & Reliable Equipment",
    text: "Our equipment is monitored closely to ensure safety, reliability, and consistent performance.",
    img: maintenance4,
  },
  {
    title: "Responsive Support Team",
    text: "If there’s an issue, our support team responds quickly so your experience stays smooth.",
    img: maintenance2,
  },
  {
    title: "Fair & Transparent Pricing",
    text: "We don’t believe in hidden charges — what you see is what you pay.",
    img: maintenance3,
  },
  {
    title: "Our Tent",
    text: "High-quality tent from trusted brands to ensure durability, safety, and comfort for every camping experience.",
    img: maintenance5,
  },
];

export default function WhyChooseUs() {
  return (
    <div className="bg-[#fdf6ee] min-h-screen">
      <Navbar />
      <div className="w-full flex flex-col items-center pt-28 pb-14 px-4 md:px-10">
        
        {/* Title styled like your availability / contact page headers */}
        <h2
          className="text-3xl md:text-6xl font-bold text-center mb-4"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "#597E52",
          }}
        >
          Why Customers Trust Us
        </h2>
        
        <p className="text-center text-gray-600 max-w-2xl mb-12 font-medium text-sm md:text-base">
          Our service focuses on quality, transparency, and reliability — here’s
          what makes us different.
        </p>

        {/* Responsive Grid Setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {whyUsItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#C6A969] rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-3 text-left block"
              style={{
                boxShadow: `
                  0 4px 6px rgba(0,0,0,0.2),
                  0 10px 20px rgba(0,0,50,0.1),
                  0 20px 40px rgba(0,0,50,0.08)
                `,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `
                    0 6px 12px rgba(0,0,0,0.25),
                    0 12px 24px rgba(0,0,50,0.18),
                    0 24px 48px rgba(0,0,50,0.15),
                    0 36px 72px rgba(0,0,50,0.12),
                    0 48px 96px rgba(0,0,50,0.1)
                  `)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = `
                    0 4px 6px rgba(0,0,0,0.2),
                    0 10px 20px rgba(0,0,50,0.1),
                    0 20px 40px rgba(0,0,50,0.08)
                  `)
              }
            >
              <div className="flex flex-col gap-3.5">
                {/* Clean Aspect Image Wrapper */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-44 object-cover rounded-xl border border-[#e2c8aa]/30 shadow-inner"
                />
                
                {/* Heading Block with Status Check */}
                <div className="flex items-start gap-2.5 mt-2">
                  <CheckCircle className="w-5 h-5 text-[#fff7ed] shrink-0 mt-0.5" />
                  <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Body Text */}
                <p className="text-[#fff7ed] text-sm font-medium leading-relaxed pl-7">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}