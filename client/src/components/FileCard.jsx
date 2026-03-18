import { useState } from "react";
import { downloadFile, deleteFile } from "../api/filesApi.js";
import "./FileCard.css";

function fileIcon(mimetype) {
  if (mimetype.startsWith("image/")) return "🖼️";
  if (mimetype === "application/pdf") return "📄";
  if (mimetype.startsWith("video/")) return "🎬";
  if (mimetype.startsWith("audio/")) return "🎵";
  if (mimetype.includes("zip") || mimetype.includes("compressed")) return "🗜️";
  if (mimetype.includes("spreadsheet") || mimetype.includes("excel")) return "📊";
  if (mimetype.includes("presentation") || mimetype.includes("powerpoint")) return "📊";
  if (mimetype.includes("word") || mimetype.includes("document")) return "📝";
  if (mimetype.startsWith("text/")) return "📃";
  return "📁";
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function FileCard({ file, onDelete, setError }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDownload() {
    try {
      await downloadFile(file.storedName, file.originalName);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteFile(file.storedName);
      await onDelete();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="file-card">
      <div className="file-card__icon">{fileIcon(file.mimetype)}</div>
      <p className="file-card__name" title={file.originalName}>
        {file.originalName}
      </p>
      <div className="file-card__meta">
        <span>{formatSize(file.size)}</span>
        <span>{formatDate(file.uploadedAt)}</span>
      </div>
      <div className="file-card__actions">
        <button className="file-card__btn file-card__btn--download" onClick={handleDownload}>
          Download
        </button>
        <button
          className="file-card__btn file-card__btn--delete"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
