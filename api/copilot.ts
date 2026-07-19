export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { telemetry, currentLang } = req.body;
  if (!telemetry) {
    return res.status(400).json({ error: 'Missing telemetry payload' });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';

  try {
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

    const resData = await response.json();
    const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    return res.status(200).send(responseText);
  } catch (error: any) {
    console.error('Secure Copilot Serverless API Error:', error);
    return res.status(500).json({ error: error.message || 'Error generating Copilot recommendations' });
  }
}
