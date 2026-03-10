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
  ImageComponent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, ChevronLeft, Lock } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/src/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/src/services/userService";
import { router } from "expo-router";
import { CustomDropdown } from "@/src/components/common/CustomDropdown";
import { InputField } from "@/src/components/common/InputField";
import { BackButton } from "@/src/components/common/BackButton";
import PrimaryButton  from "@/src/components/common/PrimaryButton";


const EditProfileScreen = ({ onSave }: { onSave?: () => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    course: user?.member?.course || "",       
    year_level: user?.member?.year_level || "", 
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
      <View className="flex-row items-center justify-between mt-2 px-6">
          <BackButton onPress={() => router.back()} />
          <Text className="text-lg font-bold self-center text-foreground/50 dark:text-dark-fg/50 my-4">
            Edit Profile
          </Text>
          <View style={{ width: 48 }} />
      </View>  
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, marginTop: 25 }}>
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
        <View className="gap-2">
          <InputField
            label="Email Address"
            value={user?.email}
            editable={false}
            containerStyles="mb-4"
          />
          <View className="flex-row gap-3 mb-4">
              <InputField
                label="First Name"
                value={form.first_name}
                onChangeText={(t) => setForm({ ...form, first_name: t })}
                containerStyles="flex-1"
              />
              <InputField
                  label="Last Name"
                  value={form.last_name}
                  onChangeText={(t) => setForm({ ...form, last_name: t })}
                  containerStyles="flex-1"
                />
          </View>
          <CustomDropdown 
            label="Course" 
            options={courses} 
            value={form.course} 
            onSelect={(val: string) => setForm({ ...form, course: val })} 
          />
          <CustomDropdown 
            label="Year Level" 
            options={years} 
            value={form.year_level} 
            onSelect={(val: string) => setForm({ ...form, year_level: val })} 
          />
        </View>        
        <TouchableOpacity
          onPress={handleSave}
          disabled={mutation.isPending}
          className={`py-4 rounded-xl items-center mt-24 ${mutation.isPending ? "bg-blue-400" : "bg-blue-600"}`}
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