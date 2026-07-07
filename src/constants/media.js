export const postImages = {
  "impact-of-technology-on-workplace": "/images/posts/technology-workplace.jpg",
  "global-markets-react-economic-policies-2024": "/images/posts/global-markets.jpg",
  "urban-communities-redefining-social-connection": "/images/posts/urban-community.jpg",
  "strategies-scale-startup-competitive-market": "/images/posts/startup-scale.jpg",
  "hidden-gems-underrated-travel-destinations-2024": "/images/posts/travel-gems.jpg",
  "minimalist-living-design-habits-calmer-routine": "/images/posts/minimalist-living.jpg",
  "cybersecurity-essentials-small-business": "/images/posts/cybersecurity.jpg",
  "future-electric-vehicles-sustainable-transportation": "/images/posts/electric-vehicles.jpg",
  "mental-health-digital-age-finding-balance": "/images/posts/mental-health.jpg",
  "rise-of-creator-economy-platforms": "/images/posts/creator-economy.jpg",
};

export const authorAvatars = {
  "Jason Francisco": "/images/authors/jason-francisco.jpg",
  "Emily Johnson": "/images/authors/emily-johnson.jpg",
  "Tracey Wilson": "/images/authors/tracey-wilson.jpg",
  "Michael Chen": "/images/authors/michael-chen.jpg",
  "Sarah Williams": "/images/authors/sarah-williams.jpg",
};

export const defaultPostImage = "/images/posts/default-post.jpg";
export const defaultAuthorAvatar = "/images/authors/default-author.jpg";

export const isLocalMediaPath = (value) =>
  typeof value === "string" && value.startsWith("/images/");

export const resolvePostImage = (post) => {
  if (isLocalMediaPath(post?.featuredImage)) return post.featuredImage;
  if (post?.slug && postImages[post.slug]) return postImages[post.slug];
  return defaultPostImage;
};

export const resolveAuthorAvatar = (authorName) =>
  authorAvatars[authorName] || defaultAuthorAvatar;
