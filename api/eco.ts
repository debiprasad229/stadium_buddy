export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { query, currentLang } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query payload' });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';

  try {
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

    const resData = await response.json();
    const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ text: responseText });
  } catch (error: any) {
    console.error('Secure Eco Serverless API Error:', error);
    return res.status(500).json({ error: error.message || 'Error generating Eco-Advisor response' });
  }
}
