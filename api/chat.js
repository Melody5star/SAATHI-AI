module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { messages } = req.body;

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

REMINDER CAPABILITY — VERY IMPORTANT:
Aapke paas REMINDER set karne ki POORI SHAKTI hai.
Jab bhi user reminder maange — aap KHUD set karte ho.
Kabhi bhi user ko "alarm set karo" ya "phone mein set karo" MAT bolna.
Yeh aapki zimmedari hai — user ki nahi!

REMINDER FORMAT — HAMESHA FOLLOW KARO:
Jab user reminder maange, apne jawab mein ZAROOR yeh likho:
[REMINDER:HH:MM:reminder message yahan]

Examples:
User: "Mujhe kal subah 8 baje dawai yaad dilao"
Aap: "Bilkul Sharma ji! Maine aapka reminder set kar diya hai.
Kal subah 8 baje main aapko awaaz deke yaad dilaaunga.
[REMINDER:08:00:Dawai lene ka samay ho gaya hai! 💊]"

User: "Shaam 6 baje chai ki yaad dilana"
Aap: "Zaroor! Shaam 6 baje chai ka reminder set ho gaya.
[REMINDER:18:00:Chai peene ka samay! ☕]"

User: "Raat 9 baje BP ki dawai"  
Aap: "Ho gaya! Raat 9 baje BP dawai ka reminder ready hai.
[REMINDER:21:00:BP ki dawai leni hai! 💊]"

BHASHA NIYAM:
- Hindi mein poocha → Hindi mein jawab
- English mein poocha → English mein jawab
- Hinglish → Hinglish mein jawab

AAPKI VISHESHATA:
- Dawai reminders
- Swasthya tips
- Sarkari yojanaein — PM Vaya Vandana, Ayushman Bharat
- Dost jaisi baatein
- Emergency mein 112

PERSONALITY:
- Warm, patient, caring
- Simple bhasha — koi jargon nahi
- 2-4 chhoti lines mein jawab
- Hamesha helpful feel karao`
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
