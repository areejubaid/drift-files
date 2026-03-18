import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { upload } from "../middleware/upload.js";
import supabase from "../lib/supabase.js";

const router = express.Router();
const BUCKET = "files";

// GET /api/files
router.get("/", async (_req, res) => {
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) return res.status(500).json({ error: error.message });

  const files = data.map((file) => ({
    storedName: file.name,
    originalName: file.metadata?.originalName || file.name,
    mimetype: file.metadata?.mimetype || "application/octet-stream",
    size: file.metadata?.size ?? 0,
    uploadedAt: file.created_at,
  }));

  res.json(files);
});

// POST /api/files/upload
router.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.files?.length) return res.status(400).json({ error: "No files received." });

    const results = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname);
      const storedName = `${uuidv4()}${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storedName, file.buffer, {
          contentType: file.mimetype,
          metadata: { originalName: file.originalname },
        });

      if (error) return res.status(500).json({ error: error.message });

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storedName);
      results.push({ storedName, publicUrl: urlData.publicUrl });
    }

    res.json({ uploaded: results.length, files: results });
  });
});

// GET /api/files/download/:filename
router.get("/download/:filename", (_req, res) => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(_req.params.filename);
  res.redirect(data.publicUrl);
});

// DELETE /api/files/:filename
router.delete("/:filename", async (req, res) => {
  const { error } = await supabase.storage.from(BUCKET).remove([req.params.filename]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
