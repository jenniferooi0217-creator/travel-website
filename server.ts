import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
  });
});

// Chat endpoint for persistent AI Travel Assistant
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userMessage, destination = 'Penang, Malaysia' } = req.body;

    const query = userMessage || (Array.isArray(messages) && messages[messages.length - 1]?.content);

    if (!query) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (!aiClient) {
      // Intelligent domain fallback if Gemini API key is not configured in environment
      const fallbackResponse = generateSmartFallbackChat(query, destination);
      return res.json({ reply: fallbackResponse, isFallback: true });
    }

    const systemInstruction = `You are "Haven Concierge", the editorial AI travel stylist for Penang Haven.
Your specialty is Penang, Malaysia — an aesthetic island where 19th-century Peranakan heritage, golden Andaman sunsets, and Michelin-recognized hawker culture meet.
Provide warm, evocative, Pinterest-curated, highly practical advice:
- Romantic & aesthetic spots (vintage pastel shophouses on Armenian St, Hin Bus Depot art gardens, Cheong Fatt Tze Blue Mansion courtyards, quiet Chew Jetty wooden docks at golden hour, canopy walks high above Penang Hill).
- Michelin-acclaimed & local favorite food institutions (Siam Road Charcoal CKT, Air Itam Laksa, Toh Soon charcoal kaya toast in a secret back alley, Hameediyah Nasi Kandar est. 1907).
- Photography, golden hour times, and mood tips.
- Tropical packing advice (linen shirts, vintage straw hats, comfortable slip-on espadrilles, lightweight sun umbrella).
Keep responses beautifully structured with editorial headings, elegant bullet points, and actionable tips.`;

    // Construct conversation history for Gemini
    const historyText = Array.isArray(messages) && messages.length > 0
      ? messages.slice(-6).map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
      : '';

    const prompt = `${systemInstruction}

Conversation history:
${historyText}

User's latest inquiry regarding ${destination}:
"${query}"

Respond concisely and engagingly:`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const reply = response.text || 'I apologize, I could not generate a response at this moment.';
    return res.json({ reply, isFallback: false });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const fallbackResponse = generateSmartFallbackChat(req.body.userMessage || 'travel tips', req.body.destination || 'Penang');
    return res.json({ reply: fallbackResponse, isFallback: true, errorNotice: error?.message });
  }
});

// Dynamic Itinerary Generation endpoint
app.post('/api/generate-itinerary', async (req: Request, res: Response) => {
  try {
    const {
      prompt: userPrompt,
      destination = 'Penang, Malaysia',
      durationDays = 3,
      travelStyle = 'Culinary & Culture',
      budget = 'Moderate',
      pace = 'Balanced',
    } = req.body;

    const days = Math.max(1, Math.min(7, parseInt(durationDays, 10) || 3));

    if (!aiClient) {
      // Structured fallback itinerary generator
      const fallbackItinerary = generateFallbackItinerary(destination, days, travelStyle, budget, pace);
      return res.json({ itinerary: fallbackItinerary, isFallback: true });
    }

    const aiPrompt = `You are a world-class travel curator and Penang travel authority.
Generate a comprehensive, realistic, day-by-day travel itinerary for:
- Destination: ${destination}
- Duration: ${days} days
- Travel Style: ${travelStyle}
- Budget: ${budget}
- Pace: ${pace}
- Specific user request: "${userPrompt || `Explore ${destination} for ${days} days`}"

Output strictly valid JSON matching this schema:
{
  "title": string,
  "destination": string,
  "durationDays": number,
  "travelStyle": string,
  "budget": string,
  "pace": string,
  "summary": string,
  "highlights": string[],
  "weatherSummary": string,
  "packingEssentials": string[],
  "estimatedBudgetUSD": string,
  "days": [
    {
      "dayNumber": number,
      "theme": string,
      "dateLabel": string,
      "activities": [
        {
          "id": string,
          "timeSlot": "Morning" | "Afternoon" | "Evening" | "Night Supper",
          "time": string,
          "title": string,
          "description": string,
          "category": "food" | "culture" | "nature" | "relaxation" | "adventure",
          "location": string,
          "costEstimate": string,
          "duration": string,
          "insiderTip": string,
          "transportToNext": string,
          "coordinates": { "x": number, "y": number, "lat": number, "lng": number }
        }
      ]
    }
  ]
}
Note on coordinates:
For Penang: provide realistic coordinates (lat around 5.30 to 5.47, lng around 100.20 to 100.35) and normalized map coordinates x (20 to 80) and y (20 to 80) representing percentage positions on an interactive visual map.
Ensure 3 to 4 activities per day across Morning, Afternoon, Evening, and Night Supper. Include authentic local dishes, secret tips, and exact locations. Output ONLY valid raw JSON with no markdown backticks.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: aiPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(rawText);
      return res.json({ itinerary: parsed, isFallback: false });
    } catch (parseError) {
      console.warn('Could not parse Gemini JSON output, falling back to structured generator:', parseError);
      const fallbackItinerary = generateFallbackItinerary(destination, days, travelStyle, budget, pace);
      return res.json({ itinerary: fallbackItinerary, isFallback: true });
    }
  } catch (error: any) {
    console.error('Error in /api/generate-itinerary:', error);
    const fallbackItinerary = generateFallbackItinerary(
      req.body.destination || 'Penang, Malaysia',
      parseInt(req.body.durationDays, 10) || 3,
      req.body.travelStyle || 'Culinary & Culture',
      req.body.budget || 'Moderate',
      req.body.pace || 'Balanced'
    );
    return res.json({ itinerary: fallbackItinerary, isFallback: true, errorNotice: error?.message });
  }
});

// Helper for Smart Fallback Chat
function generateSmartFallbackChat(query: string, destination: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('weather') || lower.includes('rain') || lower.includes('temperature') || lower.includes('climate')) {
    return `### ☀️ Penang Weather & Climate Forecast

Penang enjoys a tropical equatorial climate year-round:
- **Average Temperature:** 28°C - 32°C (82°F - 90°F) with pleasant coastal evening breezes.
- **Dry Season:** December to April (ideal for beach walks and Georgetown heritage photography).
- **Monsoon & Showers:** May to November, with peak tropical afternoon downpours in September–October. Showers are usually brief (1-2 hours) and refresh the island.
- **Top Tip:** Carry a compact umbrella or light raincoat, stay hydrated with fresh coconut water, and plan indoor heritage mansion visits or cafe hops during mid-afternoon rain!`;
  }

  if (lower.includes('pack') || lower.includes('clothes') || lower.includes('luggage') || lower.includes('bring')) {
    return `### 🎒 Penang Essential Packing Checklist

Here is what you shouldn't leave behind for Penang:
1. **Lightweight, Breathable Attire:** Loose cotton or linen t-shirts, shorts, and summer dresses to manage tropical humidity.
2. **Temple-Appropriate Coverings:** A light sarong or scarf to cover shoulders/knees when visiting Kek Lok Si, Wat Chayamangkalaram, or Kapitan Keling Mosque.
3. **Comfortable Footwear:** Breathable walking sneakers or slip-on sandals for exploring the UNESCO street art and historic five-foot ways.
4. **Sun & Rain Defense:** UV sunscreen (SPF 50+), polarized sunglasses, and an umbrella that doubles as a sun parasol.
5. **Foodie Gear:** Hand sanitizer and wet wipes for street food hawker feasts!`;
  }

  if (lower.includes('food') || lower.includes('eat') || lower.includes('char kway teow') || lower.includes('laksa') || lower.includes('nasi kandar')) {
    return `### 🍜 Penang Legendary Hawker Recommendations

Penang is world-famous as Southeast Asia's culinary capital. Here are the must-eat institutions:
1. **Char Kway Teow:**
   - *Siam Road Charcoal Char Kway Teow* (Uncle Tan's legendary smoky wok hei).
   - *Lorong Selamat Char Kway Teow* (Jumbo succulent prawns with crispy pork lard).
2. **Penang Assam Laksa:**
   - *Air Itam Assam Laksa* right below Kek Lok Si Temple (spicy, tangy mackerel broth infused with lemongrass & torch ginger).
3. **Nasi Kandar:**
   - *Hameediyah Restaurant* on Campbell Street (est. 1907 - the oldest in Malaysia; try duck kurma and ayam bawang).
   - *Line Clear Nasi Kandar* on Penang Road.
4. **Dessert & Refreshment:**
   - *Penang Road Famous Teochew Chendul* (shaved ice with fragrant Gula Melaka, coconut milk, and red beans).`;
  }

  return `### 🌴 WanderWise Travel Insight for ${destination}

Penang is an intoxicating blend of British colonial heritage, ornate Chinese clan houses, vibrant street art, tranquil rainforest hills, and UNESCO-acclaimed hawker cuisine.

**Quick Insider Tips:**
- **Getting Around:** The *Grab* ride-hailing app is ubiquitous, fast, and very inexpensive throughout the island. For George Town core, walking or renting a heritage bicycle is fantastic.
- **Best Time to Stroll:** Early morning (8:00 AM - 10:30 AM) and late afternoon (4:30 PM - 7:00 PM) to avoid midday heat.
- **Where to Stay:** Choose **George Town** for heritage shophouse boutique hotels, or **Batu Ferringhi** for beachfront luxury resorts.

Feel free to ask me about specific restaurants, a customized day-by-day itinerary, or hidden secrets around Penang Hill!`;
}

// Fallback high-fidelity structured itinerary
function generateFallbackItinerary(destination: string, days: number, travelStyle: string, budget: string, pace: string) {
  const isPenang = destination.toLowerCase().includes('penang') || true;

  const day1Activities = [
    {
      id: 'act-1-1',
      timeSlot: 'Morning',
      time: '08:30 AM - 10:30 AM',
      title: 'Heritage Breakfast & Armenian Street Art Hunt',
      description: 'Start with traditional kaya toast, soft-boiled eggs, and Hainanese kopi at Toh Soon Cafe, then explore iconic Ernest Zacharevic murals like "Kids on Bicycle".',
      category: 'culture',
      location: 'Armenian Street & Campbell St, George Town',
      costEstimate: '$4 - $7',
      duration: '2 hours',
      insiderTip: 'Arrive at Toh Soon before 8:30 AM to secure a back-alley table without standing in line.',
      transportToNext: '🚶 6 min stroll along Armenian Street',
      coordinates: { x: 72, y: 44, lat: 5.415, lng: 100.336 },
    },
    {
      id: 'act-1-2',
      timeSlot: 'Morning',
      time: '10:45 AM - 12:30 PM',
      title: 'Pinang Peranakan Mansion & Cheong Fatt Tze (Blue Mansion)',
      description: 'Marvel at opulent Baba Nyonya ancestral antiques, intricate teak carvings, and Chinese courtyards in this lavish 19th-century residence.',
      category: 'culture',
      location: 'Church Street, George Town',
      costEstimate: '$6 entrance fee',
      duration: '1.5 hours',
      insiderTip: 'Join the guided tour at 11:30 AM to hear fascinating stories of 19th-century tin mining tycoons.',
      transportToNext: '🚗 8 min Grab ride to Siam Road',
      coordinates: { x: 74, y: 41, lat: 5.418, lng: 100.341 },
    },
    {
      id: 'act-1-3',
      timeSlot: 'Afternoon',
      time: '01:00 PM - 03:00 PM',
      title: 'Legendary Siam Road Charcoal Char Kway Teow',
      description: 'Feast on the world-renowned charcoal-fried flat noodles bursting with wok hei, Chinese sausage, cockles, and plump prawns.',
      category: 'food',
      location: 'Siam Road, George Town',
      costEstimate: '$3 - $5',
      duration: '1.5 hours',
      insiderTip: 'Pair your noodles with a tall glass of iced nutmeg juice (Jus Buah Pala), a cooling Penang specialty.',
      transportToNext: '🚶 10 min walk to Hin Bus Depot',
      coordinates: { x: 68, y: 46, lat: 5.414, lng: 100.322 },
    },
    {
      id: 'act-1-4',
      timeSlot: 'Evening',
      time: '05:30 PM - 07:30 PM',
      title: 'Sunset Walk Along Clan Jetties (Chew Jetty)',
      description: 'Wander wooden boardwalks above water in this 19th-century Chinese waterfront village where families still live in stilt houses.',
      category: 'relaxation',
      location: 'Weld Quay, George Town',
      costEstimate: 'Free entry',
      duration: '1.5 hours',
      insiderTip: 'The sea breeze at sunset offers incredible views of Penang Bridge in the distance.',
      transportToNext: '🚶 5 min walk to Chulia Street Night Market',
      coordinates: { x: 76, y: 48, lat: 5.413, lng: 100.340 },
    },
    {
      id: 'act-1-5',
      timeSlot: 'Night Supper',
      time: '08:00 PM - 10:00 PM',
      title: 'Chulia Street Night Hawker Safari & Speakeasy Bars',
      description: 'Devour wanton mee, oyster omelettes (Or Chien), and curry mee, then slip behind an antique door into George Town hidden cocktail speakeasies.',
      category: 'food',
      location: 'Lebuh Chulia, George Town',
      costEstimate: '$5 - $12',
      duration: '2 hours',
      insiderTip: 'Ask the wanton mee uncle for extra pickled green chilies for that signature tangy punch.',
      transportToNext: '🚗 5 min Grab back to hotel',
      coordinates: { x: 71, y: 43, lat: 5.419, lng: 100.334 },
    },
  ];

  const day2Activities = [
    {
      id: 'act-2-1',
      timeSlot: 'Morning',
      time: '08:00 AM - 11:00 AM',
      title: 'Kek Lok Si Temple & Air Itam Sister Curry Mee',
      description: 'Ascend the largest Buddhist temple in Malaysia, featuring the 30m bronze Guan Yin statue, followed by iconic coal-simmered curry mee.',
      category: 'culture',
      location: 'Air Itam, Central Penang',
      costEstimate: '$4 - $8',
      duration: '3 hours',
      insiderTip: 'Ride the inclined lift to the Guan Yin Pavilion for breathtaking panoramic views of the island.',
      transportToNext: '🚗 12 min Grab ride to Penang Hill Lower Station',
      coordinates: { x: 52, y: 55, lat: 5.399, lng: 100.273 },
    },
    {
      id: 'act-2-2',
      timeSlot: 'Afternoon',
      time: '11:30 AM - 03:00 PM',
      title: 'Penang Hill Funicular Railway & The Habitat Canopy Walk',
      description: 'Ride the world’s steepest tunnel funicular railway up 833 meters into cool mountain air, then walk through 130-million-year-old virgin rainforest canopy.',
      category: 'nature',
      location: 'Bukit Bendera (Penang Hill)',
      costEstimate: '$15 - $22',
      duration: '3.5 hours',
      insiderTip: 'Step onto the Curtis Crest Treetop Walk—the highest 360-degree viewing platform on Penang Island.',
      transportToNext: '🚗 20 min Grab ride to Gurney Bay waterfront',
      coordinates: { x: 50, y: 50, lat: 5.408, lng: 100.277 },
    },
    {
      id: 'act-2-3',
      timeSlot: 'Evening',
      time: '05:30 PM - 07:30 PM',
      title: 'Gurney Bay Waterfront Promenade & Seaside Stroll',
      description: 'Breathe in the Andaman sea breeze along Penang’s newest coastal recreational park overlooking the northern coastline.',
      category: 'relaxation',
      location: 'Persiaran Gurney, Northern Coast',
      costEstimate: 'Free',
      duration: '1.5 hours',
      insiderTip: 'Catch golden hour when joggers, families, and seabirds gather along the modern boardwalk.',
      transportToNext: '🚶 4 min walk to Gurney Drive Hawker Centre',
      coordinates: { x: 67, y: 32, lat: 5.438, lng: 100.310 },
    },
    {
      id: 'act-2-4',
      timeSlot: 'Night Supper',
      time: '07:45 PM - 09:45 PM',
      title: 'Gurney Drive Hawker Extravaganza',
      description: 'Taste the holy trinity of Penang hawker dishes: crispy Pasembur rojak salad, fried oyster omelette, and piping-hot Penang Assam Laksa.',
      category: 'food',
      location: 'Gurney Drive Hawker Centre',
      costEstimate: '$6 - $10',
      duration: '2 hours',
      insiderTip: 'Remember your table number! Hawker runners will deliver fresh plates directly to where you sit.',
      transportToNext: '🚗 10 min Grab back to accommodation',
      coordinates: { x: 66, y: 31, lat: 5.440, lng: 100.308 },
    },
  ];

  const day3Activities = [
    {
      id: 'act-3-1',
      timeSlot: 'Morning',
      time: '09:00 AM - 12:00 PM',
      title: 'Entopia Butterfly Sanctuary & Teluk Bahang Tropical Forest',
      description: 'Immerse in a giant living glasshouse with 15,000 free-flying tropical butterflies, waterfalls, reptiles, and rainforest flora.',
      category: 'nature',
      location: 'Teluk Bahang, Northwest Penang',
      costEstimate: '$14 admission',
      duration: '3 hours',
      insiderTip: 'Wear bright clothing (yellow or red) to encourage friendly butterflies to land on your shoulder!',
      transportToNext: '🚗 10 min drive to Batu Ferringhi coastline',
      coordinates: { x: 26, y: 28, lat: 5.465, lng: 100.224 },
    },
    {
      id: 'act-3-2',
      timeSlot: 'Afternoon',
      time: '12:30 PM - 03:30 PM',
      title: 'Batu Ferringhi Beach & Watersports Retreat',
      description: 'Unwind along the palm-fringed golden sands. Rent jet skis, parasail over turquoise waters, or lounge at a beach cafe with iced coconut milkshakes.',
      category: 'relaxation',
      location: 'Batu Ferringhi Coastline',
      costEstimate: '$10 - $25',
      duration: '3 hours',
      insiderTip: 'Check out Bora Bora or Frandy Beach Bar for shaded hammocks and chilled tropical beverages.',
      transportToNext: '🚶 5 min stroll along the beach promenade',
      coordinates: { x: 38, y: 26, lat: 5.473, lng: 100.245 },
    },
    {
      id: 'act-3-3',
      timeSlot: 'Evening',
      time: '05:30 PM - 07:30 PM',
      title: 'Sunset Dining at Ferringhi Garden',
      description: 'Dine inside an enchanting lush botanical conservatory surrounded by exotic orchids, cascading fountains, and live acoustic music.',
      category: 'food',
      location: 'Jalan Batu Ferringhi',
      costEstimate: '$20 - $35',
      duration: '2 hours',
      insiderTip: 'Book a table in the garden courtyard 24 hours in advance for the best romantic twilight ambiance.',
      transportToNext: '🚶 3 min walk to the Night Market',
      coordinates: { x: 40, y: 27, lat: 5.471, lng: 100.248 },
    },
    {
      id: 'act-3-4',
      timeSlot: 'Night Supper',
      time: '07:45 PM - 10:00 PM',
      title: 'Batu Ferringhi Night Bazaar & Local Souvenir Hunt',
      description: 'Browse over a kilometer of illuminated roadside stalls selling batik prints, handmade crafts, leather goods, and street delicacies.',
      category: 'culture',
      location: 'Batu Ferringhi Main Strip',
      costEstimate: '$10 - $20',
      duration: '2 hours',
      insiderTip: 'Polite bargaining is welcome and part of the vibrant night market experience.',
      transportToNext: '🚗 Return to George Town or hotel',
      coordinates: { x: 42, y: 28, lat: 5.470, lng: 100.252 },
    },
  ];

  const allDayTemplates = [
    { dayNumber: 1, theme: 'George Town Heritage, Street Murals & Hawker Safari', dateLabel: 'Day 1', activities: day1Activities },
    { dayNumber: 2, theme: 'Misty Rainforest, Sacred Temples & Coastal Flavors', dateLabel: 'Day 2', activities: day2Activities },
    { dayNumber: 3, theme: 'Eco-Sanctuary, Golden Beaches & Sunset Night Bazaar', dateLabel: 'Day 3', activities: day3Activities },
  ];

  // If user requested more than 3 days, generate extra themed days
  const generatedDays = [];
  for (let i = 0; i < days; i++) {
    if (i < allDayTemplates.length) {
      generatedDays.push(allDayTemplates[i]);
    } else {
      generatedDays.push({
        dayNumber: i + 1,
        theme: `Day ${i + 1}: Hidden Flavors & Artisan Culture of ${destination}`,
        dateLabel: `Day ${i + 1}`,
        activities: [
          {
            id: `act-${i + 1}-1`,
            timeSlot: 'Morning',
            time: '09:00 AM - 11:30 AM',
            title: 'Balik Pulau Countryside & Nutmeg Farm Exploration',
            description: 'Cycle past quiet paddy fields and visit organic fruit orchards on the tranquil western flank of Penang.',
            category: 'nature',
            location: 'Balik Pulau, Western Penang',
            costEstimate: '$5 - $10',
            duration: '2.5 hours',
            insiderTip: 'Try the famous Balik Pulau Siam Laksa which uses rich fresh coconut santan.',
            transportToNext: '🚗 20 min Grab to town center',
            coordinates: { x: 30, y: 65, lat: 5.352, lng: 100.235 },
          },
          {
            id: `act-${i + 1}-2`,
            timeSlot: 'Afternoon',
            time: '12:30 PM - 03:00 PM',
            title: 'Hin Bus Depot Contemporary Art & Artisan Cafe Crawl',
            description: 'Stroll around restored bus depot brick ruins transformed into gallery spaces, artisan bakeries, and craft studios.',
            category: 'culture',
            location: 'Jalan Gurdwara, George Town',
            costEstimate: '$8 - $15',
            duration: '2.5 hours',
            insiderTip: 'Visit on Sundays when the local farmers and makers community market takes over the lawns.',
            transportToNext: '🚶 10 min walk to dessert stall',
            coordinates: { x: 70, y: 47, lat: 5.412, lng: 100.328 },
          },
          {
            id: `act-${i + 1}-3`,
            timeSlot: 'Evening',
            time: '05:30 PM - 08:00 PM',
            title: 'Sunset Ferry Ride & Butterworth Harbor Views',
            description: 'Board the modern Penang cross-strait ferry for golden hour sea vistas of the historic island skyline.',
            category: 'relaxation',
            location: 'Raja Tun Uda Ferry Terminal',
            costEstimate: '$1 - $2',
            duration: '1.5 hours',
            insiderTip: 'Stand on the upper deck railing facing west for postcard-perfect sunset lighting.',
            transportToNext: '🚶 5 min walk back to terminal',
            coordinates: { x: 77, y: 45, lat: 5.416, lng: 100.344 },
          },
        ],
      });
    }
  }

  return {
    title: `${days}-Day ${travelStyle} Journey: ${destination}`,
    destination,
    durationDays: days,
    travelStyle,
    budget,
    pace,
    summary: `A carefully curated ${days}-day escape discovering the world-renowned street food, UNESCO colonial shophouses, 130-million-year-old rainforests, and vibrant seaside sunset havens across ${destination}.`,
    highlights: [
      'UNESCO World Heritage street art & clan jetty history',
      'Michelin-recognized street food: Siam Road CKT & Air Itam Laksa',
      'The Habitat 360° virgin rainforest canopy walk on Penang Hill',
      'Sunset along the golden sands and night markets of Batu Ferringhi',
    ],
    weatherSummary: 'Warm tropical sunshine with pleasant ocean breezes (29°C - 32°C). Occasional late afternoon showers.',
    packingEssentials: [
      'Light breathable linen clothing & summer walking sandals',
      'Foldable compact umbrella / sun protection parasol',
      'Temple modesty attire (scarf/sarong for shoulder & knee coverage)',
      'Wet wipes & appetite for endless hawker food crawls',
    ],
    estimatedBudgetUSD: budget === 'Luxury' ? '$350 - $600 USD' : budget === 'Moderate' ? '$120 - $220 USD' : '$50 - $90 USD',
    days: generatedDays,
  };
}

// In production, serve the built Vite static assets.
// In development, integrate Vite middlewares.
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WanderLust Server] Running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
