import { BackButton } from "@/src/components/common/BackButton";
import { InputField } from "@/src/components/common/InputField";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import { userService } from "@/src/services/userService";
import { evaluatePasswordStrength } from "@/src/utils/passwordUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePasswordScreen = () => {
  const router = useThrottledRouter();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  const { hasMinLength, hasNumber, hasSpecial, strength } =
    evaluatePasswordStrength(form.new_password);

  const handleUpdatePassword = async () => {
    if (form.new_password !== form.new_password_confirmation) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await userService.changePassword(form);
      Alert.alert("Success", "Password updated successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <View className="flex-row items-center justify-between mt-2 px-6">
        <BackButton onPress={() => router.back()} />
        <Text className="text-lg font-bold self-center text-foreground/50 dark:text-dark-fg/50 my-4">
          Edit Profile
        </Text>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 25 }}>
        <InputField
          label="Current Password"
          isPassword
          value={form.current_password}
          onChangeText={(t) => setForm({ ...form, current_password: t })}
          containerStyles="mb-6"
        />

        <InputField
          label="New Password"
          isPassword
          value={form.new_password}
          onChangeText={(t) => setForm({ ...form, new_password: t })}
          containerStyles="mb-2"
        />

        <View className="flex-row gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < strength ? "bg-blue-600" : "bg-gray-300 dark:bg-dark-input"
              }`}
            />
          ))}
        </View>

        <View className="mb-6 gap-1">
          <Text className="text-gray-500 mb-2 font-medium">
            Your Password must contain:
          </Text>
          {[
            { label: "At least 8 characters", met: hasMinLength },
            { label: "Contains a number", met: hasNumber },
            { label: "Contains a special character", met: hasSpecial },
          ].map((req, i) => (
            <View key={i} className="flex-row items-center mb-1">
              <Ionicons
                name={req.met ? "checkmark-circle" : "ellipse-outline"}
                size={16}
                color={req.met ? "#2563EB" : "#9CA3AF"}
              />
              <Text
                className={`ml-2 text-sm ${req.met ? "text-blue-600" : "text-gray-500"}`}
              >
                {req.label}
              </Text>
            </View>
          ))}
        </View>

        <InputField
          label="Confirm Password"
          isPassword
          value={form.new_password_confirmation}
          onChangeText={(t) =>
            setForm({ ...form, new_password_confirmation: t })
          }
          containerStyles="mb-2"
        />
      </ScrollView>
      <View className="px-6 mb-6">
        <PrimaryButton
          title="Change Password"
          isLoading={loading}
          onPress={handleUpdatePassword}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
