import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import AddOnModal from "../components/AddOnModal";
import TermsModal from "../components/TermsModal";

import packageAImg from "../assets/packageA.jpg";
import packageBImg from "../assets/packageB.jpg";
import packageCImg from "../assets/packageC.jpg";
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

export default function Booking() {
  const location = useLocation();

  const packageThumbnails = {
    A: [packageA1, packageA2, packageA3, packageA4],
    B: [packageB1, packageB2, packageB3, packageB4],
    C: [packageC1, packageC2, packageC3, packageC4],
  };

  const selectedPackage = location.state?.packageName; // "A" | "B" | "C"
  const thumbnails = packageThumbnails[selectedPackage] || [];
  const packageImg =
    selectedPackage === "A"
      ? packageAImg
      : selectedPackage === "B"
      ? packageBImg
      : selectedPackage === "C"
      ? packageCImg
      : null;

  const [showModal, setShowModal] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Define package prices per day
  const packagePrices = {
    A: { 2: 80, 3: 110, 4: 140 }, // etc.
    B: { 2: 110, 3: 150, 4: 180 },
    C: { 2: 150, 3: 200, 4: 220 },
  };
  // Calculate number of days safely
  let numDays = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    numDays = diffDays > 0 ? diffDays : 0;
  }

  // Get price for selected package and days
  let pricePerDay = null;
  if (numDays > 0 && packagePrices[selectedPackage]?.[numDays]) {
    pricePerDay = packagePrices[selectedPackage][numDays];
  }

  // Total price including add-ons
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = pricePerDay !== null ? pricePerDay + addOnsTotal : 0;
  const totalPricePerDay = pricePerDay !== null ? pricePerDay : 0;

  // get package price based on number of days
  const packagePrice = packagePrices[selectedPackage]?.[numDays] || 0;

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);

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
    A: 1,
    B: 2,
    C: 3,
  };

  // Add this at the top of your file, after imports
  const tentPackages = {
    A: {
      name: "BLACKDOG",
      criteria: {
        type: "Auto Tent",
        sizeOfPeople: "3-4",
        color: "Black",
        desc: "Tent size: 240cm x 240cm, Height: 160cm",
      },
    },
    B: {
      name: "VIDALIDO POON SAAN M",
      criteria: {
        type: "Manual Tent",
        sizeOfPeople: "4-6",
        color: "Khakis",
        desc: "Tent size: 210cm x 320cm, Height: 180cm",
      },
    },
    C: {
      name: "MOBIGARDEN 10.9 HOLIDAY",
      criteria: {
        type: "Auto Tent",
        sizeOfPeople: "6-8",
        color: "Black",
        desc: "Tent size: 450cm x 608cm x 195cm",
      },
    },
  };

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
          {selectedPackage && (
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
          {selectedPackage && (
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
                        onChange={(e) => field.setValue(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-black"
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
                        onChange={(e) => field.setValue(e.target.value)}
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
                    onChange={(e) => setIdNumber(e.target.value)}
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
                    className="w-full p-4 rounded-xl border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white text-black"
                    required
                  />
                </div>

                {/* Add-On Actions */}
                <div className="flex gap-3 mt-4">
                  {/* Choose Add-On */}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-semibold transition transform hover:scale-105"
                  >
                    Choose Add-On
                  </button>

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
                {selectedAddOns.length > 0 && (
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
        <div className="bg-white shadow-lg rounded-xl p-4 w-full md:w-[500px]">
          <h2 className="text-lg font-semibold mb-2">🛒 Booking Summary</h2>
          <p
            className={`font-medium ${
              pricePerDay === null ? "text-red-600" : "text-gray-800"
            }`}
          >
            Package Price:{" "}
            {pricePerDay !== null
              ? `RM${totalPricePerDay} (${numDays} ${
                  numDays === 1 ? "day" : "days"
                })`
              : "Please select a valid date range"}
          </p>

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
              <p className="font-medium mb-1">Customer Details:</p>

              <p>
                <span className="font-semibold">Name:</span>{" "}
                {submittedData.firstName} {submittedData.lastName}
              </p>

              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {submittedData.phone}
              </p>

              <p>
                <span className="font-semibold">Email:</span>{" "}
                {submittedData.email}
              </p>

              <p>
                <span className="font-semibold">ID Number:</span>{" "}
                {submittedData.idNumber}
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

          <div className="mt-4 border-t pt-2 font-semibold">
            Total: RM{totalPrice}
          </div>

          {/* Terms & Submit Row */}
          <div className="flex items-center justify-between mt-2">
            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                id="agree"
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
                type="button"
                onClick={() => setOpenBookingForm(true)}
                className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition"
              >
                Edit
              </button>

              {/* Submit Button */}
              {/* Submit Button */}
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault(); // stop form reload

                  // 1️⃣ Validate mandatory fields
                  if (!firstName || !phone || !email || !idNumber) {
                    alert("Please fill all mandatory fields (*)");
                    return;
                  }
                  if (totalPrice === 0) {
                    alert("Please select a valid date range");
                    return;
                  }

                  // 2️⃣ Build the payload for API
                  const payload = {
                    firstName,
                    lastName,
                    noId: idNumber,
                    address1,
                    address2,
                    address3,
                    startDate,
                    endDate,
                    packageId: packageIdMapping[selectedPackage],
                    addOnIds: selectedAddOns.map((a) => a.id),
                    phoneNo: phone,
                    emailAddr: email,
                    campPlace: campLocation,
                    total: totalPrice,
                  };

                  // 3️⃣ Check what will be submitted
                  console.log("Payload to submit:", payload);

                  // 4️⃣ Save summary for display
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

                  // 5️⃣ Later you can send the payload to API
                  // axios.post("/api/booking", payload)
                }}
                className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition w-2/3 ${
                  totalPrice === 0 || !agreed
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={totalPrice === 0 || !agreed}
              >
                Submit Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add-On Modal */}
      {showModal && (
        <AddOnModal
          selected={selectedAddOns}
          onClose={() => {
            setShowModal(false);
            setOpenBookingForm(false); // close booking modal too
          }}
          onSave={(data) => {
            setSelectedAddOns(data); // save add-ons
            setShowModal(false); // close add-on modal
            setOpenBookingForm(false); // close booking modal
          }}
        />
      )}

      {/* Terms & Conditions Modal */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  );
}
