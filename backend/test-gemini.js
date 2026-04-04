require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.log("NO API KEY"); process.exit(1); }

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  const body = {
    contents: [{
      parts: [
        { text: "Return {\"hello\": \"world\"} as JSON." }
      ]
    }],
    generationConfig: { responseMimeType: "application/json" }
  };
  const res = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
