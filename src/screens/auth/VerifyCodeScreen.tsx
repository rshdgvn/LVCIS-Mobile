import React, { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VerifyErrors } from "@/src/app/(auth)/verify-code";

interface Props {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isLoading: boolean;
  errors: VerifyErrors;
  setErrors: React.Dispatch<React.SetStateAction<VerifyErrors>>;
}

export default function VerifyCodeScreen({
  email,
  onVerify,
  onResend,
  isLoading,
  errors,
  setErrors,
}: Props) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleVerify = () => {
    if (code.length !== 6) {
      setErrors({ code: "Please enter the complete 6-digit code." });
      return;
    }
    onVerify(code);
  };

  const handleChangeText = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(cleanText);
    if (errors.code || errors.general) setErrors({});
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

      <Pressable
        className="flex-row justify-between mb-4"
        onPress={() => inputRef.current?.focus()}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isFocused = code.length === index;
          const hasChar = code.length > index;

          let borderColor = "border-input dark:border-dark-input";
          if (errors.code) {
            borderColor = "border-red-500 dark:border-red-500";
          } else if (isFocused) {
            borderColor = "border-primary dark:border-dark-primary";
          }

          return (
            <View
              key={index}
              className={`w-12 h-16 border rounded-xl items-center justify-center bg-transparent ${borderColor}`}
            >
              <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">
                {code[index] || ""}
              </Text>
            </View>
          );
        })}
      </Pressable>

      {(errors.code || errors.general) && (
        <Text className="text-red-500 text-center mb-6 font-medium">
          {errors.code || errors.general}
        </Text>
      )}

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChangeText}
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
          <Text className="text-primary dark:text-dark-primary text-sm font-medium">
            Resend
          </Text>
        </Pressable>
      </View>

      <Pressable
        className={`w-full h-14 rounded-xl items-center justify-center shadow-md ${
          isLoading || code.length !== 6
            ? "bg-muted dark:bg-dark-muted"
            : "bg-primary dark:bg-dark-primary active:opacity-90"
        }`}
        onPress={handleVerify}
        disabled={isLoading || code.length !== 6}
      >
        <Text
          className={`font-bold text-lg ${
            code.length === 6
              ? "text-primary-fg dark:text-dark-primary-fg"
              : "text-muted-fg"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
