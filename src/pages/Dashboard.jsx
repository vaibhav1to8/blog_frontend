import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
import PostDetailsModal from "../components/PostDetailsModal";
import { GET_POSTS, SEARCH_POSTS, GET_POSTS_COUNT } from "../graphql/queries";
import { formatDate } from "../utils/formatDate";
import { getPostAuthor, getPostCategory, getPostImage, getAuthorAvatar } from "../utils/postImages";
import { useState } from "react";

function Dashboard() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() || "";
  const isSearching = searchQuery.length > 0;
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_POSTS, {
    skip: isSearching,
  });

  const { data: postCountData, loading: postCountLoading, error: postCountError } = useQuery(GET_POSTS_COUNT);
  const postCount = postCountData?.postCount ?? 0;

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useQuery(SEARCH_POSTS, {
    variables: { query: searchQuery },
    skip: !isSearching,
  });

  const loading = isSearching ? searchLoading : postsLoading;
  const error = isSearching ? searchError : postsError;
  const posts = isSearching ? searchData?.searchPosts ?? [] : postsData?.posts ?? [];
  const featuredPost = isSearching ? null : posts[0];
  const latestPosts = isSearching ? posts : posts.slice(1);
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="page">
      <Header />

      <main className="container page-content">
        {loading && <div className="state-box">Loading posts...</div>}
        {error && <div className="state-box state-error">Failed to load posts.</div>}

        {postCountLoading && <div className="state-box">Loading post count...</div>}
        {postCountError && <div className="state-box state-error">Failed to load post count.</div>}
        {!postCountLoading && !postCountError && (
          <span className="count-btn mb-3 text-end">
            <span>{postCount} {postCount === 1 ? "post" : "posts"} found</span>
          </span>
        )}

        {!loading && !error && featuredPost && (
          <section className="featured-section">
            <div className="featured-hero">
              <div className="featured-image-wrap">
                <img src={getPostImage(featuredPost)} alt={featuredPost.title} className="featured-image" />
              </div>

              <div className="featured-overlay-card">
                <span className="featured-badge">{getPostCategory(featuredPost)}</span>

                <button style={{ border: "none", textAlign: "center" }} onClick={() => setSelectedPost(featuredPost)}>
                  {featuredPost.title}
                </button>

                <div className="featured-meta">
                  <img
                    src={getAuthorAvatar(getPostAuthor(featuredPost))}
                    alt={getPostAuthor(featuredPost)}
                    className="author-avatar"
                  />
                  <span>{getPostAuthor(featuredPost)}</span>
                  <span className="meta-dot">•</span>
                  <span>{formatDate(featuredPost.publishDate || featuredPost.updatedAt || featuredPost.createdAt)}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="latest-section">
          <h2 className="section-title">
            {isSearching ? `Search Results for "${searchQuery}"` : "Latest Post"}
          </h2>

          {!loading && !error && posts.length === 0 && (
            <div className="state-box">
              {isSearching
                ? `No posts found for "${searchQuery}".`
                : "No posts yet. Create your first blog post."}
            </div>
          )}

          <div className="posts-grid">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} onSelect={setSelectedPost} />
            ))}
          </div>

          {!isSearching && latestPosts.length > 0 && (
            <div className="view-all-wrap" />
          )}
        </section>
      </main>

      <Footer />

      <PostDetailsModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}

export default Dashboard;
