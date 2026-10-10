# WanderLust AI — Penang & Global AI Travel Planner

A modern, responsive travel web application with an integrated AI travel assistant powered by **Google Gemini 3.8 Flash**, **React 19**, and **Tailwind CSS**.

---

## ✨ Core Features

1. **AI Discovery Hero (Home)**
   - Visually striking landing page with atmospheric photography, editorial typography, and live Gemini badges.
   - Natural language search bar (e.g., *"Plan a 3-day food trip to Penang"* or *"Weekend heritage & beach in George Town"*).
   - Trip customization controls: Duration (1–7 days), Travel Style (Culinary, UNESCO Heritage, Rainforest, Coastal Beach), Budget, and Pace.
   - Quick prompt pills for instant travel inspiration.

2. **Persistent AI Chat Assistant Widget**
   - Floating travel concierge anchored at the bottom-right corner.
   - Real-time travel recommendations, monsoon weather updates, custom packing checklists, and local etiquette.
   - Quick suggestion chips and markdown formatting.
   - Deep local insider wisdom for Penang's hawker stalls, shophouses, and night markets.

3. **Destination Gallery (Penang, Malaysia Spotlight)**
   - Grid displaying featured iconic locations:
     - *George Town UNESCO Historic Quarter*
     - *Kek Lok Si Temple & Air Itam*
     - *Penang Hill & The Habitat Rainforest Canopy*
     - *Batu Ferringhi Sunset Beach & Night Bazaar*
     - *Gurney Drive Hawker Haven & Gurney Bay*
     - *Clan Jetties of Weld Quay (Chew Jetty)*
     - *Entopia Butterfly Sanctuary*
     - *Hin Bus Depot Creative Arts Centre*
   - Filterable categories: Heritage & Culture, Food & Hawkers, Rainforest & Nature, Coastal & Beaches.
   - Interactive Detail Modal with must-try local dishes, insider tips, best stroll hours, and direct "Ask AI about this place" actions.

4. **Dynamic Day-by-Day Itinerary View**
   - Chronological timeline layout organized into Morning, Afternoon, Evening, and Night Supper.
   - Activity cards with category badges, duration, estimated costs, and insider secrets.
   - Transit notes between stops (e.g., *"🚶 6 min stroll along Armenian Street"* or *"🚗 10 min Grab ride"*).
   - **Interactive Route Radar & Map Component**:
     - Visual map of Penang Island plotting each day's waypoints.
     - Connecting route lines.
     - Clickable markers with real-time waypoint details and direct Google Maps navigation links.
   - Quick export tools: Shareable link copying, Print/PDF export, and weather & packing briefings.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```
> *Note:* If no `GEMINI_API_KEY` is provided, the application runs seamlessly using its built-in intelligent domain knowledge engine for Penang.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🚢 Deploying to Vercel & GitHub

### GitHub
```bash
git init
git add .
git commit -m "feat: WanderLust AI Penang Travel Planner"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Set the Framework Preset to **Vite**.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key.
4. Click **Deploy**.
