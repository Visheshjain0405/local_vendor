import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MyReviewsScreen = ({ navigation }) => {
    const [activeFilter, setActiveFilter] = useState("All");

    const reviews = [
        {
            id: 1,
            service: "AC Repair & Service",
            provider: "Urban Clap",
            providerImage: "https://ui-avatars.com/api/?name=Urban+Clap&background=0D8ABC&color=fff",
            date: "12 Oct 2023",
            rating: 5,
            comment: "Excellent service! The technician was very professional and fixed the issue quickly. Highly recommended for AC servicing.",
            verified: true
        },
        {
            id: 2,
            service: "Deep Home Cleaning",
            provider: "CleanPro Services",
            providerImage: "https://ui-avatars.com/api/?name=Clean+Pro&background=10B981&color=fff",
            date: "05 Sep 2023",
            rating: 4,
            comment: "Good job, but they arrived a bit late. The cleaning quality was top-notch though, especially the kitchen and bathroom deep clean.",
            verified: true,
            response: "We apologize for the delay! We're glad you liked the service quality."
        },
    ];

    const renderStars = (rating) => {
        return (
            <View className="flex-row">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : "star-outline"}
                        size={14}
                        color="#F59E0B"
                        style={{ marginRight: 2 }}
                    />
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#0f1729" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-light-text dark:text-dark-text">My Reviews</Text>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                {/* Stats Summary - Optional */}
                <View className="bg-[#0f1729] rounded-2xl p-6 mb-8 flex-row justify-between items-center shadow-lg">
                    <View>
                        <Text className="text-white text-3xl font-bold">4.8</Text>
                        <Text className="text-gray-400 text-sm">Average Rating</Text>
                    </View>
                    <View className="h-10 w-[1px] bg-gray-700" />
                    <View>
                        <Text className="text-white text-3xl font-bold">12</Text>
                        <Text className="text-gray-400 text-sm">Total Reviews</Text>
                    </View>
                    <View className="h-10 w-[1px] bg-gray-700" />
                    <View>
                        <Text className="text-white text-3xl font-bold">5</Text>
                        <Text className="text-gray-400 text-sm">Services</Text>
                    </View>
                </View>

                <Text className="text-lg font-bold mb-4 text-light-text dark:text-dark-text">Recent Reviews</Text>

                {reviews.map((review) => (
                    <View key={review.id} className="bg-white dark:bg-dark-surface p-5 rounded-2xl mb-4 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">

                        {/* Header Section */}
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-row items-center flex-1 mr-2">
                                <Image source={{ uri: review.providerImage }} className="w-10 h-10 rounded-full mr-3" />
                                <View>
                                    <Text className="font-bold text-base text-light-text dark:text-dark-text" numberOfLines={1}>{review.service}</Text>
                                    <Text className="text-xs text-light-muted dark:text-dark-muted">{review.provider} • {review.date}</Text>
                                </View>
                            </View>
                            <View className="bg-yellow-50 px-2 py-1 rounded-lg items-center">
                                <Text className="text-sm font-bold text-yellow-600">{review.rating}.0</Text>
                            </View>
                        </View>

                        {/* Stars */}
                        <View className="mb-2">
                            {renderStars(review.rating)}
                        </View>

                        {/* Review Text */}
                        <Text className="text-gray-600 dark:text-gray-300 text-sm leading-5 mb-3">{review.comment}</Text>

                        {/* Provider Response */}
                        {review.response && (
                            <View className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border-l-2 border-primary mt-2">
                                <Text className="text-xs font-bold text-primary mb-1">Response from Provider</Text>
                                <Text className="text-xs text-gray-500 dark:text-gray-400 italic">"{review.response}"</Text>
                            </View>
                        )}
                    </View>
                ))}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default MyReviewsScreen;
