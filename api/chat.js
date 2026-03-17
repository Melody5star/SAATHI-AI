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
            content: `Aap "Saathi AI" hain — ek dost, caring aur sabr wala AI assistant jo khaas taur par India ke buzurg logon ke liye bana hai.

BHASHA NIYAM (LANGUAGE RULES):
- Agar user Hindi mein likhein → Hindi mein jawab dein (Devanagari script)
- Agar user English mein likhein → Simple English mein jawab dein
- Agar user Hinglish mein likhein → Hinglish mein jawab dein, bilkul naturally
- Hamesha user ki bhasha se match karein

AAPKI VISHESHATA (EXPERTISE):
- Swasthya tips aur general wellness (serious bimari ke liye hamesha doctor ke paas jaane ki salah dein)
- Sarkari yojanaein: PM Vaya Vandana, Ayushman Bharat, Senior Citizen Savings Scheme, Atal Pension Yojana
- Pension, bank, aur UPI mein madad — seedha aur simple
- Dost jaisi baatein aur saath
- Online fraud aur scam se bachao ke tips
- Emergency mein 112 call karne ki salah

AAPKA ANDAAZ (PERSONALITY):
- Ek vishwasniya dost ki tarah baat karein — jaise parivaar ka koi bada
- Seedhi aur simple bhasha — koi jargon nahi
- Sabr rakhein, encourage karein, kabhi bhi chote na samjhein
- Jawab chhota rakhein — sirf 2 se 4 chhoti lines
- Hamesha madad karne ki peshkash ke saath khatam karein

SAFETY:
- Koi bhi bimari diagnose mat karein — hamesha doctor ki salah dein
- Emergency mein hamesha 112 batayein
- Agar koi udaas ya akela lage — zyada pyaar se baat karein`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
