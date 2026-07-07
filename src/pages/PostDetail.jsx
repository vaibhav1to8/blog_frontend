import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GET_POST } from "../graphql/queries";
import { formatDate } from "../utils/formatDate";
import { getPostAuthor, getPostCategory, getPostImage, getAuthorAvatar } from "../utils/postImages";
import { renderInlineMarkdown, renderPostContent } from "../utils/renderPostContent";

function PostDetail() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_POST, { variables: { id } });

  const post = data?.post;
  const category = getPostCategory(post);
  const author = getPostAuthor(post);
  const image = getPostImage(post);

  return (
    <div className="page">
      <Header />

      <main className="container page-content detail-page">
        {loading && <div className="state-box">Loading post...</div>}
        {error && <div className="state-box state-error">Failed to load post.</div>}

        {!loading && !error && post && (
          <>
            <div className="detail-header">
              <span className="detail-badge">{category}</span>
              <h1>{post.title}</h1>
              <div className="detail-meta">
                <img
                  src={getAuthorAvatar(author)}
                  alt={author}
                  className="author-avatar"
                />
                <span>{author}</span>
                <span className="meta-dot">•</span>
                <span>{formatDate(post.publishDate || post.updatedAt || post.createdAt)}</span>
              </div>
            </div>

            <img src={image} alt={post.title} className="detail-hero-image" />

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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default PostDetail;
