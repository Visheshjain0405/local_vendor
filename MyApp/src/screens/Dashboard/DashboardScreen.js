import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from "../../context/AuthContext";

import api from "../../api/api";

const DashboardScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [currentLocation, setCurrentLocation] = React.useState("Locating...");

  React.useEffect(() => {
    fetchDefaultLocation();
  }, []);

  const fetchDefaultLocation = async () => {
    try {
      const response = await api.get("/location");
      if (response.data.success && response.data.locations.length > 0) {
        const defaultLoc = response.data.locations.find(l => l.isDefault) || response.data.locations[0];
        setCurrentLocation(`${defaultLoc.address.roadArea}, ${defaultLoc.address.city}`);
      } else {
        setCurrentLocation("Add Location");
      }
    } catch (e) {
      console.error("Loc fetch error", e);
      setCurrentLocation("Select Location");
    }
  }

  const categories = [
    { name: 'Plumbing', icon: 'wrench', color: '#3B82F6' },
    { name: 'Electrical', icon: 'flash', color: '#F59E0B' },
    { name: 'Cleaning', icon: 'broom', color: '#14B8A6' },
    { name: 'AC Repair', icon: 'air-conditioner', color: '#06B6D4' },
    { name: 'Painting', icon: 'format-paint', color: '#A855F7' },
    { name: 'Car Wash', icon: 'car-wash', color: '#6366F1' }
  ];

  const handleCategoryPress = (category) => {
    navigation.navigate('ServiceRequest', {
      categoryName: category.name,
      categoryIcon: category.icon,
      categoryColor: category.color
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
          <View className="flex-row items-center">
            <Ionicons name="location" size={24} color="#000" />
            <View className="ml-2">
              <Text className="text-xs text-light-muted dark:text-dark-muted">
                Current Location
              </Text>
              <View className="flex-row items-center">
                <Text className="text-base font-bold text-light-text dark:text-dark-text">
                  {currentLocation}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#000" className="ml-1" />
              </View>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3 relative">
              <Ionicons name="notifications-outline" size={26} color="#000" />
              <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
            >
              <Image
                source={{ uri: userData?.profileImage || `https://ui-avatars.com/api/?name=${userData?.name || "Unknown"}&background=FF6B35&color=fff&size=128` }}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View className="px-5 mt-3">
          <Text className="text-3xl font-bold text-light-text dark:text-dark-text">
            Hello, {userData?.name?.split(' ')[0] || "User"} 👋
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-5 mt-5">
          <View className="bg-white dark:bg-dark-surface rounded-xl px-4 py-3 flex-row items-center shadow-sm">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search for AC repair, painting..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-light-text dark:text-dark-text"
            />
          </View>
        </View>

        {/* Offer Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 px-5"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {/* Blue Offer Card */}
          <View className="w-80 bg-blue-600 rounded-3xl p-6 mr-4 relative overflow-hidden">
            <View className="absolute right-0 top-0 opacity-10">
              <MaterialCommunityIcons name="vacuum" size={180} color="#fff" />
            </View>
            <View className="bg-blue-700/50 px-3 py-1 rounded-full self-start mb-3">
              <Text className="text-white text-xs font-semibold">LIMITED OFFER</Text>
            </View>
            <Text className="text-white text-4xl font-bold mb-2">20% OFF</Text>
            <Text className="text-white text-base mb-4">On Deep Home Cleaning</Text>
            <TouchableOpacity className="bg-white px-6 py-3 rounded-full self-start">
              <Text className="text-blue-600 font-bold text-sm">Book Now</Text>
            </TouchableOpacity>
          </View>

          {/* Orange Offer Card */}
          <View className="w-80 bg-orange-500 rounded-3xl p-6 relative overflow-hidden">
            <View className="absolute right-0 top-0 opacity-10">
              <MaterialCommunityIcons name="format-paint" size={180} color="#fff" />
            </View>
            <View className="bg-orange-600/50 px-3 py-1 rounded-full self-start mb-3">
              <Text className="text-white text-xs font-semibold">SUMMER SPECIAL</Text>
            </View>
            <Text className="text-white text-4xl font-bold mb-2">Painting</Text>
            <Text className="text-white text-base mb-4">Refresh Your Home</Text>
            <TouchableOpacity className="bg-white px-6 py-3 rounded-full self-start">
              <Text className="text-orange-500 font-bold text-sm">View Plans</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Services Grid */}
        <View className="px-5 mt-8">
          <Text className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
            What are you looking for?
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleCategoryPress(category)}
                className="w-[48%] bg-white dark:bg-dark-surface rounded-2xl p-5 mb-4 items-center shadow-sm"
              >
                <View className="bg-gray-100 w-14 h-14 rounded-2xl items-center justify-center mb-3">
                  {category.icon === 'flash' ? (
                    <Ionicons name={category.icon} size={28} color={category.color} />
                  ) : (
                    <MaterialCommunityIcons name={category.icon} size={28} color={category.color} />
                  )}
                </View>
                <Text className="text-light-text dark:text-dark-text font-semibold text-base">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Request */}
        <View className="px-5 mt-4">
          <TouchableOpacity className="bg-primary dark:bg-dark-surface rounded-2xl p-5 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">
                Post a Custom Request
              </Text>
              <Text className="text-gray-300 text-sm">
                Can't find what you need? Let us know.
              </Text>
            </View>
            <View className="bg-white/20 w-10 h-10 rounded-full items-center justify-center">
              <Ionicons name="add" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Active Requests (Disabled/Grayed Out) */}
        <View className="px-5 mt-8 pb-6 opacity-40 pointer-events-none relative">
          {/* Overlay to prevent interactions */}
          <View className="absolute inset-0 z-10 bg-transparent" />

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-light-text dark:text-dark-text">
              Active Requests
            </Text>
            <TouchableOpacity disabled>
              <Text className="text-blue-600 font-semibold">See all</Text>
            </TouchableOpacity>
          </View>

          {/* Active Service Card */}
          <View className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm mb-4">
            <View className="flex-row items-start">
              <View className="bg-blue-50 w-12 h-12 rounded-xl items-center justify-center">
                <MaterialCommunityIcons name="air-conditioner" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1 ml-4">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-light-text dark:text-dark-text font-bold text-base">
                    AC Service & Repair
                  </Text>
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-600 text-xs font-bold">ARRIVING SOON</Text>
                  </View>
                </View>
                <Text className="text-light-muted dark:text-dark-muted text-sm">
                  Today, 2:00 PM
                </Text>
              </View>
            </View>

            {/* Technician Info */}
            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <View className="flex-row items-center flex-1">
                <Image
                  source={{ uri: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=3B82F6&color=fff&size=128' }}
                  className="w-10 h-10 rounded-full"
                />
                <View className="ml-3">
                  <Text className="text-light-text dark:text-dark-text font-semibold">
                    Rahul Kumar
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-light-muted dark:text-dark-muted text-xs">
                      Technician
                    </Text>
                    <Text className="text-light-muted dark:text-dark-muted text-xs mx-1">•</Text>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text className="text-light-text dark:text-dark-text text-xs font-semibold ml-1">
                      4.8
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center">
                <TouchableOpacity className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-2">
                  <Ionicons name="chatbubble-outline" size={18} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-green-500 w-10 h-10 rounded-full items-center justify-center">
                  <Ionicons name="call" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Completed Service Card */}
          <View className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-gray-100 w-12 h-12 rounded-xl items-center justify-center">
                  <MaterialCommunityIcons name="broom" size={24} color="#6B7280" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-light-text dark:text-dark-text font-bold text-base">
                    Home Deep Cleaning
                  </Text>
                  <Text className="text-light-muted dark:text-dark-muted text-sm">
                    Completed on May 12
                  </Text>
                </View>
              </View>
              <View className="bg-gray-100 w-8 h-8 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={18} color="#10B981" />
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default DashboardScreen;