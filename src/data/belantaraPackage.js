import mainImage from "../assets/packageI-optimized.jpg";
import detail1 from "../assets/belantara_ads1-optimized.jpg";
import detail2 from "../assets/belantara_ads2-optimized.jpg";
import detail3 from "../assets/belantara_ads3-optimized.jpg";
import detail4 from "../assets/belantara_ads4-optimized.jpg";

const slideshowImages = [mainImage, detail1, detail2, detail3, detail4];

// Set the real database ID and enable checkout after the backend's RM100
// deposit rule is updated. Do not guess the ID or reuse another package's ID.
export const belantaraPackage = {
  packageId: null,
  checkoutReady: false,
  name: "Belantara",
  displayName: "Package Belantara",
  img: mainImage,
  images: slideshowImages,
  companyPhotos: [mainImage],
  currentPhotos: slideshowImages,
  price: "RM200",
  packagePrice: 200,
  depositAmount: 100,
  available: true,
  specs: [
    { label: "Brand", value: "PAYUNG.CAMP Village L+" },
    { label: "Size", value: "360 × 260 × 195 cm" },
    { label: "Weight", value: "19.7 kg" },
    { label: "Type", value: "2 Bedrooms" },
    { label: "Setup", value: "Automatic" },
  ],
  criteria: {
    brand: "PAYUNG.CAMP Village L+",
    size: "360 × 260 × 195 cm",
    weight: "19.7 kg",
    type: "2 Bedrooms",
    setup: "Automatic",
  },
};
