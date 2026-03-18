# File Sharing Project

## Project Overview
A file sharing web application that allows users to upload files, view them in a cloud drive-style interface, and retrieve/download them.

## Goals
- File upload (drag & drop + button)
- Drive/cloud storage view of all uploaded files
- File retrieval and download
- File metadata display (name, size, date, type)

## Status
- Project initialized, stack and features TBD pending user decisions on:
  - Storage backend (local disk vs. cloud: AWS S3, Cloudinary, Supabase)
  - Frontend approach (React vs. plain HTML/JS)
  - Authentication (user accounts vs. open shared drive)
  - Purpose (portfolio / personal use / learning)

## Decisions Log
- **Storage:** Local disk (multer + sidecar JSON for metadata)
- **Backend:** Node.js + Express (ESM), port 3001
- **Frontend:** React 18 + Vite, port 5173
- **Auth:** None — open shared drive
- **Purpose:** Portfolio project
- **Styling:** Plain CSS with pastel purple variables, no Tailwind or component libs
- **Filename strategy:** UUID-based stored filenames + `.json` sidecar preserves original names without a database

## Notes
- Run `npm install` in both `server/` and `client/` before starting
- Dev: `npm run dev` in both directories (two terminals)
- Vite proxies `/api/*` → `http://localhost:3001` so no CORS issues in dev
- Uploaded files live in `server/uploads/` (gitignored)
