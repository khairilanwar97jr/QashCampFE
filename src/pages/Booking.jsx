import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";


import Navbar from "../components/Navbar";
import AddOnModal from "../components/AddOnModal";
import TermsModal from "../components/TermsModal";

import packageAwanImg from "../assets/package_A_awan.png";
import packagePurnamaImg from "../assets/package_B_purnama.png";
import packageSenjaImg from "../assets/package_C_senja.png";
import packageLestariImg from "../assets/package_D_lestari.png";
import packageEmbunImg from "../assets/package_E_embun.png";
import packageAuroraImg from "../assets/package_F_aurora.png";
import packageRimbayuImg from "../assets/package_G_rimbayu.png";
//pic
import packageA from "../assets/packageA.jpg";
import packageA1 from "../assets/packageA1.jpg";
import packageA2 from "../assets/packageA2.jpg";
import packageA3 from "../assets/packageA3.jpg";
import packageA4 from "../assets/packageA4.jpg";

import packageB from "../assets/packageB.jpg";
import packageB1 from "../assets/packageB1.jpg";
import packageB2 from "../assets/packageB2.jpg";
import packageB3 from "../assets/packageB3.jpg";
import packageB4 from "../assets/packageB4.jpg";

import packageC from "../assets/packageC.jpg";
import packageC1 from "../assets/packageC1.jpg";
import packageC2 from "../assets/packageC2.jpg";
import packageC3 from "../assets/packageC3.jpg";
import packageC4 from "../assets/packageC4.jpg";

import packageD from "../assets/packageD.jpg";
import packageD1 from "../assets/packageD1.jpg";
import packageD2 from "../assets/packageD2.jpg";
import packageD3 from "../assets/packageD3.jpg";
import packageD4 from "../assets/packageD4.jpg";

import packageE from "../assets/packageE.jpg";
import packageE1 from "../assets/packageE1.jpg";
import packageE2 from "../assets/packageE2.jpg";
import packageE3 from "../assets/packageE3.jpg";
import packageE4 from "../assets/packageE4.jpg";

import packageF from "../assets/packageF.jpg";
import packageF1 from "../assets/packageF1.png";
import packageF2 from "../assets/packageF2.png";
import packageF3 from "../assets/packageF3.png";
import packageF4 from "../assets/packageF4.png";

import packageG from "../assets/packageG.jpg";
import packageG1 from "../assets/packageG1.jpg";
import packageG2 from "../assets/packageG2.jpg";
import packageG3 from "../assets/packageG3.jpg";
import packageG4 from "../assets/packageG4.jpg";
import { useRef } from 'react'; // Add this if you don't have useRef imported yet
import html2canvas from 'html2canvas'; // Add this line

import ZoomOnHover from "../components/ZoomOnHover"; // import the new component
const API_URL = import.meta.env.VITE_API_URL;


export default function Booking() {
  const location = useLocation();
  const bookingState = location.state?.booking;
  const { bookingRef } = useParams();
  const isExistingBooking = !!bookingRef;
  const [bookingData, setBookingData] = useState(null);

  // Add this at the top of your main page component

  const [loading, setLoading] = useState(false);
  const selectedPackage =
    bookingData?.package?.name || location.state?.packageName;

  const selectedPackageId =
    bookingData?.package?.id || location.state?.packageId;

  const bookingType =
    bookingData?.booking_type || location.state?.type || "BOOKING";

  const formMode = isExistingBooking
    ? (location.state?.type ?? "FINAL_PAYMENT")
    : (location.state?.type ?? "BOOKING");

  const isWalkIn = formMode === "WALK_IN";
  const isBooking = formMode === "BOOKING";
  const isFinalPayment = formMode === "FINAL_PAYMENT";

  const canChooseAddOns =
    isWalkIn || isExistingBooking;

  const selectedPackagePrice = Number(
    bookingData?.package_price ?? location.state?.packagePrice ?? 0
  );

  const depositAmount = Number(
    bookingData?.deposit_amount ?? location.state?.depositAmount ?? 0
  );

  const packageThumbnails = {
    Awan: [packageA, packageA1, packageA2, packageA3, packageA4],

    Purnama: [packageB, packageB1, packageB2, packageB3, packageB4],

    Senja: [packageC, packageC1, packageC2, packageC3, packageC4],

    Lestari: [packageD, packageD1, packageD2, packageD3, packageD4],

    Embun: [packageE, packageE1, packageE2, packageE3, packageE4],

    Aurora: [packageF, packageF1, packageF2, packageF3, packageF4],

    Rimbayu: [packageG, packageG1, packageG2, packageG3, packageG4],
  };

  const packageImages = {
    Awan: packageAwanImg,
    Purnama: packagePurnamaImg,
    Senja: packageSenjaImg,
    Lestari: packageLestariImg,
    Embun: packageEmbunImg,
    Aurora: packageAuroraImg,
    Rimbayu: packageRimbayuImg,
  };

  const thumbnails = packageThumbnails[selectedPackage] || [];
  const packageImg = packageImages[selectedPackage] || null;

  const [showModal, setShowModal] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Calculate number of nights safely. Example: Apr 10 -> Apr 11 = 1 night.
  let numNights = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    numNights = diffNights > 0 ? diffNights : 0;
  }

  // Total price from package selected on homepage
  const basePackagePrice = selectedPackagePrice;
  const additionalNights = Math.max(numNights - 1, 0);
  const additionalNightCharge = additionalNights * 50;
  const packagePrice = basePackagePrice + additionalNightCharge;
  const addOnsTotal = selectedAddOns.reduce(
    (sum, a) => sum + Number(a.price || 0),
    0
  );
  const totalPrice = packagePrice + addOnsTotal + depositAmount;
  const apiTotal = isExistingBooking
    ? basePackagePrice + additionalNightCharge + addOnsTotal
    : bookingType === "BOOKING"
      ? depositAmount
      : totalPrice;

  const submitLabel = isFinalPayment
    ? "Pay Final Balance"
    : isWalkIn
      ? "Confirm Walk In"
      : "Submit Booking";


  const summaryTheme = isWalkIn
    ? {
      card: "bg-green-50 border-green-500",
      badge: "bg-green-600 text-white",
      total: "text-green-800",
      label: "WALK IN",
    }
    : isFinalPayment
      ? {
        card: "bg-purple-50 border-purple-500",
        badge: "bg-purple-600 text-white",
        total: "text-purple-800",
        label: "FINAL PAYMENT",
      }
      : {
        card: "bg-blue-50 border-blue-500",
        badge: "bg-blue-600 text-white",
        total: "text-blue-800",
        label: "BOOKING",
      };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);

  useEffect(() => {
    if (!canChooseAddOns) {
      setSelectedAddOns([]);
      setShowModal(false);
    }
  }, [canChooseAddOns]);

  useEffect(() => {
    if (!bookingRef) {
      setBookingData(null);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/bookings/getBooking?ref=${bookingRef}`
        );

        const data = await res.json();

        if (data.success) {
          setBookingData(data.data);
        }
      } catch (err) {
        setLoading(false);
        console.error("Failed to fetch booking:", err);
      }
    };

    fetchBooking();
  }, [bookingRef]);

  useEffect(() => {
    if (!bookingData) return;

    setFirstName(bookingData.first_name || "");
    setLastName(bookingData.last_name || "");
    setPhone(bookingData.phone_no || "");
    setEmail(bookingData.email_addr || "");
    setIdNumber(bookingData.no_id || "");
    setAddress1(bookingData.address1 || "");
    setAddress2(bookingData.address2 || "");
    setAddress3(bookingData.address3 || "");
    setCampLocation(bookingData.camp_place || "");
    setStartDate(bookingData.start_date || "");
    setEndDate(bookingData.end_date || "");
  }, [bookingData]);


  useEffect(() => {
    if (!bookingData) return;

    setSubmittedData({
      firstName: bookingData.first_name || "",
      lastName: bookingData.last_name || "",
      phone: bookingData.phone_no || "",
      email: bookingData.email_addr || "",
      idNumber: bookingData.no_id || "",
      startDate: bookingData.start_date || "",
      endDate: bookingData.end_date || "",
      campLocation: bookingData.camp_place || "",
      address1: bookingData.address1 || "",
      address2: bookingData.address2 || "",
      address3: bookingData.address3 || "",
    });
  }, [bookingData]);
  // Callback from Add-On modal
  const handleSaveAddOns = (addons) => {
    setSelectedAddOns(addons);
    setShowModal(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    console.log("Booking submitted:", {
      selectedAddOns,
      agreed,
      selectedPackage,
    });
    alert("Booking submitted successfully!");
  };

  const [enlargedImg, setEnlargedImg] = useState(null);
  const [openBookingForm, setOpenBookingForm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [campLocation, setCampLocation] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const packageIdMapping = {
    Awan: 1,
    Purnama: 2,
    Senja: 3,
    Lestari: 4,
    Embun: 5,
    Aurora: 6,
    Rimbayu: 7,
  };

  const tentPackages = {
    Awan: {
      name: "Package Awan",
      criteria: {
        brand: "Naturehike Ango",
        size: "210 × 210 × 160 cm",
        weight: "5.1 kg",
        type: "1 Bed Cabin",
        setup: "Automatic",
      },
    },

    Purnama: {
      name: "Package Purnama",
      criteria: {
        brand: "Naturehike Ango Vinyl",
        size: "210 × 210 × 160 cm",
        weight: "5.1 kg",
        type: "1 Bed Dome",
        setup: "Automatic",
      },
    },

    Senja: {
      name: "Package Senja",
      criteria: {
        brand: "Blackdog 3-4",
        size: "240 × 240 × 160 cm",
        weight: "5.03 kg",
        type: "Single Layer",
        setup: "Automatic",
      },
    },

    Lestari: {
      name: "Package Lestari",
      criteria: {
        brand: "Vidalido Poon Saan M",
        size: "330 × 220 × 185 cm",
        weight: "12.0 kg",
        type: "2 Room Tunnel",
        setup: "Manual Setup",
      },
    },

    Embun: {
      name: "Package Embun",
      criteria: {
        brand: "LNT Anchala",
        size: "320 × 220 × 175 cm",
        weight: "18.0 kg",
        type: "Double Wall Tunnel",
        setup: "Automatic",
      },
    },

    Aurora: {
      name: "Package Aurora",
      criteria: {
        brand: "Mobi Garden Holiday 10.9",
        size: "395 × 270 × 180 cm",
        weight: "19.4 kg",
        type: "2 Room Cabin",
        setup: "Automatic",
      },
    },

    Rimbayu: {
      name: "Package Rimbayu",
      criteria: {
        brand: "Naturehike Village 13",
        size: "395 × 270 × 183 cm",
        weight: "22.0 kg",
        type: "2 Bed 1 Living",
        setup: "Automatic",
      },
    },
  };

  const [successNotification, setSuccessNotification] = useState(null);

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, ""); // remove non-numbers

    digits = digits.slice(0, 11); // limit to valid max

    if (digits.length <= 3) return digits;

    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  };

  const formatNRIC = (value) => {
    let digits = value.replace(/\D/g, ""); // only numbers

    digits = digits.slice(0, 12); // NRIC = 12 digits

    if (digits.length <= 6) return digits;
    if (digits.length <= 8)
      return `${digits.slice(0, 6)}-${digits.slice(6)}`;

    return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  };

  const [savedSignature, setSavedSignature] = useState(null);
  const [finalSummary, setFinalSummary] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const summaryRef = useRef(null);

  const [showProcessingPopup, setShowProcessingPopup] = useState(false);
  const [popupResolver, setPopupResolver] = useState(null);
  return (
    <>
      <Navbar />

      {/* Page Header - Rich Darker Oatmeal Base */}
      <div
        className="w-full mt-20 py-14 mb-6 flex flex-col items-center px-4 sm:px-6 lg:px-8 border-b transition-all duration-300"
        style={{
          backgroundColor: "#EBE3CE", // Darker Rich Ivory
          borderColor: "#DACFA9",
          backgroundImage: "radial-gradient(#D3C59A 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <h1
          className="text-3xl sm:text-4xl font-bold mb-3 text-center tracking-tight"
          style={{
            color: "#43613D", // Deeper Cozy Forest Green
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          Reservation Ledger
        </h1>
        <div className="h-1 w-20 my-2 rounded-full" style={{ backgroundColor: "#B39658" }}></div>
        <p
          className="text-xs sm:text-sm md:text-base max-w-xl text-center px-4 font-semibold italic tracking-wide"
          style={{ color: "#666055" }} // Deepened Muted Taupe
        >
          Please review your selected setup and complete your booking registration below.
        </p>
      </div>

      {/* Main Container - Darker Almond / Toasted Canvas Backdrop */}
      <div
        className="min-h-screen py-8 flex flex-col lg:flex-row justify-center items-start gap-8 px-4 transition-all duration-300"
        style={{
          backgroundColor: "#F3EDE0", // Richer Deep Almond
          backgroundImage: "linear-gradient(#EAE1D0 1px, transparent 1px), linear-gradient(90deg, #EAE1D0 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      >
        {/* Left Column: Premium Enlarged Image Showcase Card */}
        <div
          className="flex flex-col w-full lg:w-[540px] p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundColor: "#FDFBF7", // Toasted Ivory Canvas
            borderColor: "#E5DCB9",
            boxShadow: "0 15px 35px -10px rgba(95, 88, 73, 0.15), 0 10px 20px -8px rgba(95, 88, 73, 0.08)"
          }}
        >
          {/* Package Title Header Block */}
          {selectedPackage && tentPackages[selectedPackage] && (
            <div className="border-b pb-4 mb-5 w-full flex items-center justify-between" style={{ borderColor: "#E5DCB9" }}>
              <h2
                className="text-xl sm:text-2xl font-bold tracking-wide pl-3 border-l-4"
                style={{
                  color: "#43613D",
                  borderColor: "#B39658"
                }}
              >
                {tentPackages[selectedPackage].name}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-stone-200 px-2.5 py-1 rounded-md text-stone-600 border border-stone-300">
                Selected Pack
              </span>
            </div>
          )}

{/* Enlarged Roasted Product Stage */}
<div
  className="flex flex-col w-full p-4 rounded-xl border items-center max-w-full overflow-hidden transition-all min-h-[260px] sm:min-h-[300px] justify-center relative group shadow-inner"
  style={{
    backgroundColor: "#EBE2CD", // Darker Roasted Latte Matrix
    borderColor: "#D3C6A2",
  }}
>
  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZHRoPSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4zIi8+Cjwvc3ZnPg==')" }}></div>
  {packageImg && (
    <img
      src={packageImg}
      alt={selectedPackage}
      className="w-full max-w-[260px] sm:max-w-[320px] h-auto rounded-xl shadow-md transition-transform duration-300 object-contain"
    />
  )}
</div>

          {/* Thumbnails Portfolio Section */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center w-full">
            {thumbnails.map((img, idx) => (
              <div key={idx} className="relative p-0.5 rounded-xl border transition-all" style={{ borderColor: "#D3C6A2" }}>
                <img
                  src={img}
                  alt={`Portfolio Element ${idx + 1}`}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-xs"
                  onClick={() => setEnlargedImg(img)}
                  onMouseEnter={(e) => e.target.parentElement.style.borderColor = "#43613D"}
                  onMouseLeave={(e) => e.target.parentElement.style.borderColor = "#D3C6A2"}
                />
              </div>
            ))}
          </div>

          {/* Technical Specification Checklist with Roasted Tone Layout */}
          {selectedPackage && (
            <div
              className="mt-6 w-full px-5 py-4 rounded-xl text-xs sm:text-sm space-y-3 border relative overflow-hidden shadow-xs"
              style={{ backgroundColor: "#EBE2CD", borderColor: "#D3C6A2" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#B39658" }}></div>
                <p className="uppercase font-bold tracking-widest text-[10px]" style={{ color: "#9E8243" }}>
                  Equipment Specifications
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 font-semibold" style={{ color: "#544E45" }}>
                <p className="bg-stone-100/60 p-2 rounded-lg"><span className="font-bold text-stone-500 block text-[10px] uppercase">Brand</span> {tentPackages[selectedPackage].criteria.brand}</p>
                <p className="bg-stone-100/60 p-2 rounded-lg"><span className="font-bold text-stone-500 block text-[10px] uppercase">Size</span> {tentPackages[selectedPackage].criteria.size}</p>
                <p className="bg-stone-100/60 p-2 rounded-lg"><span className="font-bold text-stone-500 block text-[10px] uppercase">Weight</span> {tentPackages[selectedPackage].criteria.weight}</p>
                <p className="bg-stone-100/60 p-2 rounded-lg"><span className="font-bold text-stone-500 block text-[10px] uppercase">Type</span> {tentPackages[selectedPackage].criteria.type}</p>
                <p className="col-span-2 bg-stone-100/60 p-2 rounded-lg"><span className="font-bold text-stone-500 block text-[10px] uppercase">Setup Profile</span> {tentPackages[selectedPackage].criteria.setup}</p>
              </div>
            </div>
          )}

          {/* Fullscreen Image Overlay Modal */}
          {enlargedImg && (
            <div
              className="fixed inset-0 bg-stone-950/85 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn"
              onClick={() => setEnlargedImg(null)}
            >
              <img
                src={enlargedImg}
                alt="Enlarged Portfolio Element"
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-4"
                style={{ borderColor: "#FDFBF7" }}
              />
            </div>
          )}

          {/* Trigger Registration Form */}
          <button
            onClick={() => setOpenBookingForm(true)}
            className="mt-6 w-full text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-center tracking-wider text-xs uppercase transform active:scale-98 shadow-md"
            style={{
              backgroundColor: "#43613D",
              boxShadow: "0 6px 20px rgba(67, 97, 61, 0.3)"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#32492D"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#43613D"}
          >
            ✨ Open Configuration Registry Form
          </button>
        </div>

        {/* Right Column: Statement Card / Invoice Dashboard */}
        <div
          ref={summaryRef} /* 👈 ADD THIS LINE HERE */
          className={`${summaryTheme.card} border rounded-2xl p-6 w-full lg:w-[440px] transition-all duration-300 hover:shadow-2xl`}
          style={{
            backgroundColor: "#FDFBF7",
            borderColor: "#E5DCB9",
            boxShadow: "0 15px 35px -10px rgba(95, 88, 73, 0.15), 0 10px 20px -8px rgba(95, 88, 73, 0.08)"
          }}
        >
          <div
            className={`${summaryTheme.card} border rounded-2xl p-6 w-full lg:w-[440px] transition-all duration-300 hover:shadow-2xl`}
            style={{
              backgroundColor: "#FDFBF7",
              borderColor: "#E5DCB9",
              boxShadow: "0 15px 35px -10px rgba(95, 88, 73, 0.15), 0 10px 20px -8px rgba(95, 88, 73, 0.08)"
            }}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-3" style={{ borderColor: "#E5DCB9" }}>
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#B39658" }}>
                Summary Overview
              </h2>
              <span className={`${summaryTheme.badge} rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider`}>
                {summaryTheme.label}
              </span>
            </div>

            <div
              className="space-y-3 text-sm border p-4 rounded-xl shadow-xs"
              style={{ backgroundColor: "#EBE2CD", borderColor: "#D3C6A2", color: "#544E45" }}
            >
              <p className={`font-bold flex justify-between ${packagePrice === 0 ? "text-red-600" : ""}`} style={{ color: packagePrice > 0 ? "#43613D" : "" }}>
                <span>Base Package Rate:</span>
                <span>{basePackagePrice > 0 ? `RM${basePackagePrice}` : "None Selected"}</span>
              </p>

              {additionalNightCharge > 0 && (
                <div className="text-xs bg-stone-100/60 p-2.5 rounded-lg border flex justify-between items-center" style={{ borderColor: "#D3C6A2" }}>
                  <span>Extended Duration ({additionalNights} Ngt):</span>
                  <strong style={{ color: "#43613D" }}>+RM{additionalNightCharge}</strong>
                </div>
              )}

              {!isExistingBooking && (
                <p className="font-semibold text-xs flex justify-between text-stone-600 border-t pt-2 mt-2" style={{ borderColor: "#D3C6A2" }}>
                  <span>Security Deposit (Refundable):</span>
                  <span>RM{depositAmount}</span>
                </p>
              )}



              {/* Auxiliary Options Streamliner */}
              {selectedAddOns.length > 0 ? (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: "#D3C6A2" }}>
                  <p className="font-bold text-[10px] uppercase tracking-wider mb-2" style={{ color: "#9E8243" }}>Auxiliary Customizations</p>
                  <ul className="list-none space-y-1.5 text-xs">
                    {selectedAddOns.map((a) => (
                      <li key={a.id} className="flex justify-between items-center bg-stone-100/60 px-2.5 py-2 rounded-lg border" style={{ borderColor: "#D3C6A2" }}>
                        <span className="font-semibold text-stone-700">{a.name}</span>
                        <span className="font-bold" style={{ color: "#43613D" }}>+RM{a.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-2 text-xs italic border-t pt-2" style={{ color: "#8E8473", borderColor: "#D3C6A2" }}>No auxiliary items requested</p>
              )}

              {/* 👇 NEW ONLINE PROCESSING FEE ROW */}
              <p className="font-semibold text-xs flex justify-between text-stone-600 border-t pt-2 mt-2" style={{ borderColor: "#D3C6A2" }}>
                <span>Online Processing Fee:</span>
                <span>RM1.25</span>
              </p>
            </div>

            {/* Client Summary Snapshot Card */}
            {submittedData && (
              <div
                className="mt-5 border p-4 rounded-xl text-xs space-y-2 shadow-xs border-l-4"
                style={{ backgroundColor: "#EBE2CD", borderColor: "#B39658", color: "#544E45" }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 border-b pb-2" style={{ borderColor: "#D3C6A2" }}>
                  <p className="font-bold uppercase tracking-wider text-[10px]" style={{ color: "#9E8243" }}>Client Snapshot Log</p>
                  <button
                    type="button"
                    onClick={() => setOpenBookingForm(true)}
                    className="rounded-md bg-stone-100 px-2 py-1 text-[10px] font-bold border transition-all shadow-xs"
                    style={{ borderColor: "#D3C6A2", color: "#544E45" }}
                    onMouseEnter={(e) => e.target.style.borderColor = "#43613D"}
                    onMouseLeave={(e) => e.target.style.borderColor = "#D3C6A2"}
                  >
                    Modify Log
                  </button>
                </div>

                <p><span className="font-bold text-stone-500 mr-1">Client:</span> {submittedData.firstName} {submittedData.lastName}</p>
                <p><span className="font-bold text-stone-500 mr-1">Contact:</span> {formatPhone(submittedData.phone)}</p>
                <p><span className="font-bold text-stone-500 mr-1">Email:</span> {submittedData.email}</p>
                <p><span className="font-bold text-stone-500 mr-1">Identity No:</span> {formatNRIC(submittedData.idNumber)}</p>
                <p><span className="font-bold text-stone-500 mr-1">Timeline:</span> {submittedData.startDate} ~ {submittedData.endDate}</p>
                <p className="truncate max-w-full">
                  <span className="font-bold text-stone-500 mr-1">Address:</span>
                  {[submittedData.address1, submittedData.address2, submittedData.address3].filter(Boolean).join(', ')}
                </p>
                <p><span className="font-bold text-stone-500 mr-1">Site Placement:</span> {submittedData.campLocation}</p>

              </div>
            )}

            {/* Total Cost Presentation Summary Block */}
            <div
              className={`mt-6 border-t pt-4 text-base font-bold flex justify-between items-center ${summaryTheme.total}`}
              style={{ borderColor: "#E5DCB9" }}
            >
              <span style={{ color: "#544E45" }}>Total Invoice Amount:</span>
              <span className="text-2xl sm:text-3xl tracking-tight" style={{ color: "#43613D" }}>
                RM{(Number(apiTotal) + 1.25).toFixed(2)}
              </span>
            </div>

            {/* Signature Overview Display Box */}
            {savedSignature ? (
              <div
                className="mt-5 p-4 rounded-xl border space-y-2 shadow-inner w-full max-w-xs" /* 👈 ADDED mt-5 HERE */
                style={{ backgroundColor: "#EBE2CD", borderColor: "#D3C6A2" }}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-stone-700">
                  Customer Signature
                </p>
                <div className="bg-white rounded-lg p-2 border border-stone-200">
                  <img
                    src={savedSignature}
                    alt="Customer Signature"
                    className="w-full h-auto object-contain max-h-16 mix-blend-multiply"
                  />
                </div>
              </div>
            ) : (
              <div
                className="p-4 rounded-xl border border-dashed text-center text-xs font-medium text-stone-500"
                style={{ borderColor: "#D3C6A2" }}
              >
                No signature captured yet.
              </div>
            )}

            {/* Terms Ratification Box */}
            <div className="mt-6 p-4 rounded-xl border space-y-4 shadow-inner relative" style={{ backgroundColor: "#EBE2CD", borderColor: "#D3C6A2" }}>
              <div className="flex items-start gap-3 relative">

                {/* Tooltip Popup */}
                {showTooltip && (
                  <div className="absolute bottom-full left-0 mb-2 z-10 w-56 p-2 rounded-lg shadow text-xs font-medium text-white bg-stone-800">
                    Please read the regulation first
                    <div className="absolute top-full left-2 w-2 h-2 bg-stone-800 rotate-45 -mt-1"></div>
                  </div>
                )}

                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    if (hasReadTerms) {
                      setAgreed(e.target.checked);
                    }
                  }}
                  onClick={(e) => {
                    if (!hasReadTerms) {
                      e.preventDefault();
                      setShowTooltip(true);

                      // Automatically hide the tooltip after 3 seconds
                      setTimeout(() => {
                        setShowTooltip(false);
                      }, 3000);
                    }
                  }}
                  className="w-4 h-4 mt-0.5 rounded cursor-pointer accent-emerald-800"
                  required
                />
                <label htmlFor="agree" className="text-xs font-semibold leading-relaxed" style={{ color: "#544E45" }}>
                  I certify and agree with all operational
                  <button
                    type="button"
                    onClick={() => {
                      setShowTerms(true);
                      setHasReadTerms(true);
                      setShowTooltip(false);
                    }}
                    className="underline font-bold ml-1 transition-colors hover:text-stone-900"
                    style={{ color: "#43613D" }}
                  >
                    Terms and System Policies
                  </button>
                </label>
              </div>
            </div>
            {/* Submission Pipeline Trigger */}
            <div className="w-full mt-5">
              <button
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();

                  if (!firstName || !phone || !email || !idNumber) {
                    alert("Please fill all mandatory parameters (*)");
                    return;
                  }
                  if (!startDate || !endDate || numNights === 0) {
                    alert("Please provide valid schedule timeline entries");
                    return;
                  }
                  if (totalPrice === 0) {
                    alert("Please choose an official configuration package setup");
                    return;
                  }

                  setLoading(true);
                  // 2. SCREENSHOT CAPTURE BLOCK
                let summaryScreenshotBase64 = "";

if (summaryRef.current) {
  try {
    // 1. Show the popup and pause the code right here!
    setShowProcessingPopup(true);
    
    // Create a promise that waits until you click "Dismiss"
    await new Promise((resolve) => {
      setPopupResolver(() => resolve);
    });

    // 2. NOW IT PROCEEDS! Once you click dismiss, the code continues down here:
    const element = summaryRef.current; 

    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: "#FDFBF7",
      scale: 2, 
      logging: false,
      width: element.offsetWidth,   
      height: element.offsetHeight, 
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.offsetWidth,   
      windowHeight: element.offsetHeight, 
    });
    
    summaryScreenshotBase64 = canvas.toDataURL("image/jpeg", 0.9);

  } catch (screenshotErr) {
    console.error("Failed to capture summary snapshot:", screenshotErr);
  }
} else {
  console.error("Error: summaryRef.current is NULL!");
}

                  const rawNRIC = idNumber.replace(/\D/g, "");
                  const rawPhone = phone.replace(/\D/g, "");
                  let payload;

                  if (isFinalPayment) {
                    payload = {
                      bookingId: bookingData?.id,
                      bookingRef: bookingRef,
                      addOnIds: selectedAddOns.map((a) => a.id),
                      extraNightCount: additionalNights,
                      summarySnapshot: summaryScreenshotBase64, // 👇 INJECTED HERE
                    };
                  } else {
                    payload = {
                      type: formMode,
                      firstName,
                      lastName,
                      noId: rawNRIC,
                      address1,
                      address2,
                      address3,
                      startDate,
                      endDate,
                      packageId: selectedPackageId ?? packageIdMapping[selectedPackage],
                      addOnIds: selectedAddOns.map((a) => a.id),
                      phoneNo: rawPhone,
                      emailAddr: email,
                      campPlace: campLocation,
                      package_price: basePackagePrice,
                      deposit_amount: depositAmount,
                      total: apiTotal,
                      summarySnapshot: summaryScreenshotBase64,
                    };
                  }

                  try {
                    let endpoint = isFinalPayment
                      ? `${API_URL}/api/bookings/pay-final`
                      : `${API_URL}/api/bookings/book`;

                    const res = await fetch(endpoint, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });

                    const data = await res.json();

                    if (res.ok) {
                      setLoading(false);
                      const bookingId = data.bookingId || data.id || data.booking?.id;
                      const paymentUrl = bookingId && data.paymentUrl
                        ? data.paymentUrl.replace("bookingId=undefined", `bookingId=${bookingId}`)
                        : data.paymentUrl;

                      setSubmittedData({
                        firstName, lastName, phone, email, idNumber, startDate, endDate, campLocation, address1, address2, address3
                      });
                      setSuccessNotification({
                        message: "Reservation saved successfully to our records.",
                        paymentUrl,
                      });
                      setOpenBookingForm(false);

                      setFirstName(""); setLastName(""); setPhone(""); setEmail(""); setIdNumber(""); setCampLocation(""); setAddress1(""); setAddress2(""); setAddress3("");
                    } else {
                      setLoading(false);
                      alert(`Submission Error: ${data.message || "Failed tracking logs"}`);
                    }
                  } catch (err) {
                    console.error("Booking connection failure:", err);
                    alert("Network connectivity layer mismatch. Link failure.");
                  }
                }}
                disabled={totalPrice === 0 || !agreed || loading}
                className="w-full py-3.5 px-6 rounded-xl transition-all flex-shrink-0 flex items-center justify-center min-h-[52px] text-xs font-bold uppercase tracking-widest text-white shadow-md"
                style={{
                  backgroundColor: totalPrice === 0 || !agreed || loading ? "#C8C0AF" : "#43613D",
                  cursor: totalPrice === 0 || !agreed || loading ? "not-allowed" : "pointer",
                  boxShadow: totalPrice === 0 || !agreed || loading ? "none" : "0 5px 15px rgba(67, 97, 61, 0.2)"
                }}
                onMouseEnter={(e) => {
                  if (!(totalPrice === 0 || !agreed || loading)) e.target.style.backgroundColor = "#32492D";
                }}
                onMouseLeave={(e) => {
                  if (!(totalPrice === 0 || !agreed || loading)) e.target.style.backgroundColor = "#43613D";
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing Sync...
                  </span>
                ) : (
                  submitLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Input Frame Box Overlay */}
      {openBookingForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs z-50 px-4">
          <div
            className="rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col relative border bg-white shadow-2xl animate-scaleUp"
            style={{ borderColor: "#E5DCB9" }}
          >
            {/* Header layout controls form fields */}
            <div className="p-6 border-b relative rounded-t-2xl" style={{ backgroundColor: "#EBE2CD", borderColor: "#D3C6A2" }}>
              <h2 className="text-lg font-bold tracking-tight pl-2.5 border-l-3" style={{ color: "#43613D", borderColor: "#B39658", fontFamily: "'Playfair Display', Georgia, serif" }}>
                Information Input Form
              </h2>
              <p className="text-xs font-medium mt-1 pl-2.5" style={{ color: "#666055" }}>
                Please ensure all inputs match identity papers correctly.
              </p>

              <div className="absolute top-5 right-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFirstName(""); setLastName(""); setAddress1(""); setAddress2(""); setAddress3(""); setPhone(""); setEmail(""); setIdNumber(""); setStartDate(""); setEndDate(""); setCampLocation(""); setSelectedAddOns([]); setSubmittedData(null);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 border rounded-lg bg-stone-50 transition-all shadow-xs"
                  style={{ borderColor: "#D3C6A2", color: "#544E45" }}
                  onMouseEnter={(e) => e.target.style.borderColor = "#43613D"}
                  onMouseLeave={(e) => e.target.style.borderColor = "#D3C6A2"}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setOpenBookingForm(false)}
                  className="text-2xl font-light w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Core Body Container Input Block */}
            <form id="bookingForm" onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

              {/* Helper Function to handle Title Case Capitalization */}
              {(() => {
                const formatToTitleCase = (str) => {
                  return str
                    .toLowerCase()
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ");
                };

                return (
                  <>
                    {/* Name Input Block */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {[
                        { id: "firstName", label: "First Name *", value: firstName, setValue: setFirstName, req: true },
                        { id: "lastName", label: "Last Name", value: lastName, setValue: setLastName, req: false },
                      ].map((field) => (
                        <div className="w-full sm:w-1/2 flex flex-col" key={field.id}>
                          <label htmlFor={field.id} className="text-xs font-bold mb-1.5" style={{ color: "#544E45" }}>
                            {field.label.replace("*", "")} {field.req && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            id={field.id}
                            value={field.value}
                            onChange={(e) => field.setValue(formatToTitleCase(e.target.value))}
                            className="w-full p-3 text-sm rounded-xl border outline-none bg-stone-50 transition-all font-semibold"
                            style={{ borderColor: "#E5DCB9", color: "#43613D" }}
                            onFocus={(e) => { e.target.style.borderColor = "#43613D"; e.target.style.backgroundColor = "#FFF"; }}
                            onBlur={(e) => { e.target.style.borderColor = "#E5DCB9"; e.target.style.backgroundColor = "rgba(245,245,240,0.5)"; }}
                            required={field.req}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Structured Address Array Group with Auto-Capitalization */}
                    {[
                      { label: "Address Line 1 *", value: address1, setValue: setAddress1, req: true },
                      { label: "Address Line 2", value: address2, setValue: setAddress2, req: false },
                      { label: "Address Line 3", value: address3, setValue: setAddress3, req: false },
                    ].map((field, idx) => (
                      <div className="flex flex-col" key={idx}>
                        <label className="text-xs font-bold mb-1.5" style={{ color: "#544E45" }}>
                          {field.label.replace("*", "")} {field.req && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => field.setValue(formatToTitleCase(e.target.value))}
                          className="w-full p-3 text-sm rounded-xl border outline-none bg-stone-50 transition-all font-semibold"
                          style={{ borderColor: "#E5DCB9", color: "#43613D" }}
                          onFocus={(e) => { e.target.style.borderColor = "#43613D"; e.target.style.backgroundColor = "#FFF"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#E5DCB9"; e.target.style.backgroundColor = "rgba(245,245,240,0.5)"; }}
                          required={field.req}
                        />
                      </div>
                    ))}

                    {/* Contact Parameters Input Blocks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: "phone", label: "Phone Number *", type: "text", value: phone, setValue: setPhone },
                        { id: "email", label: "Email Node *", type: "email", value: email, setValue: setEmail },
                      ].map((field) => (
                        <div className="flex flex-col" key={field.id}>
                          <label className="text-xs font-bold mb-1.5" style={{ color: "#544E45" }}>
                            {field.label.replace("*", "")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => field.id === "phone" ? field.setValue(formatPhone(e.target.value)) : field.setValue(e.target.value)}
                            className="w-full p-3 text-sm rounded-xl border outline-none bg-stone-50 transition-all font-semibold"
                            style={{ borderColor: "#E5DCB9", color: "#43613D" }}
                            onFocus={(e) => { e.target.style.borderColor = "#43613D"; e.target.style.backgroundColor = "#FFF"; }}
                            onBlur={(e) => { e.target.style.borderColor = "#E5DCB9"; e.target.style.backgroundColor = "rgba(245,245,240,0.5)"; }}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    {/* Identification Matrix Field */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold mb-1.5" style={{ color: "#544E45" }}>
                        Identity / Passport Verification Code *
                      </label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(formatNRIC(e.target.value))}
                        className="w-full p-3 text-sm rounded-xl border outline-none bg-stone-50 transition-all font-semibold"
                        style={{ borderColor: "#E5DCB9", color: "#43613D" }}
                        onFocus={(e) => { e.target.style.borderColor = "#43613D"; e.target.style.backgroundColor = "#FFF"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#E5DCB9"; e.target.style.backgroundColor = "rgba(245,245,240,0.5)"; }}
                        required
                      />
                    </div>

                    {/* Schedule Window Metrics */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold mb-1.5" style={{ color: "#544E45" }}>
                        Operational Schedule Dates *
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="date"
                          className="w-1/2 p-3 text-sm rounded-xl border outline-none bg-stone-50 transition-all font-semibold"
                          style={{ borderColor: "#E5DCB9", color: "#43613D" }}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                        <input
                          type="date"
                          className="w-1/2 p-3 text-sm rounded-xl border outline-none bg-stone-50 transition-all font-semibold"
                          style={{ borderColor: "#E5DCB9", color: "#43613D" }}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    </div>

                    {/* Target Location Allocation Point with Auto-Capitalization */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold mb-1.5" style={{ color: "#544E45" }}>
                        Campsite Placement Target Destination *
                      </label>
                      <input
                        type="text"
                        value={campLocation}
                        onChange={(e) => setCampLocation(formatToTitleCase(e.target.value))}
                        className="w-full p-3 text-sm rounded-xl border outline-none bg-stone-50 transition-all font-semibold"
                        style={{ borderColor: "#E5DCB9", color: "#43613D" }}
                        onFocus={(e) => { e.target.style.borderColor = "#43613D"; e.target.style.backgroundColor = "#FFF"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#E5DCB9"; e.target.style.backgroundColor = "rgba(245,245,240,0.5)"; }}
                        required
                      />
                    </div>
                  </>
                );
              })()}

              {/* Modal Actions Footer Group */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t" style={{ borderColor: "#E5DCB9" }}>
                {canChooseAddOns && (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="w-full sm:flex-1 text-white py-3 px-4 rounded-xl font-bold transition-all text-xs uppercase tracking-wider shadow-sm"
                    style={{ backgroundColor: "#B39658" }}
                  >
                    ⚙️ Configure Add-ons
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedData({ firstName, lastName, phone, email, idNumber, startDate, endDate, campLocation, address1, address2, address3 });
                    setOpenBookingForm(false);
                  }}
                  className="w-full sm:flex-1 text-white py-3 px-4 rounded-xl font-bold transition-all tracking-wider text-xs uppercase shadow-sm"
                  style={{ backgroundColor: "#0b99ffff" }}
                >
                  Skip to Summary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auxiliary Modals Subtrees */}
      {canChooseAddOns && showModal && (
        <AddOnModal
          selected={selectedAddOns}
          onClose={() => { setShowModal(false); setOpenBookingForm(false); }}
          onSave={(data) => {
            setSelectedAddOns(data);
            setSubmittedData({ firstName, lastName, phone, email, idNumber, startDate, endDate, campLocation, address1, address2, address3 });
            setShowModal(false); setOpenBookingForm(false);
          }}
        />
      )}

      {showTerms && (
        <TermsModal
          onClose={() => setShowTerms(false)}
          existingSignature={savedSignature} // Fixes Issue 2 (Sends old sign in)
          setMainAgreed={setAgreed}          // Fixes Issue 1 (Sends tick out)
          onAgree={(signatureImage) => {
            setSavedSignature(signatureImage); // Fixes Issue 2 (Saves latest sign)
            setShowTerms(false);               // Closes modal window
          }}
        />
      )}

      {/* Premium Toast Pipeline Alerts Framework */}
      {successNotification && (
        <div
          className="fixed bottom-6 right-6 text-white border p-5 rounded-2xl shadow-2xl z-50 flex flex-col gap-3.5 max-w-xs sm:max-w-sm animate-slideIn border-l-4"
          style={{ backgroundColor: "#43613D", borderColor: "#32492D" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#B39658" }}>System Log Saved</p>
          <p className="text-xs font-medium leading-relaxed text-stone-100">{successNotification.message}</p>
          {successNotification.paymentUrl && (
            <button
              onClick={() => (window.location.href = successNotification.paymentUrl)}
              className="bg-white text-stone-900 text-center py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition-all shadow-md"
            >
              Do Payment
            </button>
          )}
          <button
            onClick={() => setSuccessNotification(null)}
            className="text-stone-200 hover:text-white text-xs text-left underline font-semibold transition-colors mt-1"
          >
            Acknowledge Update
          </button>
        </div>
      )}

      {/* Real Custom Processing Notification Popup Overlay */}
{/* Custom Blocking Notification Popup Overlay */}
{showProcessingPopup && (
  <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs flex justify-center items-center z-50 p-4 animate-fadeIn">
    <div 
      className="w-full max-w-xs rounded-2xl shadow-xl border p-5 text-center relative animate-scaleUp"
      style={{ backgroundColor: "#FDFBF7", borderColor: "#E5DCB9" }}
    >
      {/* Top Right Quick Close 'X' Button */}
      <button
        type="button"
        onClick={() => {
          setShowProcessingPopup(false);
          if (popupResolver) popupResolver(); // 👈 Tells code to proceed
        }}
        className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 text-sm font-bold transition-colors p-1"
      >
        ✕
      </button>

      {/* Status Icon */}
      <div 
        className="w-12 h-12 rounded-full flex justify-center items-center mx-auto mb-3 border text-xl"
        style={{ backgroundColor: "#EBE2CD", borderColor: "#D3C6A2" }}
      >
        🔍
      </div>

      {/* Notification Body Info */}
      <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
        Verify Summary Details
      </h4>
      <p className="text-xs text-stone-600 font-medium mt-1 mb-4 leading-relaxed">
        Ready to process layout metrics. Click dismiss to compile and capture the signature matrix wrapper.
      </p>

      {/* Bottom Dismiss Button - Triggers Next Lines of Code */}
      <button
        type="button"
        onClick={() => {
          setShowProcessingPopup(false);
          if (popupResolver) popupResolver(); // 👈 Tells code to proceed
        }}
        className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all shadow-md active:scale-95 bg-stone-950 hover:bg-stone-900 border border-stone-950"
        style={{ borderColor: "#FFD700" }} 
      >
        Dismiss & Proceed
      </button>
    </div>
  </div>
)}
    </>
  );
}