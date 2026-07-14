import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RichTextEditor from "../components/RichTextEditor";
import { ADD_POST, GET_DRAFTS, GET_POST, GET_POSTS, GET_POSTS_COUNT, UPDATE_POST } from "../graphql/queries";
import { getPlainTextFromHtml, normalizeEditorHtml } from "../utils/htmlContent";
import { resolveMediaUrl, resolveUploadFallbackUrl, validateImageFile } from "../utils/mediaUrl";

const categories = ["Technology", "Economy", "Sociology", "Business", "Travel", "Lifestyle"];
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const CONTENT_PLACEHOLDER = `Write your blog content here...

Use the toolbar for bold, italic, and links.`;

function CreatePost() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditing = Boolean(editId);

  const fileInputRef = useRef(null);
  const tagInputRef = useRef(null);
  const localPreviewRef = useRef("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    authorName: "",
    category: "Technology",
    featuredImage: "",
    publishDate: "",
    visibility: "public",
    tags: [],
    tagInput: "",
  });
  const [notice, setNotice] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingAction, setSavingAction] = useState(null);
  const [previewImageSrc, setPreviewImageSrc] = useState("");

  const { data: editData, loading: editLoading } = useQuery(GET_POST, {
    variables: { id: editId },
    skip: !isEditing,
  });

  const { data: draftsData } = useQuery(GET_DRAFTS, {
    skip: isEditing,
  });

  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }, { query: GET_DRAFTS }, {query: GET_POSTS_COUNT}],
  });

  const [updatePost] = useMutation(UPDATE_POST, {
    refetchQueries: [{ query: GET_POSTS }, { query: GET_DRAFTS }],
  });

  useEffect(() => {
    if (!editData?.post) return;

    const post = editData.post;
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      authorName: post.authorName || "",
      category: post.category || "Technology",
      featuredImage: post.featuredImage || "",
      publishDate: post.publishDate ? post.publishDate.slice(0, 10) : "",
      visibility: post.visibility || "public",
      tags: post.tags || [],
      tagInput: "",
    });
    setPreviewImageSrc(post.featuredImage ? resolveMediaUrl(post.featuredImage) : "");
  }, [editData]);

  useEffect(() => {
    if (formData.featuredImage) {
      setPreviewImageSrc(resolveMediaUrl(formData.featuredImage));
    }
  }, [formData.featuredImage]);

  useEffect(
    () => () => {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
      }
    },
    []
  );

  const clearLocalPreview = () => {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current);
      localPreviewRef.current = "";
    }
  };

  const setLocalPreview = (file) => {
    clearLocalPreview();
    const objectUrl = URL.createObjectURL(file);
    localPreviewRef.current = objectUrl;
    setPreviewImageSrc(objectUrl);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onContentChange = (html) => {
    setFormData((prev) => ({ ...prev, content: html }));
  };

  const addTag = () => {
    const tag = formData.tagInput.trim();
    if (!tag) {
      tagInputRef.current?.focus();
      return;
    }

    const exists = formData.tags.some((item) => item.toLowerCase() === tag.toLowerCase());
    if (exists) {
      setFormData((prev) => ({ ...prev, tagInput: "" }));
      tagInputRef.current?.focus();
      return;
    }

    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: "" }));
    tagInputRef.current?.focus();
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setNotice({ type: "danger", message: validationError });
      event.target.value = "";
      return;
    }

    const previousImage = formData.featuredImage;
    const previousPreview = previousImage ? resolveMediaUrl(previousImage) : "";

    setLocalPreview(file);

    const payload = new FormData();
    payload.append("image", file);

    try {
      setUploadingImage(true);
      setNotice(null);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Image upload failed. Please try again.");
      }

      if (!result.url) {
        throw new Error("Upload succeeded but no image URL was returned.");
      }

      clearLocalPreview();
      setFormData((prev) => ({ ...prev, featuredImage: result.url }));
      setPreviewImageSrc(resolveMediaUrl(result.url));
      setNotice({ type: "success", message: "Image uploaded successfully." });
    } catch (error) {
      clearLocalPreview();
      setPreviewImageSrc(previousPreview);
      setNotice({
        type: "danger",
        message: error.message || "Image upload failed. Please try again.",
      });
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handlePreviewError = () => {
    const fallback = resolveUploadFallbackUrl(formData.featuredImage);
    if (fallback && previewImageSrc !== fallback) {
      setPreviewImageSrc(fallback);
    }
  };

  const buildInput = (status) => ({
    title: formData.title.trim(),
    slug: formData.slug.trim() || undefined,
    excerpt: formData.excerpt.trim(),
    content: normalizeEditorHtml(formData.content),
    authorName: formData.authorName.trim() || "Anonymous",
    category: formData.category,
    featuredImage: formData.featuredImage.trim(),
    tags: formData.tags,
    visibility: formData.visibility,
    status,
    publishDate: formData.publishDate || undefined,
  });

  const submitPost = async (status) => {
    if (!formData.title.trim()) {
      setNotice({ type: "danger", message: "Title is required." });
      return;
    }

    const plainContent = getPlainTextFromHtml(formData.content);
    if (status === "published" && !plainContent) {
      setNotice({ type: "danger", message: "Content is required to publish." });
      return;
    }

    try {
      setSavingAction(status);
      const input = buildInput(status);

      if (isEditing) {
        await updatePost({
          variables: { id: editId, input },
        });

        setNotice({
          type: "success",
          message: status === "draft" ? "Draft updated successfully." : "Post published successfully.",
        });

        if (status === "published") {
          navigate(`/post/${editId}`);
        }
        return;
      }

      const result = await addPost({ variables: { input } });
      const savedId = result.data.addPost.id;

      setNotice({
        type: "success",
        message: status === "draft" ? "Draft saved successfully." : "Post published successfully.",
      });

      if (status === "draft") {
        navigate(`/edit/${savedId}`, { replace: true });
        return;
      }

      navigate(`/post/${savedId}`);
    } catch {
      setNotice({ type: "danger", message: "Failed to save post." });
    } finally {
      setSavingAction(null);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await submitPost("published");
  };

  const isSaving = Boolean(savingAction);
  const drafts = draftsData?.drafts ?? [];

  return (
    <div className="page">
      <Header />

      <main className="create-page">
        <div className="container create-page-intro">
          {notice && <div className={`alert alert-${notice.type}`}>{notice.message}</div>}

          <div className="create-header">
            <div>
              <h1>{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h1>
              <p>
                {isEditing
                  ? "Update your draft or publish when you are ready."
                  : "Write and publish content for the blog."}
              </p>
            </div>
          </div>
        </div>

        {editLoading && isEditing && (
          <div className="container">
            <div className="state-box">Loading draft...</div>
          </div>
        )}

        {(!isEditing || editData?.post) && (
          <form onSubmit={onSubmit} className="create-layout">
            <div className="create-main">
              <div className="form-card">
                <label>Blog Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  placeholder="Enter your blog post title..."
                  required
                />
              </div>

              <div className="form-card">
                <label>Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={onChange}
                  placeholder="your-blog-post-url"
                />
              </div>

              <div className="form-card">
                <label>Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={onChange}
                  rows="3"
                  placeholder="Brief description of your blog post (shown in preview cards)"
                />
              </div>

              <div className="form-card content-editor-card">
                <label>Content *</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={onContentChange}
                  placeholder={CONTENT_PLACEHOLDER}
                />
              </div>
            </div>

            <aside className="create-sidebar">
              {!isEditing && drafts.length > 0 && (
                <div className="form-card drafts-card">
                  <label>Saved Drafts</label>
                  <ul className="drafts-list">
                    {drafts.map((draft) => (
                      <li key={draft.id}>
                        <Link to={`/edit/${draft.id}`}>{draft.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="form-card upload-card">
                <label>Featured Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="d-none"
                  onChange={handleImageUpload}
                />
                {formData.featuredImage || previewImageSrc ? (
                  <div className="upload-preview-wrap">
                    <img
                      src={previewImageSrc}
                      alt="Featured preview"
                      className="upload-preview"
                      onError={handlePreviewError}
                    />
                    <button
                      type="button"
                      className="upload-change-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? "Uploading..." : "Change Image"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="upload-box"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <div className="upload-icon">⬆</div>
                    <p>{uploadingImage ? "Uploading..." : "Upload Image"}</p>
                    <small>PNG, JPEG, Maximum File Size 5MB</small>
                  </button>
                )}
              </div>

              <div className="form-card">
                <label>Author Information</label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={onChange}
                  placeholder="Author Name *"
                />
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={onChange}
                  className="mt-3"
                />
              </div>

              <div className="form-card">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={onChange}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-card">
                <label>Visibility</label>
                <select name="visibility" value={formData.visibility} onChange={onChange}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="form-card">
                <label>Tags</label>
                <div className="tag-input-row">
                  <input
                    ref={tagInputRef}
                    type="text"
                    name="tagInput"
                    value={formData.tagInput}
                    onChange={onChange}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tag"
                  />
                  <button type="button" className="btn-add-tag" onClick={addTag}>
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button type="button" className="link-add-tag" onClick={addTag}>
                  + Add Tag
                </button>
              </div>

              <div className="publish-card">
                <button
                  type="submit"
                  className="btn-publish"
                  disabled={isSaving || uploadingImage}
                >
                  {savingAction === "published" ? "Publishing..." : "Publish Post"}
                </button>
                <button
                  type="button"
                  className="btn-draft"
                  disabled={isSaving || uploadingImage}
                  onClick={() => submitPost("draft")}
                >
                  {savingAction === "draft" ? "Saving..." : "Save Draft"}
                </button>
              </div>
            </aside>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CreatePost;
