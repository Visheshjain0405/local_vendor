import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const { logout, userData } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const accountItems = [
    { icon: "location-sharp", label: "My Addresses", color: "#F97316", route: "MyAddresses", iconBg: "#FFF7ED" },
    { icon: "card", label: "Payment Methods", color: "#A855F7", iconBg: "#F3E8FF" },
  ];

  const activityItems = [
    { icon: "time", label: "Booking History", color: "#3B82F6", route: "Bookings", iconBg: "#EFF6FF" },
    { icon: "star", label: "My Reviews", color: "#EAB308", route: "MyReviews", iconBg: "#FEFCE8" },
  ];

  const supportItems = [
    { icon: "help-circle", label: "Help & Support", color: "#10B981", iconBg: "#ECFDF5" },
    { icon: "document-text", label: "Terms & Privacy Policy", color: "#64748B", iconBg: "#F1F5F9" },
  ];

  const renderSection = (title, items) => (
    <View className="mb-6 px-4">
      <Text className="text-gray-500 font-bold uppercase text-xs mb-3 ml-1 tracking-wider">
        {title}
      </Text>
      <View className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`flex-row items-center justify-between p-4 ${index !== items.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""
              }`}
            onPress={() => item.route && navigation.navigate(item.route)}
          >
            <View className="flex-row items-center">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: item.iconBg }}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View>
                <Text className="text-base font-medium text-light-text dark:text-dark-text">
                  {item.label}
                </Text>
                {item.subLabel && (
                  <Text className="text-xs text-light-muted dark:text-dark-muted">
                    {item.subLabel}
                  </Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-light-background dark:bg-dark-background">
      {/* Top Header Background */}



      {/* Header Content */}


      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1 -mt-12" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Top Header Background */}
          <View className="bg-[#0f1729] pt-12 pb-8 px-6 rounded-b-[30px] absolute top-0 left-0 right-0 h-[280px]" />

          {/* Header Content */}
          <View className="px-6 mt-16 mb-4 flex-row justify-between items-center z-10">
            <Text className="text-white text-2xl font-bold">Profile</Text>
            <TouchableOpacity className="relative">
              <Ionicons name="notifications" size={26} color="#fff" />
              <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f1729]" />
            </TouchableOpacity>
          </View>

          <View className="px-6 flex-row items-center mb-8 z-10">
            <View className="relative">
              <Image
                source={{ uri: userData?.profileImage || `https://ui-avatars.com/api/?name=${userData?.name || "Unknown"}&background=0f1729&color=fff&size=128` }}
                className="w-20 h-20 rounded-full border-2 border-gray-600"
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("EditProfile")}
                className="absolute bottom-0 right-0 bg-white w-7 h-7 rounded-full items-center justify-center border border-gray-200"
              >
                <Ionicons name="pencil" size={14} color="#000" />
              </TouchableOpacity>
            </View>
            <View className="ml-4">
              <View className="flex-row items-center">
                <Text className="text-white text-xl font-bold mr-1">{userData?.name || "Unknown User"}</Text>
                {/* Blue verify tick removed as requested */}
              </View>
              <Text className="text-gray-400 text-sm mb-2">{userData?.phone || ""}</Text>
              <View className="bg-gray-800/80 px-3 py-1 rounded-full flex-row items-center self-start">
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text className="text-white text-xs ml-1 font-medium">4.8 Rating</Text>
              </View>
            </View>
          </View>



          {/* Sections */}
          {renderSection("Account", accountItems)}
          {renderSection("Activity", activityItems)}

          {/* General Section with Custom Notification Toggle */}
          <View className="mb-6 px-4">
            <Text className="text-gray-500 font-bold uppercase text-xs mb-3 ml-1 tracking-wider">
              General
            </Text>
            <View className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              {/* Language Item */}
              <TouchableOpacity
                className="flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-[#FDF2F8]">
                    <Ionicons name="globe-outline" size={20} color="#EC4899" />
                  </View>
                  <View>
                    <Text className="text-base font-medium text-light-text dark:text-dark-text">Language</Text>
                    <Text className="text-xs text-light-muted dark:text-dark-muted">English (India)</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Notification Toggle */}
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-[#ECFDF5]">
                    <Ionicons name="notifications" size={20} color="#10B981" />
                  </View>
                  <Text className="text-base font-medium text-light-text dark:text-dark-text">Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#E5E7EB", true: "#0f1729" }}
                  thumbColor={"#fff"}
                />
              </View>
            </View>
          </View>

          {renderSection("Support & Legal", [
            { icon: "help-circle", label: "Help & Support", color: "#10B981", route: "HelpSupport", iconBg: "#DCFCE7" },
            { icon: "document-text", label: "Terms & Privacy Policy", color: "#64748B", route: "TermsPrivacy", iconBg: "#F1F5F9" },
          ])}

          {/* Logout Button */}
          <View className="px-4 mb-8">
            <TouchableOpacity
              onPress={logout}
              className="bg-white dark:bg-dark-surface border border-red-500 rounded-xl py-4 flex-row items-center justify-center shadow-sm"
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              <Text className="text-red-500 font-bold text-base ml-2">Log Out</Text>
            </TouchableOpacity>

            <View className="items-center mt-6">
              <Text className="text-gray-400 text-xs">Version 1.0.2</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-400 text-[10px]">Made with </Text>
                <Ionicons name="heart" size={10} color="#EF4444" />
                <Text className="text-gray-400 text-[10px]"> for India</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
