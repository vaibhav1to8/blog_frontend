import { isHtmlContent } from "./htmlContent";

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g;

function normalizeHref(url) {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
    return trimmed;
  }
  return `http://${trimmed}`;
}

function renderLink(href, label, key) {
  return (
    <a key={key} href={normalizeHref(href)} className="detail-link">
      {label}
    </a>
  );
}

export function renderInlineMarkdown(text) {
  if (!text) return null;

  const parts = text.split(INLINE_PATTERN).filter((part) => part.length > 0);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`italic-${index}`}>{part.slice(1, -1)}</em>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return renderLink(linkMatch[2], linkMatch[1], `link-${index}`);
    }

    if (/^https?:\/\/[^\s]+$/i.test(part)) {
      return renderLink(part, part, `url-${index}`);
    }

    return part;
  });
}

export function renderPostContent(content) {
  if (!content?.trim()) return null;

  if (isHtmlContent(content)) {
    return <div className="detail-content-html" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  const lines = content.split("\n");
  const blocks = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return;
    }

    let lineContent = trimmed;
    if (lineContent.startsWith("- ")) {
      lineContent = lineContent.slice(2);
    }

    if (lineContent.startsWith("> ")) {
      blocks.push(
        <blockquote key={`quote-${index}`} className="detail-quote">
          {renderInlineMarkdown(lineContent.slice(2))}
        </blockquote>
      );
      return;
    }

    const imageMatch = lineContent.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      blocks.push(
        <img
          key={`image-${index}`}
          src={imageMatch[2]}
          alt={imageMatch[1]}
          className="detail-inline-image"
        />
      );
      return;
    }

    blocks.push(<p key={`paragraph-${index}`}>{renderInlineMarkdown(lineContent)}</p>);
  });

  return blocks;
}
