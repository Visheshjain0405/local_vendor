import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import api from "../../api/api";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../context/AuthContext";

const OtpScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const route = useRoute();
  const navigation = useNavigation();
  const { completeOnboarding } = useAuth();

  const { phone, devOtp } = route.params;
  console.log("Received phone:", phone);

  const brandName = process.env.EXPO_PUBLIC_BRAND_NAME || "ExpertPro";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) return;

    try {
      const res = await api.post("/auth/verify-otp", {
        phone,
        otp: otpCode,
      });

      console.log("✅ OTP VERIFIED:", res.data);

      // 🔐 Save token securely
      const sessionHours = Number(process.env.EXPO_PUBLIC_SESSION_HOURS || 1);
      const expiresAt = Date.now() + sessionHours * 60 * 60 * 1000;

      await SecureStore.setItemAsync("token", res.data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(res.data.user));
      await SecureStore.setItemAsync("expiresAt", expiresAt.toString());

      // ✅ NOW CHECK IF LOCATION ALREADY EXISTS IN DB
      try {
        const locRes = await api.get("/location");
        const hasLocation = (locRes.data?.locations?.length || 0) > 0;

        if (hasLocation) {
          await completeOnboarding(); // ✅ This will switch stack to MainApp automatically
          return; // ✅ stop here (don't navigate)
        } else {
          navigation.replace("Location");
        }
      } catch (e) {
        // If location check fails, send user to Location screen safely
        navigation.replace("Location");
      }
    } catch (err) {
      console.log("❌ OTP ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResendOTP = () => {
    if (canResend) {
      console.log("Resending OTP");
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      // Handle resend OTP logic here
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-light-background dark:bg-dark-background"
      >
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-full max-w-md">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="absolute top-[-80px] left-0 w-10 h-10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#0f1729" />
            </TouchableOpacity>

            {/* Logo Section */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center mb-4 shadow-lg">
                <Ionicons name="shield-checkmark" size={40} color="#ffffff" />
              </View>
              <Text className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
                {brandName}
              </Text>
              <Text className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                Verify OTP
              </Text>
              <Text className="text-sm text-light-muted dark:text-dark-muted text-center mt-1 px-4">
                We've sent a 6-digit code to
              </Text>
              <Text className="text-sm font-semibold text-light-text dark:text-dark-text mt-1">
                {phone}
              </Text>

              {__DEV__ && devOtp ? (
  <View className="mt-4 bg-gray-100 rounded-xl px-4 py-3 w-full">
    <Text className="text-xs text-gray-500 text-center mb-1">
      DEV ONLY OTP
    </Text>

    <Text className="text-2xl font-bold text-center text-black tracking-widest">
      {devOtp}
    </Text>

    <TouchableOpacity
      className="mt-3 bg-primary rounded-lg py-2"
      onPress={() => setOtp(String(devOtp).split(""))}
      activeOpacity={0.8}
    >
      <Text className="text-white text-center font-semibold">
        Auto Fill OTP
      </Text>
    </TouchableOpacity>
  </View>
) : null}

            </View>

            {/* OTP Input */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-4 text-center">
                Enter OTP
              </Text>
              <View className="flex-row justify-between mb-6">
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="w-12 h-14 bg-light-surface dark:bg-dark-surface border-2 border-gray-200 dark:border-gray-700 rounded-xl text-center text-xl font-bold text-light-text dark:text-dark-text shadow-sm"
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    style={{
                      borderColor: digit ? "#0f1729" : "#e5e7eb",
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Timer and Resend */}
            <View className="flex-row items-center justify-center mb-8">
              {!canResend ? (
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text className="text-sm text-light-muted dark:text-dark-muted ml-1">
                    Resend OTP in{" "}
                    <Text className="font-semibold text-light-text dark:text-dark-text">
                      {timer}s
                    </Text>
                  </Text>
                </View>
              ) : (
                <TouchableOpacity onPress={handleResendOTP} activeOpacity={0.7}>
                  <Text className="text-sm font-semibold text-primary">
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              onPress={handleVerifyOTP}
              className={`bg-primary rounded-xl py-4 items-center justify-center mb-6 shadow-lg ${
                !isOtpComplete ? "opacity-50" : ""
              }`}
              activeOpacity={0.8}
              disabled={!isOtpComplete}
            >
              <View className="flex-row items-center">
                <Text className="text-white text-base font-semibold mr-2">
                  Verify OTP
                </Text>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
              </View>
            </TouchableOpacity>

            {/* Change Number */}
            <TouchableOpacity
              className="items-center"
              activeOpacity={0.7}
              onPress={() => navigation.replace("Login")}
            >
              <Text className="text-sm text-light-muted dark:text-dark-muted">
                Wrong number?{" "}
                <Text className="font-semibold text-light-text dark:text-dark-text">
                  Change Number
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default OtpScreen;
