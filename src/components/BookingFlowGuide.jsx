import { ArrowDown, ArrowUpRight, CalendarDays, CreditCard, MapPin, Tent, PackageCheck, Trees, Flame, Leaf } from "lucide-react";
import availabilityPhoto from "../assets/checkavailabilityperson-optimized.jpg";
import paymentPhoto from "../assets/payonline-optimized.jpg";
import pickupDetailsPhoto from "../assets/getpickupdetail-optimized.jpg";
import campingPhoto from "../assets/pickupcamping-optimized.jpg";
import returnPhoto from "../assets/returnitem-optimized.jpg";
import "./BookingFlowGuide.css";
import brandLogo from "../assets/qashcamp-logo-optimized.png";

// Optimized photos for the five-step booking guide.
const steps = [
  { title: "Check availability", text: "Choose your dates and find an available tent package.", image: availabilityPhoto, alt: "Qashcamp tent package", icon: CalendarDays, label: "Find your dates" },
  { title: "Book & pay online", text: "Complete your booking and payment through our system.", image: paymentPhoto, alt: "A Qashcamp camping setup", icon: CreditCard, label: "Make it official" },
  { title: "Get your pickup details", text: "Receive the pickup location and instructions.", image: pickupDetailsPhoto, alt: "Qashcamp equipment preparation", icon: MapPin, label: "Know where to go" },
  { title: "Pick up & go camping", text: "Collect your equipment and enjoy your camping trip!", image: campingPhoto, alt: "A tent ready for a camping trip", icon: Tent, label: "Adventure time" },
  { title: "Return your equipment", text: "Return all items clean and packed as you received them.", image: returnPhoto, alt: "Qashcamp equipment care", icon: PackageCheck, label: "Pack it with care" },
];

export default function BookingFlowGuide({ showAvailabilityShortcut = true }) {
  return (
    <section className="booking-flow" aria-labelledby="booking-flow-title">
      <div className="booking-flow-layout">
        <header className="booking-flow-heading">
          <h2 id="booking-flow-title" className="sr-only">QashCamp booking guide</h2>
          <a href="/" aria-label="QashCamp home" className="booking-flow-scene mb-4 block">
            <span className="booking-flow-jungle" aria-hidden="true">
              <Trees className="booking-flow-trees booking-flow-trees-left" strokeWidth={1} />
              <Trees className="booking-flow-trees booking-flow-trees-right" strokeWidth={1} />
              <Leaf className="booking-flow-leaf" strokeWidth={1.2} />
              <span className="booking-flow-fire"><Flame strokeWidth={1.4} /><span /></span>
            </span>
            <img src={brandLogo} alt="QashCamp Outdoor Rental" width="655" height="319"
              fetchPriority="high" className="booking-flow-logo mx-auto h-auto w-full max-w-[520px] object-contain" />
          </a>
          <div className="mb-8 text-center font-serif text-xl italic text-[#476440] md:text-2xl">
            5 easy steps to your next escape.
          </div>
          {showAvailabilityShortcut && <a className="booking-flow-shortcut" href="#availability-checker" onClick={(event) => {
            const checker = document.getElementById("availability-checker");
            if (!checker || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            checker.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
            checker.focus({ preventScroll: true });
          }}>Check availability <ArrowUpRight size={18} aria-hidden="true" /></a>}
          <span className="booking-flow-scroll"><ArrowDown size={16} aria-hidden="true" /> Scroll through the steps</span>
        </header>
        <ol className="booking-flow-stack">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li className="booking-flow-card" key={step.title} style={{ "--step": index }}>
                <div className="booking-flow-photo">
                  <img src={step.image} alt={step.alt} loading={index === 0 ? "eager" : "lazy"} />
                  <span className="booking-flow-number">0{index + 1}<span> / 05</span></span>
                  <span className="booking-flow-photo-label"><Icon size={16} aria-hidden="true" /> {step.label}</span>
                </div>
                <div className="booking-flow-caption">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
