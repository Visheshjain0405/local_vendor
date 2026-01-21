import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const HelpSupportScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const contactOptions = [
        {
            icon: "call",
            color: "#3B82F6",
            bg: "#EFF6FF",
            title: "Customer Care",
            subtitle: "+91 98765 43210",
            action: () => Linking.openURL(`tel:+919876543210`)
        },
        {
            icon: "logo-whatsapp",
            color: "#25D366",
            bg: "#DCFCE7",
            title: "WhatsApp Support",
            subtitle: "Chat with us",
            action: () => Linking.openURL(`whatsapp://send?phone=+919876543210`)
        },
        {
            icon: "mail",
            color: "#F59E0B",
            bg: "#FEF3C7",
            title: "Email Us",
            subtitle: "support@serviceapp.com",
            action: () => Linking.openURL('mailto:support@serviceapp.com')
        }
    ];

    const faqs = [
        { q: "How do I book a service?", a: "To book a service, simply navigate to the home screen, choose a category, select your preferred service, and proceed to checkout." },
        { q: "Can I reschedule my booking?", a: "Yes, you can reschedule your booking from the 'Bookings' section up to 4 hours before the scheduled time." },
        { q: "What is the refund policy?", a: "Refunds are processed within 5-7 business days for cancelled orders, subject to our cancellation policy." },
        { q: "How do I contact the service provider?", a: "Once a provider is assigned, you can call or chat with them directly from the booking details page." },
    ];

    const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#0f1729" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-light-text dark:text-dark-text">Help & Support</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    {/* Search */}
                    <View className="flex-row items-center bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-3 text-base text-light-text dark:text-dark-text"
                            placeholder="Search for help..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Contact Options */}
                    <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Contact Us</Text>
                    <View className="mb-8">
                        {contactOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={option.action}
                                className="bg-white dark:bg-dark-surface p-4 rounded-2xl mb-3 flex-row items-center border border-gray-100 dark:border-gray-800 shadow-sm"
                            >
                                <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: option.bg }}>
                                    <Ionicons name={option.icon} size={24} color={option.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-bold text-light-text dark:text-dark-text">{option.title}</Text>
                                    <Text className="text-sm text-gray-500">{option.subtitle}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* FAQs */}
                    <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Frequently Asked Questions</Text>
                    <View>
                        {filteredFaqs.map((item, index) => (
                            <View key={index} className="bg-white dark:bg-dark-surface p-5 rounded-2xl mb-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <Text className="font-bold text-base mb-2 text-light-text dark:text-dark-text text-primary">{item.q}</Text>
                                <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5">{item.a}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-10" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpSupportScreen;
