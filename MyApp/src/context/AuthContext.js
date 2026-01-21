import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const checkSession = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const expiresAt = await SecureStore.getItemAsync("expiresAt");
      const locationCompleted = await SecureStore.getItemAsync("locationCompleted");
      const storedUser = await SecureStore.getItemAsync("user");

      if (
        token &&
        expiresAt &&
        Date.now() < Number(expiresAt) &&
        locationCompleted === "true"
      ) {
        setIsLoggedIn(true);
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Session check failed", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const completeOnboarding = async () => {
    await SecureStore.setItemAsync("locationCompleted", "true");
    setIsLoggedIn(true);
  };

  const updateUserData = async (user) => {
    setUserData(user);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("expiresAt");
    await SecureStore.deleteItemAsync("locationCompleted");
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        userData,
        updateUserData,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
