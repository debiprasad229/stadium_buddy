import type { IncomingMessage } from 'http';

interface NavigationRequest extends IncomingMessage {
  body: {
    gate?: string;
    section?: string;
    currentLang?: string;
  };
}

interface NavigationResponse {
  status: (code: number) => NavigationResponse;
  send: (data: string) => void;
  json: (data: { error?: string }) => void;
  setHeader: (name: string, value: string[]) => NavigationResponse;
}

export default async function handler(req: NavigationRequest, res: NavigationResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { gate, section, currentLang } = req.body;
  if (!gate || !section) {
    return res.status(400).json({ error: 'Missing gate or section payload' });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';

  try {
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

    const resData = await response.json();
    const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    return res.status(200).send(responseText);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Secure Navigation Serverless API Error:', error);
    const message = error instanceof Error ? error.message : 'Error generating navigation recommendations';
    return res.status(500).json({ error: message });
  }
}
