export function isHtmlContent(content) {
  return /<[a-z][\s\S]*>/i.test(content);
}

export function getPlainTextFromHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.replace(/\u00a0/g, " ").trim() || "";
}

export function normalizeEditorHtml(html) {
  const plain = getPlainTextFromHtml(html);
  if (!plain) return "";
  return html.trim();
}
