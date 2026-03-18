import FileCard from "./FileCard.jsx";
import "./FileGrid.css";

export default function FileGrid({ files, onDelete, setError }) {
  if (files.length === 0) {
    return (
      <div className="file-grid__empty">
        <span>🗂️</span>
        <p>No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="file-grid">
      {files.map((file) => (
        <FileCard key={file.storedName} file={file} onDelete={onDelete} setError={setError} />
      ))}
    </div>
  );
}
