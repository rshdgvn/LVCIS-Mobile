import { InputField } from "@/src/components/common/InputField";
import { RegisterPayload } from "@/src/types/auth";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "@/src/components/common/PrimaryButton";

interface Props {
  onNavigate: () => void;
  onRegister: (data: RegisterPayload) => void;
  isLoading: boolean;
  onGoogleRegister: () => void;
}

export default function RegisterScreen({
  onNavigate,
  onRegister,
  isLoading,
  onGoogleRegister,
}: Props) {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const handleSubmit = () => {
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
    <SafeAreaView className="bg-background dark:bg-dark-bg flex-1 justify-center pb-5 px-8">
      <View className="items-center my-6 self-start">
        <Text className="text-2xl font-bold text-foreground self-start dark:text-dark-fg">
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
          <InputField
            label="Course"
            placeholder="Course"
            value={course}
            onChangeText={setCourse}
          />
        </View>

        <View className="flex-1">
          <InputField
            label="Year Level"
            placeholder="Year level"
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
          />
        </View>
      </View>

      <View className="mb-6 w-full">
        <PrimaryButton
          title="Sign in"
          isLoading={isLoading}
          onPress={handleSubmit}
        />
      </View>

      <View className="flex-row justify-center mt-6">
        <Text className="text-muted-fg dark:text-dark-muted-fg">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={onNavigate}>
          <Text className="text-primary dark:text-dark-primary font-bold">
            Sign in.
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
        <Text className="mx-4 text-muted-fg dark:text-dark-muted-fg text-sm">
          Or continue with
        </Text>
        <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
      </View>

      <Pressable
        onPress={onGoogleRegister}
        className="border border-border dark:border-dark-border h-14 rounded-xl items-center justify-center flex-row active:bg-muted dark:active:bg-dark-muted"
      >
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
    </SafeAreaView>
  );
}
