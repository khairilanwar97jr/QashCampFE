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
import packageA1 from "../assets/packageA1.jpg";
import packageA2 from "../assets/packageA2.jpg";
import packageA3 from "../assets/packageA3.jpg";
import packageA4 from "../assets/packageA4.jpg";
import packageC1 from "../assets/packageC1.png";
import packageC2 from "../assets/packageC2.png";
import packageC3 from "../assets/packageC3.png";
import packageC4 from "../assets/packageC4.png";
import packageB1 from "../assets/packageB1.jpg";
import packageB2 from "../assets/packageB2.jpg";
import packageB3 from "../assets/packageB3.jpg";
import packageB4 from "../assets/packageB4.jpg";

import ZoomOnHover from "../components/ZoomOnHover"; // import the new component
const API_URL = import.meta.env.VITE_API_URL;


export default function Booking() {
  const location = useLocation();
  const bookingState = location.state?.booking;
  const { bookingRef } = useParams();
  const isExistingBooking = !!bookingRef;
  const [bookingData, setBookingData] = useState(null);


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
    Awan: [packageAwanImg, packageA1, packageA2, packageA3, packageA4],
    Purnama: [packagePurnamaImg, packageB1, packageB2, packageB3, packageB4],
    Senja: [packageSenjaImg, packageC1, packageC2, packageC3, packageC4],
    Lestari: [packageLestariImg, packageA1, packageA2, packageA3, packageA4],
    Embun: [packageEmbunImg, packageB1, packageB2, packageB3, packageB4],
    Aurora: [packageAuroraImg, packageC1, packageC2, packageC3, packageC4],
    Rimbayu: [packageRimbayuImg],
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
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
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

  // Add this at the top of your file, after imports
  const tentPackages = {
    Awan: {
      name: "Package Awan",
      criteria: {
        type: "Auto Tent",
        sizeOfPeople: "3-4",
        color: "Black",
        desc: "Tent size: 240cm x 240cm, Height: 160cm",
      },
    },
    Purnama: {
      name: "Package Purnama",
      criteria: {
        type: "Manual Tent",
        sizeOfPeople: "4-6",
        color: "Khakis",
        desc: "Tent size: 210cm x 320cm, Height: 180cm",
      },
    },
    Senja: {
      name: "Package Senja",
      criteria: {
        type: "Auto Tent",
        sizeOfPeople: "6-8",
        color: "Black",
        desc: "Tent size: 450cm x 608cm x 195cm",
      },
    },
    Lestari: {
      name: "Package Lestari",
      criteria: {
        type: "Auto Tent",
        sizeOfPeople: "3-4",
        color: "Black",
        desc: "Tent size: 240cm x 240cm, Height: 160cm",
      },
    },
    Embun: {
      name: "Package Embun",
      criteria: {
        type: "Manual Tent",
        sizeOfPeople: "4-6",
        color: "Khakis",
        desc: "Tent size: 210cm x 320cm, Height: 180cm",
      },
    },
    Aurora: {
      name: "Package Aurora",
      criteria: {
        type: "Auto Tent",
        sizeOfPeople: "6-8",
        color: "Black",
        desc: "Tent size: 450cm x 608cm x 195cm",
      },
    },
    Rimbayu: {
      name: "Package Rimbayu",
      criteria: {
        type: "Manual Tent",
        sizeOfPeople: "6-8",
        color: "Khakis",
        desc: "Tent size: 300cm x 300cm, Height: 180cm",
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

  const [finalSummary, setFinalSummary] = useState(null);

  return (
    <>
      <Navbar />
      {/* Full-width Header Section */}
      <div
        className="w-full backdrop-blur-md mt-24 py-12 mb-4 flex flex-col items-center 
         px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fdf6ee",
        }}
      >
        <h1
          className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-center"
          style={{
            fontFamily: "'Fredoka One', cursive",
            color: "#597E52",
          }}
        >
          Book Your Camping Package
        </h1>

        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl text-center px-2"
          style={{ color: "#4d8a2eff" }}
        >
          Please fill in your details below and get ready for an amazing
          adventure!
        </p>
      </div>

      <div
        className="min-h-screen text-gray-800 py-10 flex flex-col md:flex-row justify-center items-start gap-10 px-4"
        style={{ backgroundColor: "#C6A969" }}
      >
        {/* right: Package Image */}
        <div className="flex flex-col w-full md:w-auto bg-white p-4 rounded-3xl shadow-lg items-center">
          {/* Package Name */}
          {selectedPackage && tentPackages[selectedPackage] && (
            <h2
              className="text-2xl md:text-3xl font- mb-4 text-center"
              style={{
                fontFamily: "'Fredoka One', cursive",
                color: "#323631ff",
              }}
            >
              {tentPackages[selectedPackage].name}
            </h2>
          )}

          {/* right: Package Image */}
          <div className="flex flex-col w-full md:w-auto bg-white p-4 rounded-3xl shadow-lg items-center max-w-full overflow-hidden">
            {/* Main Package Image */}
            {packageImg && (
              <ZoomOnHover
                src={packageImg}
                className="w-full max-w-[300px] md:max-w-[500px] h-auto rounded-2xl"
              />
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {thumbnails.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Package ${idx + 1}`}
                className="w-24 h-24 md:w-28 md:h-28 rounded-xl shadow-md object-cover cursor-pointer transition transform hover:scale-105"
                onClick={() => setEnlargedImg(img)}
              />
            ))}
          </div>
          {/* Disclaimer */}
          {selectedPackage && tentPackages[selectedPackage] && (
            <div className="mt-2 w-full text-center text-xs text-gray-400 italic">
              *This picture is taken from the original product owner.
            </div>
          )}
          {/* Package Criteria */}
          {selectedPackage && (
            <div className="mt-6 w-full px-4 py-3 bg-gray-100 rounded-xl text-sm">
              <p>
                <strong>Type:</strong>{" "}
                {tentPackages[selectedPackage].criteria.type}
              </p>
              <p>
                <strong>Size:</strong>{" "}
                {tentPackages[selectedPackage].criteria.sizeOfPeople} people
              </p>
              <p>
                <strong>Color:</strong>{" "}
                {tentPackages[selectedPackage].criteria.color}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {tentPackages[selectedPackage].criteria.desc}
              </p>
            </div>
          )}

          {/* Enlarged Image Modal */}
          {enlargedImg && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
              onClick={() => setEnlargedImg(null)}
            >
              <img
                src={enlargedImg}
                alt="Enlarged Package"
                className="max-w-[90%] max-h-[90%] rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Book Now Button */}
          <button
            onClick={() => setOpenBookingForm(true)}
            className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-10 rounded-xl shadow-lg transition transform hover:scale-105"
          >
            Book Now
          </button>
        </div>

        {openBookingForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-2">
            {/* Modal Container */}
            <div
              className="rounded-2xl shadow-xl w-[92vw] sm:w-full sm:max-w-md lg:max-w-lg max-h-[90vh] flex flex-col relative mx-auto"
              style={{ backgroundColor: "#F7F1DE" }}
            >
              {/* Header with stacked buttons */}
              <div className="text-center p-3 sm:p-4 border-b relative">
                <h2 className="text-base sm:text-lg font-bold text-black">
                  Camping Registration
                </h2>
                <p className="text-xs sm:text-sm text-gray-700">
                  Fill this like a postcard ✉️
                </p>

                {/* Buttons stacked top-right */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setOpenBookingForm(false)}
                    className="text-gray-500 hover:text-black text-2xl"
                  >
                    ×
                  </button>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={() => {
                      // Reset all controlled state fields
                      setFirstName("");
                      setLastName("");
                      setAddress1("");
                      setAddress2("");
                      setAddress3("");
                      setPhone("");
                      setEmail("");
                      setIdNumber("");
                      setStartDate("");
                      setEndDate("");
                      setCampLocation("");
                      setSelectedAddOns([]);

                      // Hide the summary
                      setSubmittedData(null);
                    }}
                    className="absolute top-3 right-12 text-gray-500 hover:text-black text-sm px-2 py-1 border border-gray-300 rounded-md transition"
                    style={{ backgroundColor: "#ffffffff" }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Scrollable Form */}
              <form
                id="bookingForm"
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto px-3 py-2 gap-2 sm:px-4 sm:py-3 sm:gap-3"
              >
                {/* First & Last Name */}
                <div className="flex gap-4">
                  {[
                    {
                      id: "firstName",
                      label: "First Name *",
                      value: firstName,
                      setValue: setFirstName,
                    },
                    {
                      id: "lastName",
                      label: "Last Name",
                      value: lastName,
                      setValue: setLastName,
                    },
                  ].map((field) => (
                    <div className="relative w-1/2" key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="text-sm text-black mb-1 block"
                      >
                        {field.label.includes("*") ? (
                          <>
                            {field.label.replace("*", "")}
                            <span className="text-red-500">*</span>
                          </>
                        ) : (
                          field.label
                        )}
                      </label>
                      <input
                        type="text"
                        id={field.id}
                        value={field.value}
                        onChange={(e) =>
                          field.setValue(
                            e.target.value
                              .toLowerCase()
                              .split(" ")
                              .filter(Boolean)
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")
                          )
                        } className="w-full p-4 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-black"
                        required={field.id === "firstName"}
                      />
                    </div>
                  ))}
                </div>

                {[
                  {
                    label: "Address Line 1 *",
                    value: address1,
                    setValue: setAddress1,
                  },
                  {
                    label: "Address Line 2",
                    value: address2,
                    setValue: setAddress2,
                  },
                  {
                    label: "Address Line 3",
                    value: address3,
                    setValue: setAddress3,
                  },
                ].map((field, idx) => (
                  <div className="relative" key={idx}>
                    <label className="text-sm text-black mb-1 block">
                      {field.label.includes("*") ? (
                        <>
                          {field.label.replace("*", "")}
                          <span className="text-red-500">*</span>
                        </>
                      ) : (
                        field.label
                      )}
                    </label>
                    <input
                      type="text"
                      id={`address${idx}`}
                      value={field.value}
                      onChange={(e) => field.setValue(e.target.value)}
                      onBlur={(e) =>
                        field.setValue(
                          e.target.value
                            .toLowerCase()
                            .split(" ")
                            .filter(Boolean)
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")
                        )
                      }
                      className="w-full p-4 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-black"
                      required={field.label.includes("*")}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: "phone",
                      label: "Phone Number *",
                      type: "text",
                      value: phone,
                      setValue: setPhone,
                    },
                    {
                      id: "email",
                      label: "Email Address *",
                      type: "email",
                      value: email,
                      setValue: setEmail,
                    },
                  ].map((field) => (
                    <div className="relative" key={field.id}>
                      <label className="text-sm text-black mb-1 block">
                        {field.label.includes("*") ? (
                          <>
                            {field.label.replace("*", "")}
                            <span className="text-red-500">*</span>
                          </>
                        ) : (
                          field.label
                        )}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        value={field.value}
                        onChange={(e) => {
                          if (field.id === "phone") {
                            field.setValue(formatPhone(e.target.value));
                          } else {
                            field.setValue(e.target.value);
                          }
                        }}
                        className="w-full p-4 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-black"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <label className="text-sm text-black mb-1 block">
                    ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    value={idNumber}
                    onChange={(e) => setIdNumber(formatNRIC(e.target.value))}
                    className="w-full p-4 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-black"
                    required
                  />
                </div>

                {/* Camping Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-black mb-1 block">
                    Camping Date *
                  </label>
                  <div className="flex gap-4">
                    {["startDate", "endDate"].map((d, idx) => (
                      <input
                        key={d}
                        type="date"
                        className="w-1/2 p-4 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-black"
                        value={idx === 0 ? startDate : endDate}
                        onChange={(e) =>
                          idx === 0
                            ? setStartDate(e.target.value)
                            : setEndDate(e.target.value)
                        }
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    ))}
                  </div>
                </div>

                {/* Camp Location */}
                <div className="relative">
                  <label className="text-sm text-black mb-1 block">
                    Where to Camp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="campLocation"
                    value={campLocation}
                    onChange={(e) => setCampLocation(e.target.value)}
                    onBlur={(e) =>
                      setCampLocation(
                        e.target.value
                          .toLowerCase()
                          .split(" ")
                          .filter(Boolean)
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                      )
                    }
                    className="w-full p-4 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-black"
                    required
                  />
                </div>

                {/* Add-On Actions */}
                <div className="flex gap-3 mt-4">
                  {/* Choose Add-On */}
                  {canChooseAddOns && (
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-semibold transition transform hover:scale-105"
                    >
                      Choose Add-On
                    </button>
                  )}

                  {/* No Thank You */}
                  <button
                    type="button"
                    onClick={() => {
                      // Save the current form data
                      setSubmittedData({
                        firstName,
                        lastName,
                        phone,
                        email,
                        idNumber,
                        startDate,
                        endDate,
                        campLocation,
                        address1,
                        address2,
                        address3,
                      });

                      // Close the modal
                      setOpenBookingForm(false);
                    }}
                    className="flex-1 border border-gray-300 text-black py-3 px-4 rounded-xl font-semibold transition hover:bg-gray-100"
                    style={{ backgroundColor: "#0b99ffff" }}
                  >
                    No, just submit form
                  </button>
                </div>

                {/* Selected Add-Ons Summary */}
                {canChooseAddOns && selectedAddOns.length > 0 && (
                  <div className="bg-gray-100 p-4 rounded-xl text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-black">
                        Selected Add-Ons:
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="text-black hover:underline text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <ul className="list-disc pl-5 text-black">
                      {selectedAddOns.map((a) => (
                        <li key={a.id}>
                          {a.name} (RM{a.price})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Summary under the image */}
        <div
          className={`${summaryTheme.card} border-2 shadow-lg rounded-xl p-4 w-full md:w-[500px]`}
        >
          <h2 className="text-lg font-semibold mb-2">🛒 Booking Summary</h2>
          <div className="mb-3">
            <span
              className={`${summaryTheme.badge} rounded-full px-3 py-1 text-xs font-semibold`}
            >
              {summaryTheme.label}
            </span>
          </div>
          <p
            className={`font-medium ${packagePrice === 0 ? "text-red-600" : "text-gray-800"
              }`}
          >
            Package Price:{" "}
            {basePackagePrice > 0 ? `RM${basePackagePrice}` : "Please choose a package"}
          </p>
          {additionalNightCharge > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              Additional {additionalNights} {additionalNights === 1 ? "night" : "nights"} charge: RM{additionalNightCharge}
            </p>
          )}
          {!isExistingBooking && (
            <p className="mt-2 font-medium text-gray-800">
              Deposit: RM{depositAmount}
            </p>
          )}

          {/* Add-Ons */}
          {selectedAddOns.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium">Add-Ons:</p>
              <ul className="list-disc pl-5">
                {selectedAddOns.map((a) => (
                  <li key={a.id}>
                    {a.name} (RM{a.price})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-gray-500 text-sm">No add-ons selected</p>
          )}

          {submittedData && (
            <div className="mt-2 border-t pt-3 text-sm text-gray-800 space-y-1">
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="font-medium">Customer Details:</p>
                <button
                  type="button"
                  onClick={() => setOpenBookingForm(true)}
                  className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
                >
                  Edit
                </button>
              </div>

              <p>
                <span className="font-semibold">Name:</span>{" "}
                {submittedData.firstName} {submittedData.lastName}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {formatPhone(submittedData.phone)}
              </p>


              <p>
                <span className="font-semibold">Email:</span>{" "}
                {submittedData.email}
              </p>

              <p>
                <span className="font-semibold">ID Number:</span>{" "}
                {formatNRIC(submittedData.idNumber)}
              </p>

              <p>
                <span className="font-semibold">Camping Date:</span>{" "}
                {submittedData.startDate} → {submittedData.endDate}
              </p>

              <p>
                <span className="font-semibold">Camp Location:</span>{" "}
                {submittedData.campLocation}
              </p>

              <p>
                <span className="font-semibold">Address:</span>{" "}
                {[
                  submittedData.address1,
                  submittedData.address2,
                  submittedData.address3,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
          )}

          <div className={`mt-4 border-t pt-2 font-bold ${summaryTheme.total}`}>
            Total: RM{apiTotal}
          </div>

          {/* Terms & Submit Row */}
          <div className="flex items-center justify-between mt-2">
            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreed}
                readOnly
                className="w-4 h-4 accent-green-600"
                required
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I agree to the
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-blue-600 hover:underline ml-1"
                >
                  Terms & Conditions
                </button>
              </label>
            </div>

            {/* Edit & Submit Row */}
            <div className="flex gap-3">
              {/* Edit Button */}
              <button
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();


                  // Validate mandatory fields
                  if (!firstName || !phone || !email || !idNumber) {
                    alert("Please fill all mandatory fields (*)");
                    return;
                  }
                  if (!startDate || !endDate || numNights === 0) {
                    alert("Please select a valid date range");
                    return;
                  }
                  if (totalPrice === 0) {
                    alert("Please choose a package");
                    return;
                  }
                  setLoading(true);
                  const rawNRIC = idNumber.replace(/\D/g, "");
                  const rawPhone = phone.replace(/\D/g, "");
                  // Build payload
                  let payload;

                  if (isFinalPayment) {
                    payload = {
                      bookingId: bookingData?.id, // or wherever you store it
                      bookingRef: bookingRef,
                      addOnIds: selectedAddOns.map((a) => a.id),
                      extraNightCount: additionalNights,
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
                    };
                  }

                  try {
                    let endpoint = "";

                    if (isFinalPayment) {
                      endpoint = `${API_URL}/api/bookings/pay-final`;
                    } else if (isWalkIn) {
                      endpoint = `${API_URL}/api/bookings/book`;
                    } else {
                      endpoint = `${API_URL}/api/bookings/book`;
                    }

                    const res = await fetch(endpoint, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });

                    const data = await res.json();

                    if (res.ok) {
                      setLoading(false);
                      const bookingId =
                        data.bookingId || data.id || data.booking?.id;

                      const paymentUrl =
                        bookingId && data.paymentUrl
                          ? data.paymentUrl.replace(
                            "bookingId=undefined",
                            `bookingId=${bookingId}`
                          )
                          : data.paymentUrl;

                      // ✅ TAKE SNAPSHOT (locks summary so it won't change)
                      const snapshot = {
                        firstName,
                        lastName,
                        phone,
                        email,
                        idNumber,
                        startDate,
                        endDate,
                        campLocation,
                        address1,
                        address2,
                        address3,
                        addOns: [...selectedAddOns],
                      };

                      setSubmittedData(snapshot);

                      // ✅ Show success popup
                      setSuccessNotification({
                        message: "Booking submitted successfully!",
                        paymentUrl,
                      });

                      // ✅ Close modal ONLY (DO NOT reset data that affects summary)
                      setOpenBookingForm(false);

                      // ⚠️ Optional: if you still want UI clean, you can clear form inputs
                      setFirstName("");
                      setLastName("");
                      setPhone("");
                      setEmail("");
                      setIdNumber("");
                      setCampLocation("");
                      setAddress1("");
                      setAddress2("");
                      setAddress3("");

                      // ❌ IMPORTANT: DO NOT do this anymore here
                      // setSelectedAddOns([]);
                      // setSubmittedData(null);
                    } else {
                      setLoading(false);
                      alert(`Error: ${data.message || "Something went wrong"}`);
                    }
                  } catch (err) {
                    console.error("Booking submission error:", err);
                    alert(
                      "Failed to submit booking. Check console for details."
                    );
                  }
                }}
                disabled={totalPrice === 0 || !agreed || loading}
                className={`bg-green-600 hover:bg-green-700 text-white py-3 px-9 rounded-md transition flex-shrink-0 w-2/3 flex items-center justify-center min-h-[48px] text-base font-semibold ${totalPrice === 0 || !agreed || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                  }`}
              >
                {loading ? (
                  <span className="flex items-center gap-3 text-base font-semibold">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </span>
                ) : (
                  submitLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add-On Modal */}
      {canChooseAddOns && showModal && (
        <AddOnModal
          selected={selectedAddOns}
          onClose={() => {
            setShowModal(false);
            setOpenBookingForm(false);
          }}
          onSave={(data) => {
            // 1️⃣ Save add-ons
            setSelectedAddOns(data);

            // 2️⃣ SAVE FORM DATA SNAPSHOT 👇
            setSubmittedData({
              firstName,
              lastName,
              phone,
              email,
              idNumber,
              startDate,
              endDate,
              campLocation,
              address1,
              address2,
              address3,
            });

            // 3️⃣ Close everything
            setShowModal(false);
            setOpenBookingForm(false);
          }}
        />
      )}

      {showTerms && (
        <TermsModal
          onClose={() => setShowTerms(false)}
          onAgree={(signature) => {
            console.log("Signature:", signature);

            setAgreed(true);       // ✅ AUTO TICK CHECKBOX
            setShowTerms(false);   // close modal

            // optional: store signature
            // setSignature(signature);
          }}
        />
      )}

      {successNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex flex-col gap-2">
          <p>{successNotification.message}</p>
          {successNotification.paymentUrl && (
            <button
              onClick={() =>
                (window.location.href = successNotification.paymentUrl)
              }
              className="bg-white text-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Go to Payment
            </button>
          )}
          <button
            onClick={() => setSuccessNotification(null)}
            className="text-white underline text-sm mt-1"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
