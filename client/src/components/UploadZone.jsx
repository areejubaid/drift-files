import { useRef, useState } from "react";
import { uploadFiles } from "../api/filesApi.js";
import "./UploadZone.css";

export default function UploadZone({ uploading, setUploading, onUploadComplete, setError }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  async function handleUpload(fileList) {
    if (!fileList?.length) return;
    setUploading(true);
    setError(null);
    try {
      await uploadFiles(fileList);
      await onUploadComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  }

  return (
    <div
      className={`upload-zone ${isDragging ? "upload-zone--dragging" : ""} ${uploading ? "upload-zone--uploading" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="upload-zone__icon">☁️</div>
      <p className="upload-zone__label">
        {uploading ? "Uploading..." : "Drag & drop files here"}
      </p>
      <p className="upload-zone__sub">or</p>
      <button
        className="upload-zone__btn"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        Choose Files
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e.target.files)}
      />
    </div>
  );
}
