require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;

async function test() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    require('fs').writeFileSync('testout.json', JSON.stringify(data.models.map(m => m.name), null, 2));
  } catch (err) {
    console.log(err);
  }
}
test();
