import { formatDate } from "../utils/formatDate";
import { getPostAuthor, getPostCategory, getPostImage, getAuthorAvatar } from "../utils/postImages";

function PostCard({ post, onSelect }) {
  const category = getPostCategory(post);
  const author = getPostAuthor(post);
  const image = getPostImage(post);

  const openPost = () => onSelect?.(post);

  return (
    <article className="post-card">
      <button type="button" className="post-card-image-wrap" onClick={openPost}>
        <img src={image} alt={post.title} className="post-card-image" />
      </button>

      <div className="post-card-content">
        <span className="post-category">{category}</span>

        <button type="button" className="post-card-title" onClick={openPost}>
          {post.title}
        </button>

        <div className="post-card-meta">
          <img src={getAuthorAvatar(author)} alt={author} className="author-avatar" />
          <span>{author}</span>
          <span className="meta-dot">•</span>
          <span>{formatDate(post.publishDate || post.updatedAt || post.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
