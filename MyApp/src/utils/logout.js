import * as SecureStore from "expo-secure-store";

export const logout = async () => {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("expiresAt");
  await SecureStore.deleteItemAsync("locationCompleted");
};
