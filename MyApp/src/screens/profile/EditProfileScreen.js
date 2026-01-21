import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const EditProfileScreen = ({ navigation }) => {
    const { userData, updateUserData } = useAuth();
    const [name, setName] = useState(userData?.name || "");
    const [image, setImage] = useState(userData?.profileImage || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userData) {
            setName(userData.name);
            setImage(userData.profileImage);
        }
    }, [userData]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to make this work!");
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Image Picker Error:", error);
            Alert.alert("Error", "Failed to open gallery");
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Name cannot be empty");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);

            if (image && (image.startsWith("file://") || image.startsWith("content://"))) {
                const filename = image.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                formData.append("profileImage", {
                    uri: image,
                    name: filename || "profile.jpg",
                    type,
                });
            }

            // NOTE: We MUST override the default 'application/json' Content-Type
            const response = await api.put("/auth/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // This overrides the instance default
                },
                transformRequest: (data, headers) => {
                    // React Native Axios: return data as-is to let the native networking handle FormData
                    return data;
                },
            });

            if (response.data.success) {
                updateUserData(response.data.user);
                Alert.alert("Success", "Profile updated successfully");
                navigation.goBack();
            }
        } catch (error) {
            console.error("Update profile error:", error);
            const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-dark-background">
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#0f1729" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</Text>
                <View className="w-6" />
            </View>

            <ScrollView className="flex-1 px-6 pt-8">
                <View className="items-center mb-8">
                    <TouchableOpacity onPress={pickImage} className="relative">
                        <View className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden">
                            {image ? (
                                <Image source={{ uri: image }} className="w-full h-full" />
                            ) : (
                                <Ionicons name="camera" size={40} color="#9CA3AF" />
                            )}
                        </View>
                        <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border border-white">
                            <Ionicons name="pencil" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="mt-4 text-sm text-gray-500">Tap to change profile picture</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Full Name</Text>
                    <TextInput
                        className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                        placeholder="Enter your full name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Mobile Number (Read Only) */}
                <View className="mb-6">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Mobile Number</Text>
                    <View className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <Text className="text-gray-500 dark:text-gray-400">{userData?.phone}</Text>
                    </View>
                </View>

            </ScrollView>

            <View className="p-6 border-t border-gray-100 dark:border-gray-800">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className="bg-primary py-4 rounded-xl items-center shadow-lg shadow-blue-500/30"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default EditProfileScreen;
