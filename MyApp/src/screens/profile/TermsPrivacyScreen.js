import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const TermsPrivacyScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState("terms"); // 'terms' | 'privacy'

    const TermsContent = () => (
        <View>
            <Text className="text-light-muted dark:text-dark-muted text-sm mb-6">Last Updated: January 2024</Text>

            <View className="mb-6">
                <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-2">1. Introduction</Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 leading-6">
                    Welcome to our application. By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
                </Text>
            </View>

            <View className="mb-6">
                <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-2">2. Service Usage</Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 leading-6">
                    Our platform connects users with service providers. We are not responsible for the conduct, whether online or offline, of any user of the service. You are solely responsible for your interactions with other users.
                </Text>
            </View>

            <View className="mb-6">
                <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-2">3. User Accounts</Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 leading-6">
                    When you create an account with us, you must provide strictly accurate and complete information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                </Text>
            </View>

            <View className="mb-6">
                <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-2">4. Payments & Refunds</Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 leading-6">
                    All payments are processed securely. Refunds are subject to our refund policy, which is available on the booking details page. Cancellations made within 2 hours of the service time may incur a fee.
                </Text>
            </View>
        </View>
    );

    const PrivacyContent = () => (
        <View>
            <Text className="text-light-muted dark:text-dark-muted text-sm mb-6">Last Updated: January 2024</Text>

            <View className="mb-6">
                <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-2">1. Information Collection</Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 leading-6">
                    We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, and postal address.
                </Text>
            </View>

            <View className="mb-6">
                <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-2">2. How We Use Information</Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 leading-6">
                    We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, and authenticate users.
                </Text>
            </View>

            <View className="mb-6">
                <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-2">3. Data Security</Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 leading-6">
                    We implement appropriate technical and organizational measures to protect your personal data against accidental or unlawful destruction, loss, alteration, or damage.
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
            {/* Header */}
            <View className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-1">
                    <Ionicons name="arrow-back" size={24} color="#0f1729" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-light-text dark:text-dark-text">Legal</Text>
            </View>

            {/* Tabs */}
            <View className="px-6 py-4">
                <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <TouchableOpacity
                        onPress={() => setActiveTab("terms")}
                        className={`flex-1 py-3 rounded-lg items-center ${activeTab === "terms" ? "bg-white dark:bg-dark-surface shadow-sm" : ""}`}
                    >
                        <Text className={`font-semibold ${activeTab === "terms" ? "text-primary dark:text-white" : "text-gray-500"}`}>Terms of Service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab("privacy")}
                        className={`flex-1 py-3 rounded-lg items-center ${activeTab === "privacy" ? "bg-white dark:bg-dark-surface shadow-sm" : ""}`}
                    >
                        <Text className={`font-semibold ${activeTab === "privacy" ? "text-primary dark:text-white" : "text-gray-500"}`}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pb-6" showsVerticalScrollIndicator={false}>
                {activeTab === "terms" ? <TermsContent /> : <PrivacyContent />}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsPrivacyScreen;
