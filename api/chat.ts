import type { IncomingMessage } from 'http';

interface ChatRequest extends IncomingMessage {
  body: {
    messages?: Array<{ role: string; text: string }>;
    currentLang?: string;
  };
}

interface ChatResponse {
  status: (code: number) => ChatResponse;
  json: (data: { text?: string; error?: string }) => void;
  setHeader: (name: string, value: string[]) => ChatResponse;
}

export default async function handler(req: ChatRequest, res: ChatResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { messages, currentLang } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid or missing messages payload' });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';

  try {
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

    const resData = await response.json();
    const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ text: responseText });
  } catch (error) {
    console.error('Secure Serverless API Error:', error);
    const message = error instanceof Error ? error.message : 'Error generating AI content response';
    return res.status(500).json({ error: message });
  }
}
