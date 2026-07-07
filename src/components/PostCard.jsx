import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { getPostAuthor, getPostCategory, getPostImage, getAuthorAvatar } from "../utils/postImages";

function PostCard({ post }) {
  const category = getPostCategory(post);
  const author = getPostAuthor(post);
  const image = getPostImage(post);

  return (
    <article className="post-card">
      <Link to={`/post/${post.id}`} className="post-card-image-wrap">
        <img src={image} alt={post.title} className="post-card-image" />
      </Link>

      <div className="post-card-content">
        <span className="post-category">{category}</span>

        <Link to={`/post/${post.id}`} className="post-card-title">
          {post.title}
        </Link>

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
