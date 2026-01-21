import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../api/api";
import { useFocusEffect } from "@react-navigation/native";

const categoriesData = [
  { name: 'Plumbing', icon: 'wrench', color: '#3B82F6' },
  { name: 'Electrical', icon: 'flash', color: '#F59E0B' },
  { name: 'Cleaning', icon: 'broom', color: '#14B8A6' },
  { name: 'AC Repair', icon: 'air-conditioner', color: '#06B6D4' },
  { name: 'Painting', icon: 'format-paint', color: '#A855F7' },
  { name: 'Car Wash', icon: 'car-wash', color: '#6366F1' }
];

const ServiceRequestScreen = ({ route, navigation }) => {
  const { categoryName, categoryIcon, categoryColor, isIonicon } = route.params;

  // Initialize state with route params
  const [selectedCategory, setSelectedCategory] = useState({
    name: categoryName,
    icon: categoryIcon,
    color: categoryColor,
    isIonicon: isIonicon
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // Stores both images and documents
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000)
  ); // Tomorrow
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Tomorrow Morning");
  const [posting, setPosting] = useState(false);

  // Time slot options
  const timeSlots = ["As soon as possible", "Tomorrow Morning", "This Week"];

  const handleCategoryChange = (category) => {
    setSelectedCategory({
      name: category.name,
      icon: category.icon,
      color: category.color,
      isIonicon: category.icon === 'flash' // Assuming simplistic logic based on DashboardScreen, refine if needed. 
      // Actually capturing the logic from Dashboard: 'flash' is Ionicon, others seem to be MaterialCommunityIcons or mixed. 
      // Let's copy strictly: 'flash' -> Ionicons, others -> MaterialCommunityIcons
    });
    setShowCategoryModal(false);
  };



  // Fetch addresses when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/location");
      if (res.data.success) {
        setAddresses(res.data.locations);
        // Default select if not already selected
        if (!selectedAddress && res.data.locations.length > 0) {
          setSelectedAddress(res.data.locations[0]);
        }
      }
    } catch (err) {
      console.log("Error fetching addresses", err);
    }
  };

  // Handle image picking
  const pickImage = async () => {
    try {
      console.log("📸 pickImage started");
      if (images.length >= 5) {
        Alert.alert("Limit Reached", "You can only upload up to 5 photos.");
        return;
      }

      console.log("📸 Requesting permissions...");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("📸 Permission status:", status);

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library in settings to upload photos."
        );
        return;
      }

      console.log("📸 Launching image library...");
      // Launch picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const remainingSlots = 5 - images.length;
        // Take only as many new images as fit in the remaining slots
        const selectedAssets = result.assets.slice(0, remainingSlots);

        const newImages = selectedAssets.map((asset) => ({
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `photo_${Date.now()}.jpg`
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);

        if (result.assets.length > remainingSlots) {
          Alert.alert("Limit Reached", `Only ${remainingSlots} photo(s) were added to stay within the 5-photo limit.`);
        }
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "Failed to open photo picker: " + (error.message || error));
    }
  };

  const handleAttachmentSelection = () => {
    pickImage();
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Handle date change
  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle time change
  const onTimeChange = (event, time) => {
    setShowTimePicker(Platform.OS === "ios");
    if (time) {
      setSelectedTime(time);
    }
  };

  // Format date
  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  };

  // Format time
  const formatTime = (time) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Please describe your problem");
      return;
    }

    try {
      setPosting(true);

      const form = new FormData();

      console.log('Using category:', selectedCategory);

      form.append("categoryName", selectedCategory.name);
      form.append("categoryIcon", selectedCategory.icon);
      form.append("categoryColor", selectedCategory.color);
      form.append("description", description);

      form.append("preferredDate", selectedDate.toISOString());
      form.append("preferredTime", formatTime(selectedTime));
      form.append("timeSlot", selectedTimeSlot);

      if (selectedAddress) {
        form.append("address", JSON.stringify({
          fullAddress: selectedAddress.address.fullAddress,
          coordinates: selectedAddress.coordinates
        }));
      }

      // ✅ Images/Docs -> send as multipart files (key must be "images")
      images.forEach((file, index) => {
        const uri = file.uri;
        let filename = file.name || uri.split("/").pop() || `file_${index}`;
        let type = file.mimeType;

        if (!type) {
          const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
          if (ext === 'jpg' || ext === 'jpeg') type = 'image/jpeg';
          else if (ext === 'png') type = 'image/png';
          else if (ext === 'pdf') type = 'application/pdf';
          else type = 'application/octet-stream';
        }

        form.append("images", {
          uri,
          name: filename,
          type,
        });
      });

      const res = await api.post("/requests", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ REQUEST CREATED:", res.data);

      alert("Service request posted successfully!");
      navigation.goBack();
    } catch (err) {
      console.log("❌ REQUEST ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to post request");
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#0f1729" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-light-text dark:text-dark-text">
          New Request
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Category Display */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowCategoryModal(true)}
          className="bg-white dark:bg-dark-surface rounded-2xl p-5 mb-6 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{ backgroundColor: selectedCategory.color + "20" }}
            >
              {selectedCategory.isIonicon ? (
                <Ionicons name={selectedCategory.icon} size={32} color={selectedCategory.color} />
              ) : (
                <MaterialCommunityIcons
                  name={selectedCategory.icon}
                  size={32}
                  color={selectedCategory.color}
                />
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xs text-light-muted dark:text-dark-muted uppercase tracking-wide mb-1">
                CATEGORY
              </Text>
              <Text className="text-lg font-bold text-light-text dark:text-dark-text">
                {selectedCategory.name}
              </Text>
            </View>
          </View>
          <View>
            <Ionicons name="pencil" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>



        {/* Address Selection Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-light-text dark:text-dark-text mb-3">
            Service Location
          </Text>
          {addresses.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {addresses.map((addr, index) => {
                  const isSelected = selectedAddress?._id === addr._id;
                  return (
                    <TouchableOpacity
                      key={addr._id || index}
                      onPress={() => setSelectedAddress(addr)}
                      className={`mr-3 p-4 rounded-2xl border w-64 ${isSelected
                        ? "bg-primary border-primary"
                        : "bg-white dark:bg-dark-surface border-gray-200 dark:border-gray-700"
                        }`}
                    >
                      <View className="flex-row items-center mb-2">
                        <Ionicons
                          name={
                            addr.addressType === "home"
                              ? "home"
                              : addr.addressType === "office"
                                ? "briefcase"
                                : "location"
                          }
                          size={18}
                          color={isSelected ? "#fff" : "#6B7280"}
                        />
                        <Text
                          className={`ml-2 font-bold uppercase text-xs ${isSelected ? "text-white" : "text-gray-500"
                            }`}
                        >
                          {addr.addressType}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={2}
                        className={`text-sm ${isSelected
                          ? "text-white"
                          : "text-light-text dark:text-dark-text"
                          }`}
                      >
                        {addr.address.fullAddress || `${addr.address.houseNo}, ${addr.address.roadArea}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  onPress={() => navigation.navigate("Location")} // Assuming "Location" is the route name for LocationScreen
                  className="mr-3 p-4 rounded-2xl border bg-white dark:bg-dark-surface border-dashed border-gray-300 dark:border-gray-700 w-24 items-center justify-center"
                >
                  <Ionicons name="add" size={24} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 mt-1">Add New</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("Location")}
              className="bg-white dark:bg-dark-surface rounded-2xl p-4 flex-row items-center border border-gray-200 dark:border-gray-700"
            >
              <View className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mr-3">
                <Ionicons name="location" size={20} color="#0f1729" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-light-text dark:text-dark-text">
                  Add Service Location
                </Text>
                <Text className="text-sm text-light-muted dark:text-dark-muted">
                  Please select where you need service
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Description Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-light-text dark:text-dark-text mb-3">
            What do you need help with?
          </Text>
          <View className="bg-white dark:bg-dark-surface rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <TextInput
              placeholder="Describe the issue in detail, e.g. The kitchen sink pipe is leaking water..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={setDescription}
              className="text-light-text dark:text-dark-text text-base"
              style={{ minHeight: 120, textAlignVertical: "top" }}
            />
          </View>
        </View>

        {/* Photos Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-light-text dark:text-dark-text mb-3">
            Photos
          </Text>

          {images.length > 0 ? (
            <View className="mb-4">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                  {images.map((item, index) => (
                    <View key={index} className="relative mr-3">
                      <Image
                        source={{ uri: item.uri }}
                        className="w-24 h-24 rounded-xl"
                      />
                      <TouchableOpacity
                        className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close" size={14} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {images.length < 5 && (
                    <TouchableOpacity
                      className="w-24 h-24 rounded-xl bg-white dark:bg-dark-surface border-2 border-dashed border-gray-300 items-center justify-center ml-2"
                      onPress={handleAttachmentSelection}
                    >
                      <Ionicons name="add" size={32} color="#9CA3AF" />
                      <Text className="text-[10px] text-gray-500 mt-1">Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-white dark:bg-dark-surface rounded-2xl p-8 items-center border-2 border-dashed border-gray-300"
              onPress={handleAttachmentSelection}
            >
              <View className="items-center">
                <View className="mb-3">
                  <Ionicons name="images-outline" size={48} color="#9CA3AF" />
                  <View className="absolute -top-1 -right-1 bg-white rounded-full">
                    <Ionicons name="add-circle" size={20} color="#0f1729" />
                  </View>
                </View>
                <Text className="text-base font-bold text-light-text dark:text-dark-text mb-1">
                  Add Photos
                </Text>
                <Text className="text-sm text-light-muted dark:text-dark-muted text-center">
                  Upload up to 5 photos to help{"\n"}the provider understand the issue
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Schedule Section */}
        <View className="mb-8">
          <Text className="text-base font-bold text-light-text dark:text-dark-text mb-3">
            When do you need this?
          </Text>

          {/* Date and Time Row */}
          <View className="flex-row mb-3">
            <TouchableOpacity
              className="flex-1 bg-white dark:bg-dark-surface rounded-2xl p-4 mr-2 flex-row items-center border border-gray-200 dark:border-gray-700"
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              <Text className="text-base text-light-text dark:text-dark-text ml-2 font-medium">
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white dark:bg-dark-surface rounded-2xl p-4 ml-2 flex-row items-center border border-gray-200 dark:border-gray-700"
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#9CA3AF" />
              <Text className="text-base text-light-text dark:text-dark-text ml-2 font-medium">
                {formatTime(selectedTime)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Time Slot Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-5 py-3 rounded-full mr-2 ${selectedTimeSlot === slot
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700"
                    }`}
                  onPress={() => setSelectedTimeSlot(slot)}
                >
                  <Text
                    className={`text-sm font-medium ${selectedTimeSlot === slot
                      ? "text-light-text dark:text-dark-text"
                      : "text-light-muted dark:text-dark-muted"
                      }`}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
          />
        )}

        {/* Submit Button */}
        <View className="mb-8">
          <TouchableOpacity
            className={`bg-primary dark:bg-light-text rounded-2xl p-5 flex-row items-center justify-center ${posting ? "opacity-60" : ""
              }`}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={posting}
          >
            <Text className="text-white text-lg font-bold mr-2">
              {posting ? "Posting..." : "Post Request"}
            </Text>
            {!posting && (
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCategoryModal(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white dark:bg-dark-surface rounded-t-3xl p-5 h-[50%]">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-bold text-light-text dark:text-dark-text">
                    Select Category
                  </Text>
                  <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                    <Ionicons name="close-circle" size={30} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={categoriesData}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleCategoryChange(item)}
                      className="flex-row items-center p-4 border-b border-gray-100 dark:border-gray-800"
                    >
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: item.color + "20" }}
                      >
                        {item.icon === 'flash' ? (
                          <Ionicons name={item.icon} size={20} color={item.color} />
                        ) : (
                          <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
                        )}
                      </View>
                      <Text className="text-lg text-light-text dark:text-dark-text font-medium">
                        {item.name}
                      </Text>
                      {selectedCategory.name === item.name && (
                        <View className="ml-auto">
                          <Ionicons name="checkmark-circle" size={24} color={item.color} />
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView >
  );
};

export default ServiceRequestScreen;
