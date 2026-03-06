import React, { useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isLoading: boolean;
}

export default function VerifyCodeScreen({ email, onVerify, onResend, isLoading }: Props) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleVerify = () => {
    if (code.length !== 6) {
      Alert.alert("Invalid", "Please enter the complete 6-digit code.");
      return;
    }
    onVerify(code);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-8 pt-10">
      <View className="items-center mb-8 mt-10">
        <Text className="text-3xl font-medium text-foreground dark:text-dark-fg mb-3 text-center">
          Enter Verification Code
        </Text>
        <Text className="text-muted-fg dark:text-dark-muted-fg text-center px-4 leading-5">
          Enter the 6-digit code sent to{"\n"}
          <Text className="font-semibold">{email}</Text>
        </Text>
      </View>

      <Pressable className="flex-row justify-between mb-8" onPress={() => inputRef.current?.focus()}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            className={`w-12 h-16 border rounded-xl items-center justify-center bg-transparent ${
              code.length === index ? "border-primary dark:border-dark-primary" : "border-input dark:border-dark-input"
            }`}
          >
            <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">
              {code[index] || ""}
            </Text>
          </View>
        ))}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, "").slice(0, 6))}
        keyboardType="number-pad"
        className="absolute opacity-0"
        maxLength={6}
        autoFocus
      />

      <View className="flex-row justify-center mb-8">
        <Text className="text-muted-fg dark:text-dark-muted-fg text-sm">
          didn't receive a code?{" "}
        </Text>
        <Pressable onPress={onResend} disabled={isLoading}>
          <Text className="text-red-500 text-sm font-medium">Resend</Text>
        </Pressable>
      </View>

      <Pressable
        className={`w-full h-14 rounded-xl items-center justify-center shadow-md ${
          isLoading ? "bg-blue-400 dark:bg-blue-800" : "bg-primary dark:bg-dark-primary active:opacity-90"
        }`}
        onPress={handleVerify}
        disabled={isLoading || code.length !== 6}
      >
        <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg">
          {isLoading ? "Verifying..." : "Verify"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}