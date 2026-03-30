import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface CustomAlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "No",
  confirmText = "Yes",
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/70 px-5">
        <View className="bg-background dark:bg-dark-bg w-full max-w-[340px] rounded-2xl p-6 shadow-lg border border-border dark:border-dark-border">
          <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-2">
            {title}
          </Text>

          <Text className="text-base text-muted-fg dark:text-dark-muted-fg mb-6 leading-6">
            {message}
          </Text>

          <View className="flex-row justify-end items-center gap-3 mt-2">
            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-border dark:border-dark-border bg-transparent min-w-[80px] items-center"
            >
              <Text className="text-foreground dark:text-dark-fg font-semibold">
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl min-w-[80px] items-center flex-row justify-center ${
                isDestructive
                  ? "bg-red-600 dark:bg-red-600"
                  : "bg-primary dark:bg-dark-primary"
              } ${isLoading ? "opacity-70" : "opacity-100"}`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white font-bold">{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
