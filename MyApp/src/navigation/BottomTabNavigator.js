import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

// Import screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ServiceRequestScreen from '../screens/service/ServiceRequestScreen';
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Resolve Tailwind config to access theme colors
const fullConfig = resolveConfig(tailwindConfig);
const colors = fullConfig.theme.colors;

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen 
        name="ServiceRequest" 
        component={ServiceRequestScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Messages') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline';

          const color = focused 
            ? (isDark ? colors.dark.text : colors.primary)
            : (isDark ? colors.dark.muted : colors.light.muted);

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDark ? colors.dark.text : colors.primary,
        tabBarInactiveTintColor: isDark ? colors.dark.muted : colors.light.muted,
        tabBarStyle: {
          backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
          borderTopColor: isDark ? colors.dark.muted : colors.light.muted,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Bookings" component={DashboardScreen} />
      <Tab.Screen name="Messages" component={DashboardScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;