const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const MIME_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

const PROMPT = `You are a nutrition-estimation assistant specialized in Indian cuisine.
Look at this photo of a plate of food and identify every distinct Indian dish visible
(e.g. vada pav, chai, bhindi masala, dal, chapati, biryani, dosa, paneer tikka, idli, sambar, etc.) -
not just common thali items. For each dish, identify its likely cooking/preparation style
(e.g. "Deep-Fried", "Stewed", "Tandoori", "Steamed", "Stir-Fried", "Grilled", "Boiled") and
estimate a realistic serving quantity and its nutrition based on typical Indian home/restaurant portions.

Respond with ONLY a JSON array (no markdown, no prose) where each item has this exact shape:
{
  "name": string,
  "preparation": string,
  "quantity": string,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "sugar": number,
  "sodium": number,
  "cholesterol": number
}
Nutrition values are per the stated quantity, in grams for protein/carbs/fat/fiber/sugar,
milligrams for sodium/cholesterol, and kcal for calories. If the image contains no identifiable
food, return an empty array [].`;

async function analyzeFoodImage(imagePath) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in .env');
  }

  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'image/jpeg';
  const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

  const body = {
    contents: [
      {
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mimeType, data: base64Image } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  };

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 404) {
      throw new Error(
        `Gemini model "${GEMINI_MODEL}" is not available (404). Google periodically retires model ` +
        `names - check https://ai.google.dev/gemini-api/docs/models for a current model ID and set ` +
        `GEMINI_MODEL in .env accordingly. Raw error: ${errText}`
      );
    }
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini returned no content');
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error('Gemini returned malformed JSON: ' + text.slice(0, 200));
  }

  const detectedItems = (Array.isArray(parsed) ? parsed : []).map((item) => ({
    name: String(item.name || 'Unknown item'),
    preparation: String(item.preparation || ''),
    quantity: String(item.quantity || ''),
    calories: Number(item.calories) || 0,
    protein: Number(item.protein) || 0,
    carbs: Number(item.carbs) || 0,
    fat: Number(item.fat) || 0,
    fiber: Number(item.fiber) || 0,
    sugar: Number(item.sugar) || 0,
    sodium: Number(item.sodium) || 0,
    cholesterol: Number(item.cholesterol) || 0,
  }));

  return { detectedItems };
}

module.exports = { analyzeFoodImage };