const getApiBase = () => (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const BACKEND_UPLOADS_PREFIX = "/images/uploads/";

export const resolveMediaUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("blob:")) return value;
  if (/^https?:\/\//i.test(value)) return value;

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  if (normalizedPath.startsWith(BACKEND_UPLOADS_PREFIX)) {
    return `${getApiBase()}${normalizedPath}`;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}${normalizedPath}`;
  }

  return `${getApiBase()}${normalizedPath}`;
};

export const resolveUploadFallbackUrl = (value) => {
  if (!value || value.startsWith("blob:") || /^https?:\/\//i.test(value)) {
    return "";
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${getApiBase()}${normalizedPath}`;
};

export const validateImageFile = (file) => {
  if (!file) {
    return "Please choose an image file.";
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, or WEBP images are allowed.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be 5MB or smaller.";
  }

  return null;
};
