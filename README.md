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
  4. **Geo-Security & Sync Agent:** Haversine distance geofencing (Kasba 854330 boundary) & Firebase sync
- **Database & Storage:** **Firebase Cloud Firestore** (Real-time database) + **Firebase Storage** (Meme image hosting) + `geofire-common` spatial hashing
- **Rate-Limiting:** Zero-login IP hash verification

---

## ⚡ Quick Start & Configuration

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Firebase & Gemini API keys:

```env
# 1. Google Gemini 1.5 Flash Vision API Key
GEMINI_API_KEY=your_gemini_api_key

# 2. Firebase App Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

### 2. Firebase Deployment & Security Rules

To deploy Firestore security rules and Storage rules to Firebase:

```bash
# Login to Firebase
npx firebase login

# Deploy rules and indexes
npx firebase deploy --only firestore,storage
```

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

#### Option A: Vercel (Recommended for Next.js)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
npx vercel
```

#### Option B: Firebase Hosting

```bash
npx firebase deploy
```

---

## 📜 License
MIT License - Developed for civic road defect reporting in Kasba (854330).
