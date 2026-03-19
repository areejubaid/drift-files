import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";
import supabase from "../lib/supabase.js";

const router = express.Router();
const BUCKET = "files";

router.use(requireAuth);

// GET /api/files
router.get("/", async (req, res) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(req.user.id, { sortBy: { column: "created_at", order: "desc" } });

  if (error) return res.status(500).json({ error: error.message });

  const files = (data ?? []).map((file) => ({
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
      const storagePath = `${req.user.id}/${storedName}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          metadata: { originalName: file.originalname },
        });

      if (error) return res.status(500).json({ error: error.message });

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      results.push({ storedName, publicUrl: urlData.publicUrl });
    }

    res.json({ uploaded: results.length, files: results });
  });
});

// GET /api/files/download/:filename
router.get("/download/:filename", (req, res) => {
  const storagePath = `${req.user.id}/${req.params.filename}`;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  res.redirect(data.publicUrl);
});

// DELETE /api/files/:filename
router.delete("/:filename", async (req, res) => {
  const storagePath = `${req.user.id}/${req.params.filename}`;
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
