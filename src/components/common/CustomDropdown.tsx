import { useTheme } from "@/src/hooks/useTheme";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const CustomDropdown = ({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutedFgColor } = useTheme();

  return (
    <View className="mb-4">
      {label && (
        <Text className="font-semibold mb-2 text-foreground dark:text-dark-fg">
          {label}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen(true)}
        className="h-12 border border-input dark:border-dark-input rounded-xl px-4 flex-row items-center justify-between bg-transparent"
      >
        <Text className="text-foreground dark:text-dark-fg text-base">
          {value || `Select ${label}`}
        </Text>
        <ChevronDown size={20} color={mutedFgColor} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-background dark:bg-dark-bg rounded-t-3xl p-6 pb-10">
            <View className="w-12 h-1.5 bg-input dark:bg-dark-input rounded-full self-center mb-6" />
            <Text className="text-lg font-bold mb-4 text-foreground dark:text-dark-fg">
              Select {label}
            </Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                  className={`p-4 mb-2 rounded-xl ${value === item ? "bg-blue-500/10 border border-blue-500" : "bg-muted dark:bg-dark-muted"}`}
                >
                  <Text
                    className={`text-base ${value === item ? "text-blue-600 font-bold" : "text-foreground dark:text-dark-fg"}`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
