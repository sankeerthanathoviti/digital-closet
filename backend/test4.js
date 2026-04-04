require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY.replace(/['"]/g, ''); // strip quotes just in case

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: "reply hello." }] }]
  };
  try {
     const res = await fetch(url, {
       method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
     });
     const data = await res.json();
     console.log("RESPONSE:", JSON.stringify(data, null, 2));
  } catch(e) {
     console.log("FETCH ERRROR:", e);
  }
}
test();
