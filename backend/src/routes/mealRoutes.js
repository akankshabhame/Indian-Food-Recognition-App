const express = require('express');
const { scanFood, saveMeal, getMeals, getAnalytics } = require('../controllers/mealController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/scan', upload.single('image'), scanFood);
router.post('/', saveMeal);
router.get('/', getMeals);
router.get('/analytics', getAnalytics);

module.exports = router;
