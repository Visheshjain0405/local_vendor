import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // replace so user can't go back
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary items-center justify-center px-8">
      {/* Logo Container */}
      <View className="items-center mb-16">
        {/* Logo Box */}
        <View className="w-24 h-24 bg-[#1a2332] rounded-3xl items-center justify-center border-2 border-gray-700 mb-8">
          {/* Icon - You can replace this with an actual icon/image */}
          <View className="w-10 h-10 bg-white/10 rounded-lg items-center justify-center">
            <Text className="text-white text-2xl font-bold">🔧</Text>
          </View>
        </View>

        {/* App Name */}
        <Text className="text-white text-3xl font-bold mb-3">
          LocalServe
        </Text>

        {/* Tagline */}
        <Text className="text-gray-400 text-center text-base">
          Find Trusted Local Services Near You
        </Text>
      </View>

      {/* Loading Indicator */}
      <View className="mt-12">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>

      {/* Version Text */}
      <View className="absolute bottom-12">
        <Text className="text-gray-600 text-sm">
          v1.0.0
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;