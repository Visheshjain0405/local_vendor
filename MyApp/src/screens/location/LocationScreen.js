import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const { width, height } = Dimensions.get("window");

const LocationSelection = () => {
  // Form States
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [roadArea, setRoadArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [addressType, setAddressType] = useState("home"); // home | office | other


  // UI States
  const [loading, setLoading] = useState(false);
  const [isFullMapVisible, setIsFullMapVisible] = useState(false);

  // Map Region State
  const [region, setRegion] = useState({
    latitude: 21.1702,
    longitude: 72.8311,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const mapRef = useRef(null);
  const fullMapRef = useRef(null);

  const { completeOnboarding, isLoggedIn } = useAuth();
  const navigation = useNavigation();

  // Initial location fetch
  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  // Update address text when map moves
  const updateAddressFields = async (lat, lon) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });
      if (response.length > 0) {
        const addr = response[0];
        setCity(addr.city || addr.subregion || "");
        setRoadArea(`${addr.street || ""} ${addr.district || ""}`.trim());

        // Auto-fill landmark with nearby area
        if (addr.name || addr.subregion) {
          setLandmark(`Near ${addr.name || addr.subregion}`);
        }
      }
    } catch (e) {
      console.log("Reverse geocoding error:", e);
    }
  };

  // Search for a specific city/area
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const newRegion = { ...region, latitude, longitude };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        await updateAddressFields(latitude, longitude);
      } else {
        Alert.alert("Location not found", "Please try a different search term");
      }
    } catch (error) {
      Alert.alert("Error", "Search failed. Please try again.");
      console.log("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature"
        );
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const newReg = {
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setRegion(newReg);
      mapRef.current?.animateToRegion(newReg, 1000);
      await updateAddressFields(
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (error) {
      Alert.alert("Error", "Unable to get your location");
      console.log("Location error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndProceed = async () => {
    if (!isFormValid) {
      Alert.alert("Incomplete Form", "Please fill in all address fields");
      return;
    }

    const payload = {
      addressType,
      address: {
        city: city.trim(),
        houseNo: houseNo.trim(),
        roadArea: roadArea.trim(),
        landmark: landmark.trim(),
        fullAddress: `${houseNo}, ${roadArea}, ${landmark}, ${city}`,
      },
      coordinates: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
    };

    try {
      const res = await api.post("/location", payload);

      console.log("📍 LOCATION SAVED:", res.data);

      if (isLoggedIn) {
        Alert.alert("Success", "Location saved successfully");
        navigation.goBack();
      } else {
        await completeOnboarding();
      }

    } catch (err) {
      console.log("❌ SAVE LOCATION ERROR:", err.response?.data);
      Alert.alert("Error", "Failed to save location");
    }
  };

  const isFormValid = city && houseNo && roadArea && landmark;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-light-background dark:bg-dark-background"
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 48,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center mr-4"
              activeOpacity={0.7}
              onPress={() => console.log("Go back")}
            >
              <Ionicons name="arrow-back" size={24} color="#0f1729" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
              Select Location
            </Text>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 leading-tight">
            Where do you need the service?
          </Text>

          {/* Search Section */}
          <View className="bg-light-surface dark:bg-dark-surface rounded-xl px-4 flex-row items-center mb-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Ionicons
              name="search-outline"
              size={20}
              color="#9ca3af"
              style={{ marginRight: 10 }}
            />
            <TextInput
              className="flex-1 py-4 text-base text-light-text dark:text-dark-text"
              placeholder="Search for your city or area"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={handleSearch} className="p-2">
              {loading ? (
                <ActivityIndicator size="small" color="#0f1729" />
              ) : (
                <Ionicons name="search" size={20} color="#0f1729" />
              )}
            </TouchableOpacity>
          </View>

          {/* Use Current Location Button */}
          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            className="bg-light-surface dark:bg-dark-surface rounded-xl px-4 py-4 flex-row items-center justify-between mb-6 border border-gray-200 dark:border-gray-700 shadow-sm"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mr-3">
                <Ionicons name="navigate" size={20} color="#0f1729" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-light-text dark:text-dark-text">
                  Use current location
                </Text>
                <Text className="text-sm text-light-muted dark:text-dark-muted">
                  Tap to auto-detect via GPS
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* OR Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            <Text className="px-4 text-xs text-light-muted dark:text-dark-muted font-medium">
              OR ENTER MANUALLY
            </Text>
            <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          </View>

          {/* Map Preview */}
          <View
            className="rounded-xl overflow-hidden mb-6 relative border border-gray-200 dark:border-gray-700 bg-gray-100"
            style={{ height: 200 }}
          >
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              region={region}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker coordinate={region}>
                <View className="items-center">
                  <Ionicons name="location" size={40} color="#0f1729" />
                </View>
              </Marker>
            </MapView>

            {/* Open Map Button */}
            <TouchableOpacity
              onPress={() => setIsFullMapVisible(true)}
              className="absolute bottom-3 right-3 bg-white rounded-lg px-4 py-2 flex-row items-center shadow-lg"
              activeOpacity={0.8}
            >
              <Ionicons
                name="map-outline"
                size={16}
                color="#0f1729"
                style={{ marginRight: 6 }}
              />
              <Text className="text-sm font-semibold text-light-text">
                Open Map
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-base font-semibold text-light-text dark:text-dark-text mb-3">
              Save Address As
            </Text>

            <View className="flex-row">
              {[
                { key: "home", label: "Home", icon: "home-outline" },
                { key: "office", label: "Office", icon: "briefcase-outline" },
                { key: "other", label: "Other", icon: "location-outline" },
              ].map((item) => {
                const selected = addressType === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setAddressType(item.key)}
                    activeOpacity={0.8}
                    className={`flex-row items-center px-4 py-3 rounded-full mr-3 border ${selected
                      ? "bg-primary border-primary"
                      : "bg-light-surface dark:bg-dark-surface border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={selected ? "#fff" : "#0f1729"}
                      style={{ marginRight: 8 }}
                    />
                    <Text className={`${selected ? "text-white" : "text-light-text dark:text-dark-text"} font-semibold`}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>


          {/* City Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-2 ml-1">
              City
            </Text>
            <TextInput
              className="bg-light-surface dark:bg-dark-surface rounded-xl px-4 py-4 text-base text-light-text dark:text-dark-text border border-gray-200 dark:border-gray-700"
              placeholder="e.g., Mumbai"
              placeholderTextColor="#9ca3af"
              value={city}
              onChangeText={setCity}
            />
          </View>

          {/* House No / Building Name Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-2 ml-1">
              House No. / Building Name
            </Text>
            <TextInput
              className="bg-light-surface dark:bg-dark-surface rounded-xl px-4 py-4 text-base text-light-text dark:text-dark-text border border-gray-200 dark:border-gray-700"
              placeholder="e.g., Flat 101, Galaxy Apartments"
              placeholderTextColor="#9ca3af"
              value={houseNo}
              onChangeText={setHouseNo}
            />
          </View>

          {/* Road / Area / Colony Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-2 ml-1">
              Road / Area / Colony
            </Text>
            <TextInput
              className="bg-light-surface dark:bg-dark-surface rounded-xl px-4 py-4 text-base text-light-text dark:text-dark-text border border-gray-200 dark:border-gray-700"
              placeholder="e.g., Andheri West"
              placeholderTextColor="#9ca3af"
              value={roadArea}
              onChangeText={setRoadArea}
            />
          </View>

          {/* Landmark / Nearby Input */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-2 ml-1">
              Landmark / Nearby
            </Text>
            <TextInput
              className="bg-light-surface dark:bg-dark-surface rounded-xl px-4 py-4 text-base text-light-text dark:text-dark-text border border-gray-200 dark:border-gray-700"
              placeholder="e.g., Near Metro Station"
              placeholderTextColor="#9ca3af"
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>

          {/* Save and Proceed Button */}
          <TouchableOpacity
            onPress={handleSaveAndProceed}
            className={`bg-primary rounded-xl py-4 items-center justify-center shadow-lg ${!isFormValid ? "opacity-50" : ""
              }`}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text className="text-white text-base font-semibold">
              Save and Proceed
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Full Screen Map Modal */}
      <Modal
        visible={isFullMapVisible}
        animationType="slide"
        onRequestClose={() => setIsFullMapVisible(false)}
      >
        <View className="flex-1">
          {/* Map */}
          <MapView
            ref={fullMapRef}
            provider={PROVIDER_GOOGLE}
            style={{ width, height }}
            initialRegion={region}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            showsUserLocation={true}
            showsMyLocationButton={false}
          />

          {/* Fixed Center Pin */}
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginLeft: -20,
              marginTop: -40,
            }}
            pointerEvents="none"
          >
            <Ionicons name="location" size={40} color="#0f1729" />
          </View>

          {/* Close Button */}
          <TouchableOpacity
            className="absolute top-12 left-6 bg-white rounded-full p-2 shadow-lg"
            onPress={() => setIsFullMapVisible(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={28} color="#0f1729" />
          </TouchableOpacity>

          {/* Bottom Panel */}
          <View className="absolute bottom-0 w-full bg-white rounded-t-3xl px-6 py-6 shadow-2xl">
            <Text className="text-base font-bold text-center text-light-muted mb-4">
              Move map to pick location
            </Text>
            <TouchableOpacity
              className="bg-primary rounded-xl py-4 items-center"
              activeOpacity={0.8}
              onPress={async () => {
                await updateAddressFields(region.latitude, region.longitude);
                setIsFullMapVisible(false);
              }}
            >
              <Text className="text-white font-bold text-base">
                Confirm Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LocationSelection;
