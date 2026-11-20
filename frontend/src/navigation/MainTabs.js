import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from '../screens/HomeScreen';
import MealHistoryScreen from '../screens/MealHistoryScreen';
import ScanFoodScreen from '../screens/ScanFoodScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const icons = { Home: <Ionicons
            name="home"
            size={40}
            color="#5D2BDA"
          />, 
                      History: <Ionicons
                      name="clipboard-outline"
                      size={35}
                      color="#5D2BDA"
                    />, 
            Scan: <Ionicons
            name="camera"
            size={40}
            color="#5D2BDA"
          />, 
            Analytics: <Ionicons
            name="stats-chart-outline"
            size={40}
            color="#5D2BDA"
          />,
           Profile: <Ionicons
            name="person-outline"
            size={40}
            color="#5D2BDA"
          /> };

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#9a3eeb",
        tabBarInactiveTintColor: "#d1d3d7",
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{icons[route.name]}</Text>,
         tabBarStyle: {
      backgroundColor: COLORS.cardDark, // 👈 changes white background
      borderTopColor: "#16294B",
      borderTopWidth: 1,
    },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={MealHistoryScreen} />
      <Tab.Screen name="Scan" component={ScanFoodScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
