import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image,
  Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const ServiceRequestScreen = ({ route, navigation }) => {
  const { categoryName, categoryIcon, categoryColor, isIonicon } = route.params;
  
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Tomorrow Morning');

  // Time slot options
  const timeSlots = ['As soon as possible', 'Tomorrow Morning', 'This Week'];

  // Handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Handle date change
  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle time change
  const onTimeChange = (event, time) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
    }
  };

  // Format date
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please describe your problem');
      return;
    }
    
    alert('Service request posted successfully!');
    navigation.goBack();
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
        <View className="bg-white dark:bg-dark-surface rounded-2xl p-5 mb-6 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View 
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{ backgroundColor: categoryColor + '20' }}
            >
              {isIonicon ? (
                <Ionicons name={categoryIcon} size={32} color={categoryColor} />
              ) : (
                <MaterialCommunityIcons name={categoryIcon} size={32} color={categoryColor} />
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xs text-light-muted dark:text-dark-muted uppercase tracking-wide mb-1">
                CATEGORY
              </Text>
              <Text className="text-lg font-bold text-light-text dark:text-dark-text">
                {categoryName}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color="#9CA3AF" />
          </TouchableOpacity>
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
              style={{ minHeight: 120, textAlignVertical: 'top' }}
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
                  {images.map((imageUri, index) => (
                    <View key={index} className="relative mr-3">
                      <Image 
                        source={{ uri: imageUri }} 
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
                  <TouchableOpacity 
                    className="w-24 h-24 rounded-xl bg-white dark:bg-dark-surface border-2 border-dashed border-gray-300 items-center justify-center"
                    onPress={pickImage}
                  >
                    <Ionicons name="add" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          ) : (
            <TouchableOpacity 
              className="bg-white dark:bg-dark-surface rounded-2xl p-8 items-center border-2 border-dashed border-gray-300"
              onPress={pickImage}
            >
              <View className="items-center">
                <View className="mb-3">
                  <Ionicons name="camera" size={48} color="#9CA3AF" />
                  <View className="absolute -top-1 -right-1 bg-white rounded-full">
                    <Ionicons name="add-circle" size={20} color="#0f1729" />
                  </View>
                </View>
                <Text className="text-base font-bold text-light-text dark:text-dark-text mb-1">
                  Add Photos
                </Text>
                <Text className="text-sm text-light-muted dark:text-dark-muted text-center">
                  Upload images or videos to help{'\n'}the provider understand the issue.
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
                  className={`px-5 py-3 rounded-full mr-2 ${
                    selectedTimeSlot === slot 
                      ? 'bg-gray-200 dark:bg-gray-700' 
                      : 'bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700'
                  }`}
                  onPress={() => setSelectedTimeSlot(slot)}
                >
                  <Text className={`text-sm font-medium ${
                    selectedTimeSlot === slot 
                      ? 'text-light-text dark:text-dark-text' 
                      : 'text-light-muted dark:text-dark-muted'
                  }`}>
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
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}

        {/* Submit Button */}
        <View className="mb-8">
          <TouchableOpacity 
            className="bg-primary dark:bg-light-text rounded-2xl p-5 flex-row items-center justify-center"
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-bold mr-2">
              Post Request
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceRequestScreen;