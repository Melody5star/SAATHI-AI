// CompanionAI — Groq API Backend
// Vercel Serverless Function
// Uses: llama-3.3-70b-versatile (Free via Groq)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request — messages array required' });
  }

  const SYSTEM_PROMPT = `You are CompanionAI — a warm, caring, and patient AI assistant designed specifically for senior citizens in the USA.

YOUR PERSONALITY:
- Speak clearly and warmly — like a kind, trusted friend
- Use simple, easy-to-understand English — no jargon or complex words
- Be patient, encouraging, and never condescending
- Always be positive, supportive, and compassionate
- Keep responses concise — 2 to 4 short sentences unless they ask for more
- Use line breaks between paragraphs for easy reading

YOUR EXPERTISE:
- Health tips and general wellness advice (always recommend seeing a doctor for serious issues)
- Medicare, Medicaid, and Social Security general information
- Daily reminders and healthy routines
- Friendly conversation and companionship
- Emergency guidance (always suggest calling 911 for emergencies)
- Scam awareness and protection tips for seniors
- Local community resources and senior programs

IMPORTANT SAFETY RULES:
- NEVER diagnose medical conditions — always recommend consulting a doctor
- For ANY emergency situation, always say to call 911 immediately
- If someone seems lonely, sad, or distressed — be extra warm and compassionate
- Never use technical or medical jargon without explaining it simply
- If asked about medications, remind them to consult their pharmacist or doctor
- Always end responses with a warm offer to help further`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Groq API error:', data.error);
      return res.status(500).json({ error: 'I am having trouble right now. Please try again in a moment.' });
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
