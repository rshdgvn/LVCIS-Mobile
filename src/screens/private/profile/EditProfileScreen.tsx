import { BackButton } from "@/src/components/common/BackButton";
import { CustomDropdown } from "@/src/components/common/CustomDropdown";
import { InputField } from "@/src/components/common/InputField";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { COURSE_OPTIONS, YEAR_OPTIONS } from "@/src/constants/education";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/hooks/useTheme";
import { userService } from "@/src/services/userService";
import { CourseType } from "@/src/types/course";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type ProfileErrors = {
  first_name?: string;
  last_name?: string;
  course?: string;
  year_level?: string;
};

const EditProfileScreen = ({ onSave }: { onSave?: () => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { bgColor } = useTheme();

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    course: user?.member?.course || "",
    year_level: user?.member?.year_level || "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        course: user.member?.course || "",
        year_level: user.member?.year_level || "",
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<ProfileErrors>({});
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
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully!",
      });
      if (onSave) onSave();
      router.back();
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "Please check your inputs.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.response?.data?.message || "Failed to update profile",
        });
      }
    },
  });

  const handleSave = () => {
    setErrors({});
    let newErrors: ProfileErrors = {};

    if (!form.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.course) newErrors.course = "Course is required";
    if (!form.year_level) newErrors.year_level = "Year level is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please check the form for errors.",
      });
      return;
    }

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

  const handleCourseSelect = (selectedCourse: string) => {
    const validYears = YEAR_OPTIONS[selectedCourse as CourseType];
    setErrors((prev) => ({ ...prev, course: undefined }));

    setForm((prev) => ({
      ...prev,
      course: selectedCourse,
      year_level:
        prev.year_level && !validYears.includes(prev.year_level)
          ? ""
          : prev.year_level,
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <View className="flex-row items-center justify-between mt-2 px-6">
        <BackButton onPress={() => router.back()} />
        <Text className="text-lg font-bold text-foreground/50 dark:text-dark-fg/50 my-4">
          Edit Profile
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 25,
          marginTop: 25,
          paddingBottom: 40,
        }}
      >
        <View className="items-center mb-6">
          <View className="relative">
            <Image
              source={{
                uri:
                  selectedImage ||
                  user?.avatar ||
                  "https://via.placeholder.com/150",
              }}
              className="w-32 h-32 rounded-full"
            />
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-0 right-0 bg-foreground dark:bg-dark-fg w-8 h-8 rounded-full items-center justify-center border-2 border-background dark:border-dark-bg z-10"
            >
              <Ionicons name="camera" size={18} color={bgColor} />
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold mt-4 text-foreground dark:text-dark-fg text-center">
            {user?.first_name} {user?.last_name}
          </Text>
          <Text className="text-sm text-muted-fg">{user?.email}</Text>
        </View>

        <View className="gap-2">
          <InputField
            label="Email Address"
            value={user?.email}
            editable={false}
            containerStyles="mb-2"
          />

          <View className="flex-row gap-3 mb-2">
            <InputField
              label="First Name"
              value={form.first_name}
              onChangeText={(t) => {
                setForm({ ...form, first_name: t });
                if (errors.first_name)
                  setErrors({ ...errors, first_name: undefined });
              }}
              error={errors.first_name}
              containerStyles="flex-1"
            />
            <InputField
              label="Last Name"
              value={form.last_name}
              onChangeText={(t) => {
                setForm({ ...form, last_name: t });
                if (errors.last_name)
                  setErrors({ ...errors, last_name: undefined });
              }}
              error={errors.last_name}
              containerStyles="flex-1"
            />
          </View>

          <CustomDropdown
            label="Course"
            options={COURSE_OPTIONS}
            value={form.course}
            onSelect={handleCourseSelect}
            error={errors.course}
            placeholder="Select your course"
          />

          <CustomDropdown
            label="Year Level"
            options={form.course ? YEAR_OPTIONS[form.course as CourseType] : []}
            value={form.year_level}
            onSelect={(val: string) => {
              setForm({ ...form, year_level: val });
              if (errors.year_level)
                setErrors({ ...errors, year_level: undefined });
            }}
            error={errors.year_level}
            placeholder={
              form.course ? "Select year level" : "Choose course first"
            }
            emptyMessage={
              form.course
                ? "No options available"
                : "Please select a course to see year levels."
            }
          />
        </View>

        <View className="mt-10 w-full">
          <PrimaryButton
            title="Save Changes"
            isLoading={mutation.isPending}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
