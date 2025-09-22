# Live Quiz Frontend (React)

Ocean Professional themed frontend for a real-time Live Quiz platform.

Features:
- Join quizzes with a code and name
- Answer questions in real-time (WebSocket-ready)
- Live leaderboard and personal progress
- REST integration scaffolding with graceful local fallbacks
- Supabase client ready via env vars

Quick start:
- npm install
- Set environment variables in `.env` (see `.env.example`)
- npm start

Environment:
- REACT_APP_API_BASE_URL (optional; empty uses same-origin)
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Routes:
- /           Home
- /join       Join a quiz
- /quiz/:code Quiz room
- /results    Results summary

Code structure (src):
- pages/: route components
- components/: reusable UI pieces
- context/: global state (Quiz, UI)
- services/: api, websocket, supabase client
- styles.css: global styles
