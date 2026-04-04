require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY.replace(/['"]/g, '');

async function test() {
  const prompt = `You are a personal fashion advisor "Digital Closet AI Stylist". 
The user asks: "What should I wear today?"

Here is the user's current wardrobe:
No items in wardrobe yet.

Respond in JSON ONLY with exactly:
{
  "textResponse": "Your encouraging, stylish response.",
  "suggestedItemIds": ["id1", "id2"]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: "You must only suggest clothing that is actually present in the user's wardrobe." }] }
  };

  try {
     const res = await fetch(url, {
       method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
     });
     const data = await res.json();
     require('fs').writeFileSync('testout.json', JSON.stringify(data, null, 2));
  } catch(e) {
     require('fs').writeFileSync('testout.json', e.toString());
  }
}
test();
