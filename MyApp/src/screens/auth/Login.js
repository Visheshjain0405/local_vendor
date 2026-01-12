import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../../api/api";

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
];

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const brandName = process.env.EXPO_PUBLIC_BRAND_NAME || "ExpertPro";

  const navigation = useNavigation();

  const handleGetOTP = async () => {
    if (mobileNumber.length < 10) return;

    try {
      const phone = `${selectedCountry.code}${mobileNumber}`;
      console.log("📞 Requesting OTP for:", phone);
      console.log("🌐 Backend:", process.env.EXPO_PUBLIC_BACKEND_URL);
      const res = await api.post("/auth/send-otp", {
        phone,
        role: "user",
      });

      console.log("OTP API Response:", res.data);

      navigation.navigate("Otp", {
        phone,
        devOtp: res.data.otp || null, // DEV only
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-light-background dark:bg-dark-background"
      >
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-full max-w-md">
            {/* Logo Section */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center mb-4 shadow-lg">
                <Ionicons name="shield-checkmark" size={40} color="#ffffff" />
              </View>
              <Text className="text-3xl font-bold text-light-text dark:text-dark-text mb-2 text-center">
                {brandName}
              </Text>
              <Text className="text-xl font-semibold text-light-text dark:text-dark-text mb-2 text-center">
                Welcome Back
              </Text>
              <Text className="text-sm text-light-muted dark:text-dark-muted text-center mt-1 px-4">
                Find the best local experts for your needs.
              </Text>
            </View>

            {/* Mobile Number Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-2 ml-1">
                Phone Number
              </Text>
              <View className="bg-light-surface dark:bg-dark-surface rounded-xl flex-row items-center border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                {/* Country Code Selector */}
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  className="flex-row items-center px-4 py-4 border-r border-gray-200 dark:border-gray-700"
                  activeOpacity={0.7}
                >
                  <Text className="text-2xl mr-2">{selectedCountry.flag}</Text>
                  <Text className="text-base font-semibold text-light-text dark:text-dark-text mr-1">
                    {selectedCountry.code}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6b7280" />
                </TouchableOpacity>

                {/* Phone Input */}
                <TextInput
                  className="flex-1 px-4 py-4 text-base text-light-text dark:text-dark-text"
                  placeholder="98765 43210"
                  placeholderTextColor="#9ca3af"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Get OTP Button */}
            <TouchableOpacity
              onPress={handleGetOTP}
              className={`bg-primary rounded-xl py-4 items-center justify-center mb-8 shadow-lg ${
                mobileNumber.length < 10 ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
              disabled={mobileNumber.length < 10}
            >
              <View className="flex-row items-center">
                <Text className="text-white text-base font-semibold mr-2">
                  Get OTP
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              </View>
            </TouchableOpacity>

            {/* Terms and Privacy */}
            <View className="px-4">
              <Text className="text-xs text-center text-light-muted dark:text-dark-muted leading-5">
                By continuing, you agree to our{" "}
                <Text className="font-semibold text-light-text dark:text-dark-text">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="font-semibold text-light-text dark:text-dark-text">
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowCountryPicker(false)}
          />
          <View className="bg-light-surface dark:bg-dark-surface rounded-t-3xl max-h-[70%]">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-bold text-light-text dark:text-dark-text">
                Select Country
              </Text>
              <TouchableOpacity
                onPress={() => setShowCountryPicker(false)}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Country List */}
            <FlatList
              data={countryCodes}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryPicker(false);
                  }}
                  className="flex-row items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800"
                  activeOpacity={0.7}
                >
                  <Text className="text-2xl mr-4">{item.flag}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-light-text dark:text-dark-text">
                      {item.country}
                    </Text>
                  </View>
                  <Text className="text-base font-semibold text-light-muted dark:text-dark-muted">
                    {item.code}
                  </Text>
                  {selectedCountry.code === item.code && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#0f1729"
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Login;
