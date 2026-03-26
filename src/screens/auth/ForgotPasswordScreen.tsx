import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import { InputField } from "@/src/components/common/InputField";
import { ForgotPasswordErrors } from "@/src/app/(auth)/forgot-password";

interface Props {
  onSendCode: (email: string) => void;
  isLoading: boolean;
  errors: ForgotPasswordErrors;
  setErrors: React.Dispatch<React.SetStateAction<ForgotPasswordErrors>>;
}

export default function ForgotPasswordScreen({
  onSendCode,
  isLoading,
  errors,
  setErrors,
}: Props) {
  const [email, setEmail] = useState("");

  const handleSendLink = () => {
    setErrors({});
    if (!email) {
      setErrors({ email: "Email address is required." });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    onSendCode(email);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg justify-center px-8 pb-10">
      <View className="mb-8 items-center justify-center">
        <View className="bg-blue-100 dark:bg-blue-950 rounded-full p-6">
          <MaterialCommunityIcons
            name="shield-lock"
            size={80}
            color="#3E74FF"
          />
        </View>
      </View>

      <View className="items-center mb-8">
        <Text className="text-2xl font-bold text-foreground dark:text-dark-fg mb-3 text-center">
          Forgot Password
        </Text>
        <Text className="text-muted-fg dark:text-dark-muted-fg text-center px-4 leading-5">
          Please enter your email address to reset your password
        </Text>
      </View>

      {errors.general && (
        <View className="bg-red-500/10 p-3 rounded-lg mb-6 border border-red-500/50">
          <Text className="text-red-500 font-medium text-center">
            {errors.general}
          </Text>
        </View>
      )}

      <View className="w-full mb-8">
        <InputField
          label="Email address"
          placeholder="Enter your email address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
          error={errors.email}
        />
      </View>

      <View className="w-full mb-8">
        <PrimaryButton
          title="Send reset link"
          isLoading={isLoading}
          onPress={handleSendLink}
        />
      </View>

      <View className="items-center">
        <Text className="text-muted-fg dark:text-dark-muted-fg text-sm">
          Don't remember your email?
        </Text>
        <View className="flex-row mt-1">
          <Text className="text-muted-fg dark:text-dark-muted-fg text-sm">
            Contact us at{" "}
          </Text>
          <Pressable>
            <Text className="text-primary dark:text-dark-primary text-sm font-medium">
              support@laverdad.edu.ph
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
