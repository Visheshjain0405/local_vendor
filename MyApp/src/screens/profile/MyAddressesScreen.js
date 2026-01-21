import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../../api/api";
import { useFocusEffect } from "@react-navigation/native";

const MyAddressesScreen = ({ navigation }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await api.get("/location");
            if (response.data.success) {
                setAddresses(response.data.locations);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchAddresses();
        }, [])
    );

    const getIconProps = (type) => {
        switch (type?.toLowerCase()) {
            case "home":
                return { icon: "home", color: "#3B82F6", bg: "bg-blue-100 dark:bg-blue-900" };
            case "office":
                return { icon: "briefcase", color: "#A855F7", bg: "bg-purple-100 dark:bg-purple-900" };
            default:
                return { icon: "location", color: "#10B981", bg: "bg-green-100 dark:bg-green-900" };
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#0f1729" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-light-text dark:text-dark-text">My Addresses</Text>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View className="mt-10">
                        <ActivityIndicator size="large" color="#3B82F6" />
                    </View>
                ) : addresses.length === 0 ? (
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="map" size={64} color="#E5E7EB" />
                        <Text className="text-gray-500 mt-4">No addresses found.</Text>
                    </View>
                ) : (
                    addresses.map((addr) => {
                        const { icon, color, bg } = getIconProps(addr.addressType);
                        return (
                            <View key={addr._id} className="bg-white dark:bg-dark-surface p-5 rounded-2xl mb-4 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">

                                {/* Default Badge */}
                                {addr.isDefault && (
                                    <View className="absolute top-0 right-0 bg-primary/10 px-3 py-1 rounded-bl-xl border-l border-b border-primary/10">
                                        <Text className="text-[10px] font-bold text-primary uppercase">Default</Text>
                                    </View>
                                )}

                                <View className="flex-row items-start">
                                    {/* Icon */}
                                    <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${bg}`}>
                                        <Ionicons name={icon} size={22} color={color} />
                                    </View>

                                    {/* Details */}
                                    <View className="flex-1 pr-6">
                                        <View className="flex-row items-center mb-1">
                                            <Text className="font-bold text-base text-light-text dark:text-dark-text mr-2 capitalize">
                                                {addr.addressType}
                                            </Text>
                                        </View>
                                        <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5">
                                            {addr.address?.fullAddress || "No address details available"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default MyAddressesScreen;
