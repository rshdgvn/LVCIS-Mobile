import { BackButton } from "@/src/components/common/BackButton";
import { InputField } from "@/src/components/common/InputField";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import { userService } from "@/src/services/userService";
import { evaluatePasswordStrength } from "@/src/utils/passwordUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type PasswordErrors = {
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
  general?: string;
};

const ChangePasswordScreen = () => {
  const router = useThrottledRouter();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [loading, setLoading] = useState(false);

  const { hasMinLength, hasNumber, hasSpecial, strength } =
    evaluatePasswordStrength(form.new_password);

  const handleUpdatePassword = async () => {
    setErrors({});
    let newErrors: PasswordErrors = {};

    if (!form.current_password) {
      newErrors.current_password = "Current password is required";
    }

    if (!form.new_password) {
      newErrors.new_password = "New password is required";
    } else if (strength < 3) {
      newErrors.new_password = "Please meet all password requirements";
    }

    if (form.new_password !== form.new_password_confirmation) {
      newErrors.new_password_confirmation = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please check the form for errors.",
      });
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword(form);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password updated successfully!",
      });
      router.back();
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "Please check your inputs.",
        });
      } else {
        const msg =
          error.response?.data?.message || "Failed to update password";
        setErrors({
          general: msg,
        });
        Toast.show({
          type: "error",
          text1: "Error",
          text2: msg,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <View className="flex-row items-center justify-between mt-2 px-6">
        <BackButton onPress={() => router.back()} />
        <Text className="text-lg font-bold text-foreground/50 dark:text-dark-fg/50 my-4">
          Change Password
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 25 }}
        showsVerticalScrollIndicator={false}
      >
        {errors.general && (
          <View className="bg-red-500/10 p-3 rounded-lg mb-6 border border-red-500/50">
            <Text className="text-red-500 font-medium text-center">
              {errors.general}
            </Text>
          </View>
        )}

        <InputField
          label="Current Password"
          placeholder="Enter current password"
          isPassword
          value={form.current_password}
          onChangeText={(t) => {
            setForm({ ...form, current_password: t });
            if (errors.current_password)
              setErrors({ ...errors, current_password: undefined });
          }}
          error={errors.current_password}
          containerStyles="mb-6"
        />

        <InputField
          label="New Password"
          placeholder="Enter new password"
          isPassword
          value={form.new_password}
          onChangeText={(t) => {
            setForm({ ...form, new_password: t });
            if (errors.new_password)
              setErrors({ ...errors, new_password: undefined });
          }}
          error={errors.new_password}
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
          <Text className="text-muted-fg dark:text-dark-muted-fg mb-2 font-medium">
            Your password must contain:
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
                className={`ml-2 text-sm ${
                  req.met ? "text-blue-600 font-medium" : "text-muted-fg"
                }`}
              >
                {req.label}
              </Text>
            </View>
          ))}
        </View>

        <InputField
          label="Confirm New Password"
          placeholder="Repeat new password"
          isPassword
          value={form.new_password_confirmation}
          onChangeText={(t) => {
            setForm({ ...form, new_password_confirmation: t });
            if (errors.new_password_confirmation)
              setErrors({ ...errors, new_password_confirmation: undefined });
          }}
          error={errors.new_password_confirmation}
          containerStyles="mb-2"
        />
      </ScrollView>

      <View className="px-6 pb-8">
        <PrimaryButton
          title="Update Password"
          isLoading={loading}
          onPress={handleUpdatePassword}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
