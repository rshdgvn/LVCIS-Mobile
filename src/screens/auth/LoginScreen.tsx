import { InputField } from "@/src/components/InputField";
import { LoginPayload } from "@/src/types/auth";
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

type Props = {
  onNavigate: () => void;
  onLogin: (data: LoginPayload) => void;
};

export default function LoginScreen({ onNavigate, onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert("Required", "Please fill in both email and password.");
      return;
    }
    onLogin({ email, password });
  };

  return (
    <SafeAreaView className="flex-1 bg-card dark:bg-dark-bg px-8 pt-4 pb-10 justify-center">
      <View className="items-center mb-8">
        <View className="mb-3">
          <Image
            source={require("../../../assets/lvcc-logo.png")}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>
        <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">
          Welcome Back
        </Text>
        <Text className="text-muted-fg dark:text-dark-muted-fg text-center mt-1">
          Login with your La Verdad account
        </Text>
      </View>

      <InputField
        label="Email address"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        containerStyles="mb-4"
        value={email}
        onChangeText={setEmail}
      />

      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-semibold text-foreground dark:text-dark-fg">
            Password
          </Text>
          <Pressable>
            <Text className="text-primary dark:text-dark-primary text-sm font-bold">
              Forgot your password?
            </Text>
          </Pressable>
        </View>

        <InputField
          placeholder="Enter your password"
          isPassword={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <Pressable
        className="bg-primary dark:bg-dark-primary h-14 rounded-xl items-center justify-center shadow-md active:opacity-90"
        onPress={handleSubmit}
      >
        <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg">
          Sign in
        </Text>
      </Pressable>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
        <Text className="mx-4 text-muted-fg dark:text-dark-muted-fg text-sm">
          Or continue with
        </Text>
        <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
      </View>

      <Pressable className="border border-border dark:border-dark-border h-14 rounded-xl items-center justify-center flex-row active:bg-muted dark:active:bg-dark-muted mb-4">
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

      <View className="flex-row justify-center mt-6">
        <Text className="text-muted-fg dark:text-dark-muted-fg">
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity onPress={onNavigate}>
          <Text className="text-primary dark:text-dark-primary font-bold">
            Sign up.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
