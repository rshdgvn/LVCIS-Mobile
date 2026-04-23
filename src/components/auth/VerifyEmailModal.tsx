import PrimaryButton from "@/src/components/common/PrimaryButton";
import { authService } from "@/src/services/authService";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  email: string | null;
  visible: boolean;
  onClose: () => void;
}

export default function VerifyEmailModal({ email, visible, onClose }: Props) {
  const resendMutation = useMutation({
    mutationFn: () => {
      if (!email) throw new Error("No email provided");
      return authService.resendUnauthenticatedVerification(email);
    },
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Email Sent!",
        text2: data.message || "A fresh verification link has been sent to your inbox.",
      });
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.status === 429) {
        Toast.show({
          type: "error",
          text1: "Please Wait",
          text2: error.response.data.message || "Too many requests. Please try again later.",
        });
        return;
      }

      const message =
        error.response?.data?.message ||
        "Failed to send email. Please try again.";
        
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });

  if (!email) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-card dark:bg-dark-bg w-full rounded-2xl p-6 items-center shadow-xl">
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2985/2985981.png",
            }}
            className="w-16 h-16 mb-4 opacity-80"
          />

          <Text className="text-xl font-bold text-foreground dark:text-dark-fg text-center mb-2">
            Verify Your Email
          </Text>

          <Text className="text-muted-fg dark:text-dark-muted-fg text-center mb-6 leading-5">
            You need to verify your email address before logging in. {"\n\n"}
            <Text className="font-bold text-foreground dark:text-dark-fg">
              {email}
            </Text>
          </Text>

          <View className="w-full mb-3">
            <PrimaryButton
              title="Resend Verification Email"
              isLoading={resendMutation.isPending}
              onPress={() => resendMutation.mutate()}
            />
          </View>

          <TouchableOpacity onPress={onClose} className="py-3">
            <Text className="text-muted-fg dark:text-dark-muted-fg font-semibold">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}