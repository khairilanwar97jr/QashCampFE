import { ArrowDown, ArrowUpRight, CalendarDays, CreditCard, MapPin, Tent, PackageCheck } from "lucide-react";
import availabilityPhoto from "../assets/packageA.jpg";
import paymentPhoto from "../assets/packageB.jpg";
import pickupDetailsPhoto from "../assets/maintenance1.jpg";
import campingPhoto from "../assets/packageC.jpg";
import returnPhoto from "../assets/maintenance2.jpg";
import "./BookingFlowGuide.css";

// Replace these five images with the final guide photos when ready.
const steps = [
  { title: "Check availability", text: "Choose your dates and find an available tent package.", image: availabilityPhoto, alt: "Qashcamp tent package", icon: CalendarDays, label: "Find your dates" },
  { title: "Book & pay online", text: "Complete your booking and payment through our system.", image: paymentPhoto, alt: "A Qashcamp camping setup", icon: CreditCard, label: "Make it official" },
  { title: "Get your pickup details", text: "Receive the pickup location and instructions.", image: pickupDetailsPhoto, alt: "Qashcamp equipment preparation", icon: MapPin, label: "Know where to go" },
  { title: "Pick up & go camping", text: "Collect your equipment and enjoy your camping trip!", image: campingPhoto, alt: "A tent ready for a camping trip", icon: Tent, label: "Adventure time" },
  { title: "Return your equipment", text: "Return all items clean and packed as you received them.", image: returnPhoto, alt: "Qashcamp equipment care", icon: PackageCheck, label: "Pack it with care" },
];

export default function BookingFlowGuide() {
  return (
    <section className="booking-flow" aria-labelledby="booking-flow-title">
      <div className="booking-flow-layout">
        <header className="booking-flow-heading">
          <a className="booking-flow-brand" href="/">QASHCAMP <span> / YOUR CAMPING GUIDE</span></a>
          <p className="booking-flow-eyebrow">From booking to the great outdoors</p>
          <h2 id="booking-flow-title">Your next escape,<br /><em>in 5 easy steps.</em></h2>
          <p>A little planning, a lot of fresh air. Here’s how camping with us works.</p>
          <a className="booking-flow-shortcut" href="#availability-checker" onClick={(event) => {
            const checker = document.getElementById("availability-checker");
            if (!checker || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            checker.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
            checker.focus({ preventScroll: true });
          }}>Check availability <ArrowUpRight size={18} aria-hidden="true" /></a>
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
