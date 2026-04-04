require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY.replace(/['"]/g, '');

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  const body = {
    contents: [{
      parts: [
        { text: "Return {\"name\":\"test\", \"color\":\"blue\"}" }
      ]
    }]
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
