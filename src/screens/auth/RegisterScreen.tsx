import { InputField } from "@/src/components/InputField";
import { RegisterPayload } from "@/src/types/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onNavigate: () => void;
  onRegister: (data: RegisterPayload) => void;
  isLoading?: boolean;
};

export default function RegisterScreen({
  onNavigate,
  onRegister,
  isLoading,
}: Props) {
  // 1. State for all inputs
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  // 2. Handle Submit
  const handleRegister = () => {
    if (!firstname || !lastname || !email || !password || !course || !year) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    onRegister({
      firstname,
      lastname,
      email,
      password,
      password_confirmation: confirmPassword,
      course,
      year,
    });
  };

  return (
    <SafeAreaView className="bg-background dark:bg-dark-bg flex-1">
      {/* Wrapped in ScrollView to handle small screens/keyboard */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center my-6">
          <View className="mb-3">
            <Image
              source={require("../../../assets/lvcc-logo.png")}
              className="w-20 h-20"
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

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <InputField
              label="First name"
              placeholder="First name"
              value={firstname}
              onChangeText={setFirstname}
            />
          </View>
          <View className="flex-1">
            <InputField
              label="Last name"
              placeholder="Last name"
              value={lastname}
              onChangeText={setLastname}
            />
          </View>
        </View>

        <InputField
          label="Email address"
          placeholder="Enter your email"
          keyboardType="email-address"
          containerStyles="mb-4"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <InputField
          label="Password"
          placeholder="Set a password"
          isPassword={true}
          containerStyles="mb-4"
          value={password}
          onChangeText={setPassword}
        />

        <InputField
          label="Confirm Password"
          placeholder="Confirm password"
          isPassword={true}
          containerStyles="mb-4"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View className="flex-row gap-3 mb-8">
          <View className="flex-1">
            {/* Changed to InputField for simplicity */}
            <InputField
              label="Course"
              placeholder="e.g. BSIS"
              value={course}
              onChangeText={setCourse}
            />
          </View>

          <View className="flex-1">
            {/* Changed to InputField for simplicity */}
            <InputField
              label="Year Level"
              placeholder="e.g. 3"
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
            />
          </View>
        </View>

        <Pressable
          className={`h-14 rounded-xl items-center justify-center shadow-md ${isLoading ? "bg-muted" : "bg-primary dark:bg-dark-primary"}`}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg">
            {isLoading ? "Creating Account..." : "Create an Account"}
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
      </ScrollView>
    </SafeAreaView>
  );
}
