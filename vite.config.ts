import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Helper to parse .env file
function getApiKeyFromEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const content = readFileSync(envPath, 'utf-8');
    const match = content.match(/GEMINI_API_KEY\s*=\s*([^\s]+)/) || content.match(/VITE_GEMINI_API_KEY\s*=\s*([^\s]+)/);
    return match ? match[1].trim() : '';
  } catch {
    return '';
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-mock-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/chat') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { messages, currentLang } = JSON.parse(body);
                const apiKey = getApiKeyFromEnv() || process.env.GEMINI_API_KEY || '';

                const systemPrompt = `You are ArenaAssistant, an intelligent AI Copilot for the FIFA World Cup 2026.
You are helping fans and tournament staff inside the stadium. 
Respond in the language matching code "${currentLang}".
Keep responses helpful, precise, action-oriented, and less than 4 sentences.
Here is the chat history:
${messages.map((m: any) => `${m.role === 'user' ? 'Fan' : 'AI'}: ${m.text}`).join('\n')}
AI:`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }]
                  })
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Gemini REST API error: ${response.status} - ${errorText}`);
                }

                const resData: any = await response.json();
                const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ text: responseText }));
              } catch (err: any) {
                console.error("Vite Chat API Middleware Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          if (req.url?.startsWith('/api/copilot') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { telemetry, currentLang } = JSON.parse(body);
                const apiKey = getApiKeyFromEnv() || process.env.GEMINI_API_KEY || '';

                const prompt = `You are the ArenaOS Stadium Operations Co-Pilot for the FIFA World Cup 2026.
Given the following live stadium telemetry:
- Crowd Count: ${telemetry.crowdCount} / ${telemetry.capacity} fans
- Energy Grid Load: ${telemetry.energyUsage} kW
- Gate Check-in Flow: ${telemetry.gateFlow} check-ins/min

Generate a JSON array of 3 distinct, highly action-oriented operational recommendations for stadium managers.
Respond in the language matching code "${currentLang}".
Return ONLY a valid JSON array matching this exact structure:
[
  {
    "id": "rec-1",
    "category": "crowd",
    "title": "Short title",
    "description": "Short explanation",
    "impact": "High",
    "actionLabel": "Button action text"
  }
]`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                      responseMimeType: 'application/json'
                    }
                  })
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Gemini REST API error: ${response.status} - ${errorText}`);
                }

                const resData: any = await response.json();
                const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(responseText);
              } catch (err: any) {
                console.error("Vite Copilot API Middleware Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          if (req.url?.startsWith('/api/navigation') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { gate, section, currentLang } = JSON.parse(body);
                const apiKey = getApiKeyFromEnv() || process.env.GEMINI_API_KEY || '';

                const prompt = `You are the ArenaOS Stadium Navigation Guide for the FIFA World Cup 2026 at MetLife Stadium.
Generate step-by-step route directions from the entrance "${gate}" to the seat area "${section}".
Respond in the language matching code "${currentLang}".
The response must be a JSON array containing exactly 4 or 5 steps.
Each step object in the array must have "text" (a clear instruction) and "distance" (e.g. "10m", "40m").
Provide realistic details like passing stadium gates, scanning tickets, and following overhead section signs.

Return ONLY a valid JSON array matching this exact structure:
[
  {
    "text": "Step description here",
    "distance": "15m"
  }
]`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                      responseMimeType: 'application/json'
                    }
                  })
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Gemini REST API error: ${response.status} - ${errorText}`);
                }

                const resData: any = await response.json();
                const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(responseText);
              } catch (err: any) {
                console.error("Vite Navigation API Middleware Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          if (req.url?.startsWith('/api/eco') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { query, currentLang } = JSON.parse(body);
                const apiKey = getApiKeyFromEnv() || process.env.GEMINI_API_KEY || '';

                const prompt = `You are the ArenaOS Stadium Eco-Advisor for the FIFA World Cup 2026 at MetLife Stadium.
You help fans understand the stadium's sustainability programs, waste recycling rules (plastic cups, organic waste), and carbon offset points.
Answer the fan's query: "${query}"
Respond in the language matching code "${currentLang}".
Keep your response concise, friendly, helpful, and under 3 sentences. Include a positive environmental tip or FIFA Green points reference where possible.
AI Response:`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                  })
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Gemini REST API error: ${response.status} - ${errorText}`);
                }

                const resData: any = await response.json();
                const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ text: responseText }));
              } catch (err: any) {
                console.error("Vite Eco API Middleware Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
