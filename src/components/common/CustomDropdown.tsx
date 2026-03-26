import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { ChevronDown } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  PanResponder,
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
  error,
  placeholder,
  emptyMessage = "No options available",
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
  error?: string;
  placeholder?: string;
  emptyMessage?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutedFgColor } = useTheme();

  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeModal();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => panY.setValue(0), 300);
  };

  const borderClass = error
    ? "border-red-500 dark:border-red-500"
    : "border-input dark:border-dark-input";

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
        className={`h-12 border ${borderClass} rounded-xl px-4 flex-row items-center justify-between bg-transparent`}
      >
        <Text
          className={`text-base flex-1 ${
            value
              ? "text-foreground dark:text-dark-fg"
              : "text-muted-fg dark:text-dark-muted-fg"
          }`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value || placeholder || `Select ${label}`}
        </Text>
        <ChevronDown size={20} color={error ? "#ef4444" : mutedFgColor} />
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={closeModal}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={{ transform: [{ translateY: panY }] }}
            className="bg-background dark:bg-dark-bg rounded-t-3xl pt-3 pb-10 px-6 max-h-[80%]"
          >
            <View className="w-12 h-1.5 bg-border dark:bg-dark-border rounded-full self-center mb-6" />

            <Text className="text-xl font-bold mb-4 text-foreground dark:text-dark-fg">
              Choose {label}
            </Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="py-6 items-center justify-center">
                  <Text className="text-muted-fg dark:text-dark-muted-fg text-base text-center">
                    {emptyMessage}
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = value === item;

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelect(item);
                      closeModal();
                    }}
                    className={`flex-row items-center justify-between p-4 mb-2 rounded-2xl ${
                      isSelected
                        ? "bg-primary/10 dark:bg-dark-primary/10"
                        : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-base font-medium ${
                        isSelected
                          ? "text-foreground dark:text-dark-fg font-bold"
                          : "text-foreground dark:text-dark-fg"
                      }`}
                    >
                      {item}
                    </Text>

                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#3b82f6"
                      />
                    ) : (
                      <Ionicons
                        name="ellipse-outline"
                        size={24}
                        color={mutedFgColor}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};
