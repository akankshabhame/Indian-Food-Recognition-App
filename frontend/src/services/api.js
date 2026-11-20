import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// While developing locally with Expo Go on a physical device/emulator,
// 'localhost' won't reach your machine. Use your computer's LAN IP instead,
// e.g. http://192.168.1.5:5000/api. On Android emulator you can use 10.0.2.2.
export const BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
