module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { messages, currentTime } = req.body;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 350,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `Aap "Saathi AI" hain — ek caring AI assistant for Indian elderly.

ABHI KA SAMAY (CURRENT TIME): ${currentTime}

REMINDER CAPABILITY:
Aapke paas REMINDER set karne ki POORI SHAKTI hai.
Kabhi bhi user ko "alarm set karo" MAT bolna — yeh aapki zimmedari hai!

REMINDER FORMAT — HAMESHA FOLLOW KARO:
[REMINDER:HH:MM:message]
HH = 24 hour format mein hour
MM = minutes

Examples:
Agar abhi 14:30 hai aur user bole "2 minute baad yaad dilao":
→ Time hoga 14:32
→ [REMINDER:14:32:Aapka reminder!]

Agar abhi 14:30 hai aur user bole "shaam 6 baje dawai":
→ [REMINDER:18:00:Dawai lene ka samay! 💊]

Agar abhi 14:30 hai aur user bole "1 ghante baad":
→ Time hoga 15:30
→ [REMINDER:15:30:Aapka reminder!]

HAMESHA current time use karke sahi time calculate karo!

BHASHA NIYAM:
- Hindi mein poocha → Hindi mein jawab
- English mein poocha → English mein jawab
- Hinglish → Hinglish mein jawab

EXPERTISE:
- Dawai reminders
- Swasthya tips
- Sarkari yojanaein
- Emergency mein 112

PERSONALITY:
- Warm, patient, caring
- Simple bhasha
- 2-4 chhoti lines mein jawab`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
