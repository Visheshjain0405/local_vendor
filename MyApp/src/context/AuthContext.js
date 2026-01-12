import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkSession = async () => {
    const token = await SecureStore.getItemAsync("token");
    const expiresAt = await SecureStore.getItemAsync("expiresAt");
    const locationCompleted = await SecureStore.getItemAsync("locationCompleted");

    if (
      token &&
      expiresAt &&
      Date.now() < Number(expiresAt) &&
      locationCompleted === "true"
    ) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  // 🔥 ADD THIS
  const completeOnboarding = async () => {
    await SecureStore.setItemAsync("locationCompleted", "true");
    setIsLoggedIn(true); // 🚀 THIS TRIGGERS NAVIGATION
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("expiresAt");
    await SecureStore.deleteItemAsync("locationCompleted");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
