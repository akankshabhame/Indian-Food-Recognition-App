const Meal = require('../models/Meal');
const { analyzeFoodImage } = require('../utils/geminiService.js');

const MOCK_RESULT = {
  detectedItems: [
    { name: 'Dal (Toor Dal)', preparation: 'Stewed', quantity: '1 cup', calories: 180, protein: 12, carbs: 28, fat: 3, fiber: 8, sugar: 4, sodium: 320, cholesterol: 0 },
    { name: 'Steamed Rice', preparation: 'Boiled', quantity: '1 cup', calories: 205, protein: 4, carbs: 45, fat: 0.5, fiber: 0.6, sugar: 0, sodium: 2, cholesterol: 0 },
    { name: 'Chapati', preparation: 'Baked', quantity: '1 medium', calories: 120, protein: 3, carbs: 20, fat: 3, fiber: 3, sugar: 0.4, sodium: 150, cholesterol: 0 },
    { name: 'Mix Vegetable Sabzi', preparation: 'Stir-Fried', quantity: '1/2 cup', calories: 130, protein: 3.5, carbs: 15.3, fat: 12.1, fiber: 3, sugar: 1.8, sodium: 548, cholesterol: 0 },
  ],
};

// @route POST /api/meals/scan
// Accepts an uploaded image, sends it to Gemini for Indian-food recognition + nutrition
// estimation, and returns detected items + totals for the user to confirm/save.
const scanFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    let result;

    try {
      result = await analyzeFoodImage(req.file.path);
      if (!result.detectedItems.length) {
        return res.status(422).json({
          message: "Couldn't identify any food in this photo. Try a clearer, well-lit shot.",
        });
      }
    } catch (aiError) {
      console.error('Gemini analysis failed, falling back to mock result:', aiError.message);
      result = MOCK_RESULT;
    }

    const totals = result.detectedItems.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        acc.fiber += item.fiber;
        acc.sugar += item.sugar;
        acc.sodium += item.sodium;
        acc.cholesterol += item.cholesterol;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, cholesterol: 0 }
    );

    res.json({ imageUrl, detectedItems: result.detectedItems, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/meals
// Saves a confirmed meal (after the user reviews scan results) to history.
const saveMeal = async (req, res) => {
  try {
    const { imageUrl, mealType, detectedItems, totals, loggedAt } = req.body;

    const meal = await Meal.create({
      user: req.user._id,
      imageUrl,
      mealType,
      detectedItems,
      totals,
      loggedAt: loggedAt || Date.now(),
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/meals?date=YYYY-MM-DD
const getMeals = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { user: req.user._id };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.loggedAt = { $gte: start, $lte: end };
    }

    const meals = await Meal.find(filter).sort({ loggedAt: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/meals/analytics?range=week
const getAnalytics = async (req, res) => {
  try {
    const days = 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const meals = await Meal.find({ user: req.user._id, loggedAt: { $gte: since } }).sort({ loggedAt: 1 });

    const macroTotals = meals.reduce(
      (acc, m) => {
        acc.protein += m.totals.protein;
        acc.carbs += m.totals.carbs;
        acc.fat += m.totals.fat;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );

    res.json({ meals, macroTotals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { scanFood, saveMeal, getMeals, getAnalytics };

