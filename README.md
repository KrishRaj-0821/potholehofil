# 🚗 PotholeHofile (Kasba - 854330)

> **AI-Powered Civic Tech & Road Defect Meme Platform for Kasba (PIN: 854330)**

PotholeHofile is a location-gated, zero-login, AI-powered civic platform designed specifically for Kasba. It turns real-time road defect reporting into an Instagram Reel-style vertical feed featuring local Hindi/Bhojpuri meme roasts, real-time spatial estimates, and strict anti-fraud geofencing.

---

## 🏗️ Architecture & Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons (Instagram Dark UI Theme)
- **AI Agents:**
  1. **Vision Verification Agent:** Google Gemini 1.5 Flash (Pothole detection & dimension estimation)
  2. **Localized Roasting Agent:** Localized Hindi/Bhojpuri meme caption generator (Kasba dialect)
  3. **Canvas Rendering Agent:** Client-side HTML5 canvas overlay superimposition
  4. **Geo-Security & Sync Agent:** Haversine distance geofencing (Kasba 854330 boundary) & Supabase sync
- **Database:** Supabase (PostgreSQL + PostGIS spatial indexing)
- **Rate-Limiting:** Zero-login IP hash verification

---

## ⚡ Quick Start & Configuration

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your service API keys:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### 2. Database Setup (Supabase)

1. Open your project on [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and paste the contents of `supabase/schema.sql`.
4. Click **Run**.

---

### 3. Local Development

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 4. Deploying Live

#### Option A: Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
npx vercel
```

#### Option B: Docker / Cloud Run

```bash
docker build -t potholehofil .
```

---

## 📜 License
MIT License - Developed for civic road defect reporting in Kasba (854330).
