---
description: 
---

[AntiGravity Workspace / Orchestration]
           │
           ├── Agent 1 (Vision): Image Scan (YOLO / Multimodal LLM)
           ├── Agent 2 (Security): IP & Geofence (854330 Boundary)
           ├── Agent 3 (Creative): Kasba Bhojpuri/Hindi Roaster
           └── Agent 4 (UI/Canvas): Automated Meme Overlay Renderer

AI Models & LLMs Design (The Agent Swarm)
Is system me 3 specialized AI Agents ek chain me kaam karenge:

👁️ Agent 1: Vision & Object Detection Agent
Role: Photo me pothole hai ya nahi detect karna, unki ginti (count) karna, aur roughness/depth ka estimate lagana. Fake uploads (indoor, cat/dog, random photos) ko reject karna.

LLM / Model: Gemini 1.5 Flash ya GPT-4o-mini (Multimodal Capabilities).

Why: Ye models Image Input ko samajhte hain. Image bhej kar hum JSON response nikalwayenge (e.g., {"is_pothole": true, "count": 3, "severity": "High", "dimensions": "3ft x 2ft"}).

🎭 Agent 2: Local Meme Roaster (LLM)
Role: Pothole ki details lekar Kasba (854330) ke context me localized, funny, viral Hindi/Bhojpuri 1-liner roast caption likhna.

LLM: Gemini 1.5 Flash / Llama 3.1 8B / Claude 3.5 Haiku.

Prompt Logic: System prompt me instruct kiya jata hai: "Act as a local meme creator from Kasba, Purnea. Generate a hilarious 1-line Hindi/Bhojpuri roast for a road with {count} potholes."

🎨 Agent 3: Dynamic Image Canvas Renderer
Role: Captured image ke upar AI se aaya Meme Caption, Pothole Count Badge, aur Dimensions (Width x Depth) ko visually superimpose/draw karke Instagram-ready post tayar karna.

Technology: HTML5 Canvas API (Frontend me) ya Node.js canvas / Sharp library (Backend me). (Isme LLM nahi, purely image processing engine use hota hai).
