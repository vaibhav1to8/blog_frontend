import { formatDate } from "../utils/formatDate";
import { getPostAuthor, getPostCategory, getPostImage, getAuthorAvatar } from "../utils/postImages";
import { renderInlineMarkdown, renderPostContent } from "../utils/renderPostContent";

function PostDetailsModal({ post, onClose }) {
  if (!post) return null;

  const category = getPostCategory(post);
  const author = getPostAuthor(post);
  const image = getPostImage(post);

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <div className="post-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="post-modal-close" onClick={onClose} aria-label="Close">
          Close
        </button>

        <div className="detail-header">
          <span className="detail-badge">{category}</span>
          <h2>{post.title}</h2>
          <div className="detail-meta">
            <img src={getAuthorAvatar(author)} alt={author} className="author-avatar" />
            <span>{author}</span>
            <span className="meta-dot">•</span>
            <span>{formatDate(post.publishDate || post.updatedAt || post.createdAt)}</span>
          </div>
        </div>

        <img className="post-modal-image" src={image} alt={post.title} />

        {post.excerpt && <p className="detail-excerpt">{renderInlineMarkdown(post.excerpt)}</p>}

        <article className="detail-content">
          {renderPostContent(post.content)}

          {post.tags?.length > 0 && (
            <div className="detail-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

export default PostDetailsModal;
