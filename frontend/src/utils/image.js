// Cloudinary can resize and re-encode images on the fly through the URL.
// A card thumbnail is shown at ~100px, so downloading the full-size upload
// (often 1–3 MB) for it is wasted data — especially on mobile.
//
// f_auto  → serve WebP/AVIF when the browser supports it
// q_auto  → pick a sensible compression level
export const cloudinaryUrl = (url, transform) => {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", `/upload/f_auto,q_auto,${transform}/`);
};

// Square crop, 2x the display size for sharp retina screens
export const thumbUrl = (url, size = 200) =>
  cloudinaryUrl(url, `c_fill,g_auto,w_${size},h_${size}`);

export const coverUrl = (url, width = 960) =>
  cloudinaryUrl(url, `c_limit,w_${width}`);
