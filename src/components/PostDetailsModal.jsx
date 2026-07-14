import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { formatDate } from "../utils/formatDate";
import { getPostAuthor, getPostCategory, getPostImage, getAuthorAvatar } from "../utils/postImages";
import { renderInlineMarkdown, renderPostContent } from "../utils/renderPostContent";
import { INCREMENT_POST_VIEW } from "../graphql/queries";

function formatViewCount(count) {
  const value = Number(count) || 0;
  return value === 1 ? "1 view" : `${value} views`;
}

function PostDetailsModal({ post, onClose }) {
  const [viewCount, setViewCount] = useState(post?.viewCount ?? 0);
  const [incrementPostView] = useMutation(INCREMENT_POST_VIEW);

  useEffect(() => {
    if (!post) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [post, onClose]);

  useEffect(() => {
    if (!post?.id) return undefined;

    setViewCount(post.viewCount ?? 0);

    let cancelled = false;

    incrementPostView({ variables: { id: post.id } })
      .then((result) => {
        const nextCount = result?.data?.incrementPostView?.viewCount;
        if (!cancelled && typeof nextCount === "number") {
          setViewCount(nextCount);
        }
      })
      .catch(() => {
        // Keep the last known count if the increment request fails.
      });

    return () => {
      cancelled = true;
    };
  }, [post?.id, incrementPostView]);

  if (!post) return null;

  const category = getPostCategory(post);
  const author = getPostAuthor(post);
  const image = getPostImage(post);
  const publishedOn = formatDate(post.publishDate || post.updatedAt || post.createdAt);

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <div
        className="post-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-modal-title"
      >
        <button type="button" className="post-modal-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="post-modal-hero">
          <img className="post-modal-image" src={image} alt={post.title} />
          <div className="post-modal-hero-shade" aria-hidden="true" />
          <span className="detail-badge post-modal-badge">{category}</span>
        </div>

        <div className="post-modal-body">
          <header className="detail-header post-modal-header">
            <h2 id="post-modal-title">{post.title}</h2>
            <div className="detail-meta post-modal-meta">
              <img src={getAuthorAvatar(author)} alt="" className="author-avatar" />
              <div className="post-modal-meta-text">
                <span className="post-modal-author">{author}</span>
                <span className="post-modal-date">{publishedOn}</span>
              </div>
              <span className="post-modal-views" title="Total views">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {formatViewCount(viewCount)}
              </span>
            </div>
          </header>

          {post.excerpt && (
            <p className="detail-excerpt post-modal-excerpt">{renderInlineMarkdown(post.excerpt)}</p>
          )}

          <article className="detail-content post-modal-content">
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
    </div>
  );
}

export default PostDetailsModal;
