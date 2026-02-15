import { InputField } from "@/src/components/InputField";
import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen({ onNavigate }: any) {
  const { mutedFgColor } = useTheme();

  return (
    <SafeAreaView className="bg-background dark:bg-dark-bg flex-1 justify-center px-8 pt-4 pb-10 h-[85%]">
      <View className="items-center mb-6">
        <View className="w-20 h-20 rounded-full bg-card dark:bg-dark-card shadow-sm items-center justify-center mb-4 border border-border dark:border-dark-border">
          <Image
            source={require("../../../assets/lvcc-logo.png")}
            className="w-16 h-16"
            resizeMode="contain"
          />
        </View>
        <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">
          Create an account
        </Text>
        <Text className="text-muted-fg dark:text-dark-muted-fg text-center mt-1">
          Join La Verdad Club Integrated System
        </Text>
      </View>

      <Text className="text-primary dark:text-dark-primary font-bold mb-3">
        Personal Information
      </Text>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <InputField placeholder="First name" />
        </View>
        <View className="flex-1">
          <InputField placeholder="Last name" />
        </View>
      </View>

      <InputField
        label="Email address"
        placeholder="Enter your email"
        keyboardType="email-address"
        containerStyles="mb-4"
      />

      <InputField
        label="Password"
        placeholder="Set a password"
        isPassword={true}
        containerStyles="mb-4"
      />

      <Text className="text-primary dark:text-dark-primary font-bold mb-3 mt-2">
        Academic Information
      </Text>

      <View className="flex-row gap-3 mb-8">
        <View className="flex-1">
          <Text className="font-medium mb-2 text-foreground dark:text-dark-fg">
            Course
          </Text>
          <Pressable className="h-12 border border-input dark:border-dark-input rounded-xl px-4 flex-row items-center justify-between bg-transparent">
            <Text style={{ color: mutedFgColor }}>Course</Text>
            <Ionicons name="chevron-down" size={18} color={mutedFgColor} />
          </Pressable>
        </View>

        <View className="flex-1">
          <Text className="font-medium mb-2 text-foreground dark:text-dark-fg">
            Year Level
          </Text>
          <Pressable className="h-12 border border-input dark:border-dark-input rounded-xl px-4 flex-row items-center justify-between bg-transparent">
            <Text style={{ color: mutedFgColor }}>Year level</Text>
            <Ionicons name="chevron-down" size={18} color={mutedFgColor} />
          </Pressable>
        </View>
      </View>

      <Pressable className="bg-primary dark:bg-dark-primary h-14 rounded-xl items-center justify-center shadow-md active:opacity-90">
        <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg">
          Create an Account
        </Text>
      </Pressable>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
        <Text className="mx-4 text-muted-fg dark:text-dark-muted-fg text-sm">
          Or continue with
        </Text>
        <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
      </View>

      <Pressable className="border border-border dark:border-dark-border h-14 rounded-xl items-center justify-center flex-row active:bg-muted dark:active:bg-dark-muted mb-6">
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
          }}
          className="w-5 h-5 mr-3"
        />
        <Text className="font-semibold text-secondary-fg dark:text-dark-secondary-fg">
          Continue with Google
        </Text>
      </Pressable>

      <View className="flex-row justify-center pb-8">
        <Text className="text-muted-fg dark:text-dark-muted-fg">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={onNavigate}>
          <Text className="text-primary dark:text-dark-primary font-bold">
            Sign in.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
