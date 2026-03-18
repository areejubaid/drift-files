import express from "express";
import fs from "fs/promises";
import path from "path";
import { upload } from "../middleware/upload.js";

const router = express.Router();
const UPLOADS_DIR = "./uploads";

async function getFilesWithMetadata() {
  let entries;
  try {
    entries = await fs.readdir(UPLOADS_DIR);
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    if (entry.endsWith(".json")) continue;

    const filePath = path.join(UPLOADS_DIR, entry);
    const sidecarPath = path.join(UPLOADS_DIR, entry.replace(/\.[^.]+$/, ".json"));

    try {
      const [stat, sidecar] = await Promise.all([
        fs.stat(filePath),
        fs.readFile(sidecarPath, "utf-8").then(JSON.parse).catch(() => ({})),
      ]);

      files.push({
        storedName: entry,
        originalName: sidecar.originalName || entry,
        mimetype: sidecar.mimetype || "application/octet-stream",
        size: stat.size,
        uploadedAt: stat.birthtime,
      });
    } catch {
      // skip files we can't read
    }
  }

  return files.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

// GET /api/files
router.get("/", async (_req, res) => {
  const files = await getFilesWithMetadata();
  res.json(files);
});

// POST /api/files/upload
router.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.files?.length) return res.status(400).json({ error: "No files received." });

    for (const file of req.files) {
      const sidecarPath = path.join(UPLOADS_DIR, file.filename.replace(/\.[^.]+$/, ".json"));
      await fs.writeFile(
        sidecarPath,
        JSON.stringify({ originalName: file.originalname, mimetype: file.mimetype })
      );
    }

    res.json({ uploaded: req.files.length });
  });
});

// GET /api/files/download/:filename
router.get("/download/:filename", async (req, res) => {
  const filePath = path.resolve(UPLOADS_DIR, req.params.filename);
  const sidecarPath = filePath.replace(/\.[^.]+$/, ".json");

  let originalName = req.params.filename;
  try {
    const sidecar = JSON.parse(await fs.readFile(sidecarPath, "utf-8"));
    originalName = sidecar.originalName || originalName;
  } catch { /* use stored name */ }

  res.download(filePath, originalName, (err) => {
    if (err && !res.headersSent) res.status(404).json({ error: "File not found." });
  });
});

// DELETE /api/files/:filename
router.delete("/:filename", async (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  const sidecarPath = filePath.replace(/\.[^.]+$/, ".json");

  try {
    await fs.unlink(filePath);
    await fs.unlink(sidecarPath).catch(() => {});
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: "File not found." });
  }
});

export default router;
