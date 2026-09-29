const LOAD_ERROR = "Unable to load customer reviews. Please try again.";

export function formatReviewDate(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    iso: date.toISOString(),
    label: date.toLocaleDateString("en-MY", {
      day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kuala_Lumpur",
    }),
  };
}

function photoUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export async function loadCustomerReviews(baseUrl, signal) {
  const response = await fetch(`${(baseUrl || "").replace(/\/$/, "")}/api/reviews`, { signal });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success !== true || !Array.isArray(result.reviews)) {
    throw new Error(LOAD_ERROR);
  }
  // Preserve the API's newest-first order; only display valid public ratings.
  return result.reviews
    .filter((review) => review && Number.isInteger(Number(review.rating)) && Number(review.rating) >= 3 && Number(review.rating) <= 5)
    .map((review) => ({
      id: review.id,
      rating: Number(review.rating),
      name: typeof review.name === "string" && review.name.trim() ? review.name.trim() : "Qashcamp camper",
      camp_place: typeof review.camp_place === "string" && review.camp_place.trim() ? review.camp_place.trim() : "Location not shared",
      package_name: typeof review.package_name === "string" && review.package_name.trim() ? review.package_name.trim() : null,
      feedback: typeof review.feedback === "string" && review.feedback.trim() ? review.feedback.trim() : "This camper left a star rating without a written review.",
      campingDate: formatReviewDate(review.camping_date),
      submittedDate: formatReviewDate(review.created_at),
      photos: (Array.isArray(review.photos) ? review.photos : [])
        .map((photo) => ({ id: photo?.id, url: photoUrl(photo?.photo_url) }))
        .filter((photo) => photo.url),
    }));
}
