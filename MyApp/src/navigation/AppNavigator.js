import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import SplashScreen from "../screens/splash/SplashScreen";
import Login from "../screens/auth/Login";
import OtpScreen from "../screens/otp/OtpScreen";
import LocationSelection from "../screens/location/LocationScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import MyAddressesScreen from "../screens/profile/MyAddressesScreen";
import MyReviewsScreen from "../screens/profile/MyReviewsScreen";
import HelpSupportScreen from "../screens/profile/HelpSupportScreen";
import TermsPrivacyScreen from "../screens/profile/TermsPrivacyScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
          <Stack.Screen name="Location" component={LocationSelection} />
          <Stack.Screen name="MyAddresses" component={MyAddressesScreen} />
          <Stack.Screen name="EditProfile" component={require("../screens/profile/EditProfileScreen").default} />
          <Stack.Screen name="MyReviews" component={MyReviewsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="TermsPrivacy" component={TermsPrivacyScreen} />
        </>
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
