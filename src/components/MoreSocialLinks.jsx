import { FaInstagram } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";

const profiles = [
  { name: "Instagram", url: "https://www.instagram.com/qashcampmy/", Icon: FaInstagram },
  { name: "Threads", url: "https://www.threads.com/@qashcampmy", Icon: FaThreads },
];

export default function MoreSocialLinks({ buttons = false }) {
  return profiles.map(({ name, url, Icon }) => (
    <a
      key={name}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`QashCamp @qashcampmy on ${name} (opens in a new tab)`}
      className={buttons
        ? "flex items-center gap-2 rounded-xl border border-[#bdc1aa] bg-[#faf9f3] px-4 py-3 text-sm font-bold text-[#415337] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#476440]"
        : "inline-flex items-center gap-2 font-bold text-gray-300 transition-colors hover:text-[#597E52]"}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{buttons ? name : `${name} · @qashcampmy`}</span>
    </a>
  ));
}
