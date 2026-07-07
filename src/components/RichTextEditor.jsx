import { useEffect, useRef } from "react";
import { getPlainTextFromHtml } from "../utils/htmlContent";

function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const editor = editorRef.current;
    if (!editor || editor.innerHTML === value) return;
    editor.innerHTML = value || "";
  }, [value]);

  const syncContent = () => {
    const editor = editorRef.current;
    if (!editor) return;
    isInternalChange.current = true;
    onChange(editor.innerHTML);
  };

  const runCommand = (command, commandValue = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncContent();
  };

  const handleBold = () => runCommand("bold");
  const handleItalic = () => runCommand("italic");

  const handleLink = () => {
    const url = window.prompt("Enter link URL", "http://localhost:3000");
    if (!url) return;
    runCommand("createLink", url);
  };

  const handleInput = () => {
    syncContent();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    syncContent();
  };

  const isEmpty = !getPlainTextFromHtml(value);

  return (
    <div className="editor-shell">
      <div className="editor-toolbar">
        <button type="button" className="editor-btn" onClick={handleBold} aria-label="Bold">
          <strong>B</strong>
        </button>
        <button type="button" className="editor-btn editor-btn-italic" onClick={handleItalic} aria-label="Italic">
          <em>I</em>
        </button>
        <button type="button" className="editor-btn" onClick={handleLink} aria-label="Insert link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M10 14a4 4 0 0 1 0-5.66l1.41-1.41a4 4 0 0 1 5.66 5.66l-1.06 1.06"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M14 10a4 4 0 0 1 0 5.66l-1.41 1.41a4 4 0 0 1-5.66-5.66l1.06-1.06"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="editor-rich-wrap">
        {isEmpty && <div className="editor-placeholder">{placeholder}</div>}
        <div
          ref={editorRef}
          className="editor-rich"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          role="textbox"
          aria-multiline="true"
          aria-label="Post content"
        />
      </div>

      <p className="editor-theme-note">The content will be styled according to the MTP blog theme.</p>
    </div>
  );
}

export default RichTextEditor;
