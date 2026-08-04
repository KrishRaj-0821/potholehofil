---
trigger: always_on
---

# 📌 Project Blueprint: PotholeHofile (Kasba - 854330)

## 📖 Overview
**PotholeHofile** is a location-gated, zero-login, AI-powered civic-tech platform designed specifically for Kasba (PIN: 854330). It transforms real-time road defect reporting into an Instagram Reel-style social feed featuring localized AI-generated meme roasts, real-time spatial estimates, and strict anti-fraud verification.

---

## 🛠️ Technology Stack

| Component | Technology / Platform | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Mobile-first Progressive Web App (PWA) with Server Actions. |
| **Styling & UI** | Tailwind CSS + Lucide React | Instagram-style dark UI with full-screen vertical feed layout. |
| **Camera & Geolocation** | HTML5 MediaDevices API + Geolocation API | Live rear-camera access with AR overlay and GPS tracking. |
| **AI / Multi-Agent LLMs** | Google Gemini 1.5 Flash (Multimodal) | Vision analysis (pothole counting & detection) + local Hindi/Bhojpuri meme generation. |
| **Canvas Processing** | HTML5 Canvas API / Node.js Canvas | Dynamic superimposition of captions, metrics, and badges on captured images. |
| **Database & Spatial Tracking**| Supabase (PostgreSQL + PostGIS) | Post storage, upvote metrics, and geographic radius validation. |
| **Anti-Spam & Security** | Upstash Redis + FingerprintJS | Zero-login rate limiting (1 vote / 1 report per IP & device fingerprint). |

---
[ Captured Image + GPS Metadata ]
│
▼
┌──────────────────────────────┐
│  1. Vision Verification Agent│  ──► Validates pothole presence, counts defects & estimates dimensions
└──────────────┬───────────────┘
│
▼
┌──────────────────────────────┐
│  2. Localized Roasting Agent │  ──► Generates viral 1-liner Hindi/Bhojpuri meme captions (Kasba theme)
└──────────────┬───────────────┘
│
▼
┌──────────────────────────────┐
│  3. Image Rendering Agent    │  ──► Superimposes text, dimension badges & branding onto image canvas
└──────────────┬───────────────┘
│
▼
┌──────────────────────────────┐
│  4. Geo-Security & Sync Agent│  ──► Enforces 854330 geofencing, IP rate-limits & syncs to Supabase
└──────────────────────────────┘

---

## 🔄 System Workflow & Rules

1. **Location Verification (Geofencing):**
   * The app verifies user GPS coordinates against the boundary of **Kasba (PIN 854330)**. Out-of-bounds requests are instantly blocked.
2. **Camera Stream & AR Capture:**
   * Tapping the camera button launches the rear camera stream with an AR scanner grid overlay. Capturing freezes the frame and extracts spatial data.
3. **AI Vision & Fraud Detection:**
   * The image blob is processed via Gemini 1.5 Flash. If no pothole/road is detected (e.g., selfie, indoor image), the submission is rejected.
   * If valid, the model returns: `pothole_count`, `severity`, and `estimated_dimensions` (Depth & Area).
4. **Meme Generation & Dynamic Overlay:**
   * The LLM creates a funny 1-liner roast caption in Kasba's local dialect.
   * The Canvas API burns the caption, count badge, and dimension metrics directly into the photo.
5. **Zero-Login Voting & Feed Sync:**
   * FingerprintJS and Upstash Redis record the user's IP hash to enforce a **1 vote per IP limit**.
   * The finalized meme image is stored on Supabase and rendered directly into the public Instagram-style feed.

## 🤖 Multi-Agent AI System Design