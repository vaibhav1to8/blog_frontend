import { resolveAuthorAvatar, resolvePostImage } from "../constants/media";
import { resolveMediaUrl } from "./mediaUrl";

export const getPostImage = (post) => resolveMediaUrl(resolvePostImage(post));

export const getPostCategory = (post) => post?.category || "Technology";

export const getPostAuthor = (post) => post?.authorName || "Anonymous";

export const getAuthorAvatar = (authorName) => resolveAuthorAvatar(authorName);

export const getExcerpt = (post) => {
  if (post?.excerpt) return post.excerpt;
  if (!post?.content) return "";
  return post.content.length > 120 ? `${post.content.slice(0, 120).trim()}...` : post.content;
};
