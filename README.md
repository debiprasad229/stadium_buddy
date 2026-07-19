# 🏟️ ArenaOS 2026 | FIFA World Cup 2026

**ArenaOS 2026** is a comprehensive, next-generation stadium management and fan engagement platform built for the FIFA World Cup 2026. Designed specifically for massive-scale live events (showcasing MetLife Stadium), ArenaOS bridges the gap between premium fan experiences and real-time operational command using cutting-edge Generative AI.

---

## ✨ Key Features

### 👤 Fan Experience Hub
A mobile-first, smart digital companion for fans inside the stadium:
- **FIFA Smart Assistant:** A live AI chatbot powered by the **Google Gemini 3.5 Flash** model that answers fan questions in real-time (multilingual support for English, Spanish, and French).
- **Interactive MapViewer:** Gate-to-seat navigation with dynamic SVG stadium blueprints, live route calculation, and Text-to-Speech (TTS) directions.
- **Express Concessions (SmartQueue):** In-seat food and beverage pre-ordering system that validates seat locations, calculates wait times, and provides live status updates.
- **GreenTracker:** A gamified sustainability dashboard that rewards fans with "Green Points" (GP) for recycling their eco-cups via barcode scanning.

### 🛡️ Operations Command Center
A high-contrast, data-dense control panel for stadium staff and dispatchers:
- **Live Telemetry Stream:** Real-time data visualization of stadium crowd density, energy consumption (kW), and gate flow rates.
- **GenAI Operational Copilot:** An intelligent background agent that continuously analyzes live telemetry data and generates proactive, actionable recommendations (e.g., "Deploy Rapid-Entry Teams", "Activate Cooling Profile").
- **Incident Dispatcher & Response:** A live feed of active stadium incidents with severity tracking and AI-driven staff reallocation suggestions.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Vanilla CSS, CSS Variables, Responsive Grid/Flexbox Layouts, Glassmorphism UI
- **Icons:** Lucide React
- **AI Integration:** Google Generative Language API (`v1beta`) powered by the **Gemini-3.5-Flash** model.
- **Backend Architecture:** A secure server-side proxy handles all Gemini API requests, ensuring client-side security and preventing API key exposure. 

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your machine.

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/arenaos-2026.git
cd arenaos-2026
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env` file in the root directory and add your Google Gemini API key. 
*(Note: Do not expose this key to the client side. The backend proxy will securely inject it.)*

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Start the Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173` (or the next available port). The Vite development server automatically spins up the secure `/api/chat` and `/api/copilot` proxy endpoints.

---

## 🔒 Security & Architecture

ArenaOS employs a secure proxy architecture for its AI integrations. Instead of making calls directly from the browser (which would expose API keys), the React frontend sends requests to `/api/chat` and `/api/copilot`. 

- **Local Development:** The Vite config (`vite.config.ts`) acts as a middleware proxy, injecting the server environment variables and forwarding the requests to Google's REST API.
- **Production (Vercel/Serverless):** The `api/` directory contains Node.js serverless functions that act as the secure production endpoints.

---

## ♿ Accessibility (WCAG 2.1 AA Compliant)

ArenaOS is built with accessibility in mind:
- **Dynamic Text Scaling:** Dedicated font-size controls (Small, Medium, Large) that scale proportionally across the entire app.
- **Text-to-Speech (TTS):** Integrated Web Speech API for reading navigation routes and success messages aloud.
- **Theme Support:** High-contrast modes, Dark, and Light themes available via the accessibility dropdown.
- **Semantic HTML:** ARIA labels and screen-reader-only elements (`.sr-only`) ensure smooth navigation for assistive technologies.

---
*© 2026 FIFA World Cup Organizers. Managed by ArenaOS.*
