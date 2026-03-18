import multer from "multer";

export const upload = multer({ storage: multer.memoryStorage() }).array("files", 20);
