import { useState, useEffect, useCallback } from "react";
import { fetchFiles } from "./api/filesApi.js";
import UploadZone from "./components/UploadZone.jsx";
import FileGrid from "./components/FileGrid.jsx";

export default function App() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const loadFiles = useCallback(async () => {
    try {
      const data = await fetchFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>FileShare</h1>
        <p>Upload, store, and download your files — simple and fast.</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <UploadZone
        uploading={uploading}
        setUploading={setUploading}
        onUploadComplete={loadFiles}
        setError={setError}
      />

      <FileGrid files={files} onDelete={loadFiles} setError={setError} />
    </div>
  );
}
