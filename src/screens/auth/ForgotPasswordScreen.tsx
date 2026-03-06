import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "@/src/components/common/PrimaryButton";

interface Props {
  onSendCode: (email: string) => void;
  isLoading: boolean;
}

export default function ForgotPasswordScreen({ onSendCode, isLoading }: Props) {
  const [email, setEmail] = useState("");

  const handleSendLink = () => {
    if (!email) {
      Alert.alert("Required", "Please enter your email address.");
      return;
    }
    onSendCode(email);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg justify-center px-8 pb-10">
      <View className="mb-8 items-center justify-center">
        <View className="relative items-center justify-center">
          <View className="bg-blue-100 dark:bg-blue-950 rounded-full p-6">
            <MaterialCommunityIcons name="shield-lock" size={80} color="#3E74FF" />
          </View>
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

      <View className="w-full mb-8">
        <View className="h-14 border border-input dark:border-dark-input rounded-xl px-4 flex-row items-center bg-transparent">
          <Ionicons name="mail-outline" size={20} color="#848a9e" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor="#848a9e"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
            className="flex-1 text-foreground dark:text-dark-fg text-base"
          />
        </View>
      </View>

      <View className="w-full mb-8">
        <PrimaryButton
          title="Send reset link"
          isLoading={isLoading}
          onPress={handleSendLink}
        />
      </View>

      <View className="items-center">
        <Text className="text-muted-fg dark:text-dark-muted-fg text-sm">Don't remember your email?</Text>
        <View className="flex-row mt-1">
          <Text className="text-muted-fg dark:text-dark-muted-fg text-sm">Contact us at </Text>
          <Pressable>
            <Text className="text-primary dark:text-dark-primary text-sm font-medium">example@laverdad.edu.ph</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}