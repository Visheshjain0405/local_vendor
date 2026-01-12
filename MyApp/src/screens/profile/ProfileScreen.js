import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";

const ProfileScreen = () => {
  const { logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-bold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
