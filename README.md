# Drift Files

A personal cloud drive web app where users can upload, manage, and download their files. Each user has their own private storage — sign in to access your files from anywhere.

**Live demo:** [drift-files.vercel.app](https://drift-files.vercel.app)

## Features

- Upload files via drag & drop or file picker
- View all your files in a grid with name, size, type, and upload date
- Download and delete files
- Per-user private storage - files are scoped to your account
- Authentication via email/password, Google, or GitHub

## Tech Stack

**Frontend**
- React 18 + Vite
- Plain CSS with pastel purple design system
- Hosted on Vercel

**Backend**
- Node.js + Express (ESM)
- Supabase Storage for file storage
- Supabase Auth for user authentication

## Local Development

### Prerequisites
- Node.js 18+
- A Supabase project with a public `files` storage bucket

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/areejubaid/drift-files.git
   cd drift-files
   ```

2. Install dependencies
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Create `server/.env`
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Create `client/.env`
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:3001
   ```

5. Start the dev servers (two terminals)
   ```bash
   # Terminal 1
   cd server && npm run dev

   # Terminal 2
   cd client && npm run dev
   ```

The app will be available at `http://localhost:5173`.
