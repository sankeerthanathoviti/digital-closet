const WardrobeItem = require('../models/WardrobeItem');
const ChatMessage = require('../models/ChatMessage');
const ChatSession = require('../models/ChatSession');

const analyzeImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ message: "No image provided" });

    // Ensure it's just the base64 data, not the prefix
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    // Attempt basic mime detection from base64 if needed, default to jpeg
    let mimeType = "image/jpeg";
    if (imageBase64.includes('image/png')) mimeType = "image/png";
    if (imageBase64.includes('image/webp')) mimeType = "image/webp";

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Analyze this clothing item in the image. Return a JSON object ONLY. Do not use Markdown formatting in the output. The keys must exactly be:
{
  "name": "A short beautiful descriptive name (e.g. Vintage Blue Denim Jacket, Slim Black Trousers)",
  "category": "(one of: Tops, Bottoms, Dresses, Shoes, Accessories, Outerwear)",
  "color": "(dominant color, e.g., 'Dusty Pink', 'Navy Blue', 'Charcoal')",
  "pattern": "(e.g., Solid, Floral, Striped, Plaid, Checkered)",
  "seasons": ["Spring", "Summer", "Fall", "Winter"] (output an array of strings depending on what seasons this fits)
}`;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Data } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) {
       console.error("Gemini API Error:", data.error);
       throw new Error(`Gemini Error: ${data.error.message}`);
    }
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean up markdown just in case
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(textResult);
    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ message: "sessionId is required" });
    const messages = await ChatMessage.find({ userId: req.user.id, sessionId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const chatStylist = async (req, res) => {
  try {
    const { message } = req.body;
    let { sessionId } = req.body;
    
    if (!sessionId) {
      const newSession = await ChatSession.create({
        userId: req.user.id,
        title: message.length > 30 ? message.substring(0, 30) + '...' : message
      });
      sessionId = newSession._id;
    }

    await ChatMessage.create({
      userId: req.user.id,
      sessionId,
      role: 'user',
      text: message
    });

    const items = await WardrobeItem.find({ userId: req.user.id });
    
    const recentMessages = await ChatMessage.find({ userId: req.user.id, sessionId }).sort({ createdAt: -1 }).limit(5);
    const discussionContext = recentMessages.reverse().map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');

    const wardrobeContext = items.map(i => `{ id: "${i._id}", category: "${i.category}", color: "${i.color}", pattern: "${i.pattern}", seasons: [${i.seasons.join(',')}] }`).join('\n');

    const prompt = `You are a personal fashion advisor "Digital Closet AI Stylist". 
Here is the recent conversation:
${discussionContext || 'No previous conversation'}

The user asks: "${message}"

Here is the user's current wardrobe:
${wardrobeContext || 'No items in wardrobe yet.'}

Respond in JSON ONLY with exactly:
{
  "textResponse": "Your encouraging, stylish response.",
  "suggestedItemIds": ["id1", "id2"] // ONLY include IDs of items from their wardrobe that you recommend.
}`;

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "You must only suggest clothing that is actually present in the user's wardrobe." }] }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(textResult);

    await ChatMessage.create({
      userId: req.user.id,
      sessionId,
      role: 'ai',
      text: parsed.textResponse || parsed.text || "Sorry, I had trouble thinking of an outfit.",
      suggestedItems: parsed.suggestedItemIds || []
    });

    res.json({ ...parsed, sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const planTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, occasion, weather } = req.body;
    const items = await WardrobeItem.find({ userId: req.user.id });
    
    // Provide stringified context of all user items
    const wardrobeContext = items.map(i => `{ id: "${i._id}", category: "${i.category}", color: "${i.color}", pattern: "${i.pattern}", seasons: [${i.seasons.join(',')}] }`).join('\n');

    const prompt = `You are a personal stylist and travel packing expert. 
The user is planning a trip.
Destination: ${destination}
Dates/Duration: ${startDate} to ${endDate}
Occasion: ${occasion || 'General travel'}
Weather/Climate: ${weather || 'Unknown'}

Here is the user's current wardrobe:
${wardrobeContext || 'No items in wardrobe yet.'}

Select a highly efficient capsule wardrobe tailored perfectly for this trip.
Respond in JSON ONLY with exactly:
{
  "summary": "Short 2-sentence explanation of why you picked these items for this destination and weather.",
  "tops": ["id1", "id2"],
  "bottoms": ["id3", "id4"],
  "shoes": ["id5"],
  "outerwear": ["id6"],
  "accessories": ["id7"]
}
(Only return IDs that exist in the user's wardrobe. Put the ID in the correct category array).`;

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "You must only suggest clothing that is actually present in the user's wardrobe." }] }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(textResult);

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



const gapDetection = async (req, res) => {
  try {
    const items = await WardrobeItem.find({ userId: req.user.id });
    const wardrobeContext = items.map(i => `${i.color} ${i.pattern} ${i.category} (${i.seasons.join(',')})`).join('\n');
    
    const prompt = `You are a fashion stylist evaluating a wardrobe. Look for "gaps" in the essentials (e.g. missing a basic white tee, formal bottoms, winter coat).
    Wardrobe:
    ${wardrobeContext || 'Empty'}
    
    Return a JSON array ONLY of up to 5 recommended items the user should buy. Format exactly like this:
    [
      { "itemName": "Crisp White Button-down", "category": "Tops" },
      { "itemName": "Black Tailored Trousers", "category": "Bottoms" }
    ]`;

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
    const data = await response.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    res.json(JSON.parse(textResult));
  } catch(err) { res.status(500).json({ message: err.message }); }
};

const searchWardrobe = async (req, res) => {
  try {
    const { query } = req.body;
    const items = await WardrobeItem.find({ userId: req.user.id });
    
    const wardrobeContext = items.map(i => `{ id: "${i._id}", data: "${i.color} ${i.pattern} ${i.category} ${i.seasons.join(' ')}" }`).join('\n');
    const prompt = `User search query: "${query}"
    Find items matching this query from the following wardrobe context:
    ${wardrobeContext}
    Return a JSON array ONLY with the exact item IDs that match. Format: ["id1", "id2"]
    If none match, return []`;

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
    const data = await response.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    let match = textResult.match(/\[[\s\S]*\]/);
    if(match) textResult = match[0];
    res.json(JSON.parse(textResult));
  } catch(err) { res.status(500).json({ message: err.message }); }
};

<<<<<<< HEAD
module.exports = { analyzeImage, chatStylist, getChatHistory, getChatSessions, planTrip, gapDetection, searchWardrobe, deleteChatSession };

=======
module.exports = { analyzeImage, chatStylist, getChatHistory, getChatSessions, planTrip, gapDetection, searchWardrobe };
>>>>>>> neworigin/main
