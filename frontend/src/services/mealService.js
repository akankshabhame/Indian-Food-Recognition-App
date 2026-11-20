import api, { BASE_URL } from './api';

// Resolve a relative /uploads/xxx.jpg path returned by the backend into a full URL
export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  const origin = BASE_URL.replace('/api', '');
  return `${origin}${imageUrl}`;
};

// Uploads a photo to the backend for AI recognition. Returns { imageUrl, detectedItems, totals }
export const scanFoodImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    name: 'meal.jpg',
    type: 'image/jpeg',
  });

  const { data } = await api.post('/meals/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Saves a confirmed meal to history
export const saveMeal = async ({ imageUrl, mealType, detectedItems, totals, loggedAt }) => {
  const { data } = await api.post('/meals', { imageUrl, mealType, detectedItems, totals, loggedAt });
  return data;
};

// Fetches meals, optionally filtered by date (YYYY-MM-DD)
export const getMeals = async (date) => {
  const { data } = await api.get('/meals', { params: date ? { date } : {} });
  return data;
};

// Fetches last-7-days analytics
export const getAnalytics = async () => {
  const { data } = await api.get('/meals/analytics');
  return data;
};

// Infers a meal type from current time of day, matching the mockup's meal buckets
export const inferMealType = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 11) return 'Breakfast';
  if (hour < 16) return 'Lunch';
  if (hour < 19) return 'Evening Snack';
  return 'Dinner';
};
