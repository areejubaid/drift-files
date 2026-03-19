import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase.js";
import { fetchFiles } from "./api/filesApi.js";
import UploadZone from "./components/UploadZone.jsx";
import FileGrid from "./components/FileGrid.jsx";
import AuthPage from "./components/AuthPage.jsx";

export default function App() {
  const [session, setSession] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadFiles = useCallback(async () => {
    try {
      const data = await fetchFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    if (session) loadFiles();
    else setFiles([]);
  }, [session, loadFiles]);

  if (session === undefined) return null;
  if (!session) return <AuthPage />;

  return (
    <div className="app">
      <header className="app-header">
        <h1>FileShare</h1>
        <p>Upload, store, and download your files — simple and fast.</p>
        <button
          className="logout-btn"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
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
