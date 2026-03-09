import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, ChevronLeft, Lock, ChevronDown } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/src/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/src/services/userService";
import { useRouter } from "expo-router";
import { CustomDropdown } from "@/src/components/common/CustomDropdown";


const EditProfileScreen = ({ onSave }: { onSave?: () => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    course: user?.member?.course || "BSIS",
    year_level: user?.member?.year_level || "1",
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const mutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      const updatedUser = { ...data.user, member: data.member };
      queryClient.setQueryData(["user"], updatedUser);
      Alert.alert("Success", "Profile updated successfully!");
      if (onSave) onSave();
      router.back();
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSave = () => {
    const formData = new FormData();
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("course", form.course);
    formData.append("year_level", form.year_level);

    if (selectedImage) {
      const uriParts = selectedImage.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("avatar", {
        uri: selectedImage,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }
    mutation.mutate(formData);
  };

  const courses = ["BSIS", "ACT", "BSSW", "BSA", "BSAIS", "BAB"];
  const years = ["1", "2", "3", "4"];


  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, marginTop: 25 }}>
        
        {/* Header */}
        <View className="flex-row items-center justify-between mt-2 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={26} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground dark:text-dark-fg">Edit Profile</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Avatar Section */}
        <View className="items-center mb-6">
          <TouchableOpacity onPress={pickImage} className="relative">
            <Image
              source={{ uri: selectedImage || user?.avatar || "https://via.placeholder.com/150" }}
              className="w-28 h-28 rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-black p-2 rounded-full border-2 border-white">
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-bold mt-4 text-foreground dark:text-dark-fg">
            {form.first_name} {form.last_name}
          </Text>
          <Text className="text-sm text-muted-fg">{user?.email}</Text>
        </View>

        {/* Form Fields */}
        <Text className="text-sm font-medium text-muted-fg mb-1 mt-6">Email Address</Text>
        <View className="flex-row items-center bg-muted rounded-xl px-4 py-3 mb-4">
          <Text className="flex-1 text-foreground">{user?.email}</Text>
          <Lock size={16} color="#9CA3AF" />
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-muted-fg mb-1">First Name</Text>
            <TextInput
              value={form.first_name}
              onChangeText={(t) => setForm({ ...form, first_name: t })}
              className="bg-muted rounded-xl px-4 py-3 text-foreground"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-muted-fg mb-1">Last Name</Text>
            <TextInput
              value={form.last_name}
              onChangeText={(t) => setForm({ ...form, last_name: t })}
              className="bg-muted rounded-xl px-4 py-3 text-foreground"
            />
          </View>
        </View>

        {/* Custom Dropdowns */}
        <CustomDropdown 
          label="Course" 
          options={courses} 
          value={form.course} 
          onSelect={(val) => setForm({ ...form, course: val })} 
        />

        <CustomDropdown 
          label="Year Level" 
          options={years} 
          value={form.year_level} 
          onSelect={(val) => setForm({ ...form, year_level: val })} 
        />

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={mutation.isPending}
          className={`py-4 rounded-xl items-center mb-10 mt-12 ${mutation.isPending ? "bg-blue-400" : "bg-blue-600"}`}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Save Changes</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;