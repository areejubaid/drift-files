export async function fetchFiles() {
  const res = await fetch("/api/files");
  if (!res.ok) throw new Error("Failed to fetch files.");
  return res.json();
}

export async function uploadFiles(fileList) {
  const formData = new FormData();
  for (const file of fileList) formData.append("files", file);

  const res = await fetch("/api/files/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Upload failed.");
  }
  return res.json();
}

export async function downloadFile(storedName, originalName) {
  const res = await fetch(`/api/files/download/${storedName}`);
  if (!res.ok) throw new Error("Download failed.");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = originalName;
  a.click();
  URL.revokeObjectURL(url);
}

export async function deleteFile(storedName) {
  const res = await fetch(`/api/files/${storedName}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed.");
  return res.json();
}
