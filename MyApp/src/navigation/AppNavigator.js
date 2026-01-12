import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import SplashScreen from "../screens/splash/SplashScreen";
import Login from "../screens/auth/Login";
import OtpScreen from "../screens/otp/OtpScreen";
import LocationSelection from "../screens/location/LocationScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="Location" component={LocationSelection} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
