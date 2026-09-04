import CheckAvailabilitySection from "../components/CheckAvailabilitySection";
import { FaFacebook, FaTiktok } from "react-icons/fa";

export default function CheckAvailabilityPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <main>
        <CheckAvailabilitySection showBookNow standalone />
      </main>

      <footer
        className="w-full bg-[#191C1A] font-sans text-gray-300"
        style={{ borderTop: "3px solid #597E52" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div
            className="flex flex-col items-start justify-between gap-8 pb-10 md:flex-row"
            style={{ borderBottom: "2px solid #2A2F2B" }}
          >
            <div className="max-w-sm text-left">
              <p className="mb-5 text-xs font-medium leading-relaxed tracking-wide text-gray-400">
                Premium Outdoor &amp; Field Gear Rental Systems.
              </p>

              <div
                className="inline-block rounded-xl bg-[#222623] p-4 text-left"
                style={{
                  border: "2px solid #C6A969",
                  boxShadow: "0 4px 0px rgba(198, 169, 105, 0.2)",
                }}
              >
                <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-[#C6A969]">
                  Registered Entity
                </span>
                <span className="block text-sm font-bold uppercase tracking-wide text-white">
                  Qashcamp Enterprise
                </span>
                <span className="mt-0.5 block font-mono text-[10px] font-semibold text-gray-400">
                  Reg No: 202603102331 (IP0624208-V)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 text-left text-sm sm:gap-16">
              <div className="flex min-w-[120px] flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C6A969]">Navigation</span>
                <a href="/#choosePackage" className="font-bold text-gray-300 transition-colors hover:text-[#597E52]">Our Packages</a>
                <a href="/#why-us" className="font-bold text-gray-300 transition-colors hover:text-[#597E52]">Why Kaiso</a>
              </div>
              <div className="flex min-w-[120px] flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C6A969]">Support</span>
                <span className="font-semibold text-gray-300">Selangor, MY</span>
                <span className="font-semibold text-gray-300">Terms &amp; Deposit</span>
              </div>
              <div className="flex min-w-[120px] flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C6A969]">Social</span>
                <a
                  href="https://www.tiktok.com/@qashcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 truncate font-bold text-gray-300 transition-colors hover:text-[#597E52]"
                >
                  <FaTiktok className="h-4 w-4 shrink-0" />
                  <span className="truncate">@qashcamp</span>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61589566700509"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 truncate font-bold text-gray-300 transition-colors hover:text-[#597E52]"
                >
                  <FaFacebook className="h-4 w-4 shrink-0" />
                  <span className="truncate">QashCamp Facebook</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-xs font-bold text-gray-500">
              &copy; {new Date().getFullYear()} Kaiso Camp. All rights reserved.
            </p>
            <div className="flex flex-col gap-3 text-xs font-bold tracking-wide text-gray-500 sm:flex-row sm:items-center">
              <div className="flex items-center gap-1.5">
                <span>Powered by</span>
                <a
                  href="https://binaidea.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-extrabold text-white underline decoration-[#C6A969] decoration-2 underline-offset-4 transition-all duration-200 hover:scale-105 hover:text-[#597E52]"
                >
                  BinaIdea
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
