const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const TARGET_BYTES = 600 * 1024;
const MAX_UPLOAD_BYTES = 2097152;

export async function compressReviewPhoto(file) {
  if (!TYPES.has(file.type)) throw new Error("Please select JPEG, PNG, or WebP photos only.");
  if (file.size > 20 * 1024 * 1024) throw new Error(`“${file.name}” is too large. Please select a photo under 20 MB.`);
  const url = URL.createObjectURL(file);
  const image = new Image();
  const canvas = document.createElement("canvas");
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error(`“${file.name}” could not be read. Please choose a different photo.`));
      image.src = url;
    });
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 80000000) {
      throw new Error(`“${file.name}” has unsupported dimensions. Please choose a smaller photo.`);
    }
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    let width = Math.max(1, Math.round(image.naturalWidth * scale));
    let height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not process this photo. Please try another browser.");
    let blob;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      for (const quality of [0.88, 0.78, 0.68, 0.58]) {
        blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
        if (!blob) throw new Error(`“${file.name}” could not be compressed. Please choose a different photo.`);
        if (blob.size <= TARGET_BYTES) break;
      }
      if (blob.size <= TARGET_BYTES) break;
      width = Math.max(1, Math.round(width * 0.8));
      height = Math.max(1, Math.round(height * 0.8));
    }
    if (!blob.size || blob.size > MAX_UPLOAD_BYTES) {
      throw new Error(`“${file.name}” is still too large after compression. Please choose a smaller photo.`);
    }
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "review-photo"}.jpg`, { type: "image/jpeg", lastModified: file.lastModified });
  } finally {
    URL.revokeObjectURL(url);
    image.src = "";
    canvas.width = 0;
    canvas.height = 0;
  }
}
