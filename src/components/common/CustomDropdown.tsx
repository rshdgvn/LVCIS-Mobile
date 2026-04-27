import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react"; // CHANGED: Added useEffect
import {
  Animated,
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Dimensions, 
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const CustomDropdown = ({
  label,
  value,
  options,
  onSelect,
  error,
  placeholder,
  emptyMessage = "No options available",
  showLabelOnly = false,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
  error?: string;
  placeholder?: string;
  emptyMessage?: string;
  showLabelOnly?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const { mutedFgColor } = useTheme();


  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
        panY.setValue(0);
      });
    }
  }, [isOpen]);

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
          setIsOpen(false); 
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
  };

  const borderClass = error
    ? "border-red-500 dark:border-red-500"
    : "border-input dark:border-dark-input";

  const DropdownModal = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="none" 
      onRequestClose={closeModal}
    >
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute inset-0 bg-black/40"
      />

      <Pressable className="flex-1 justify-end" onPress={closeModal}>
        <Animated.View
          {...panResponder.panHandlers}
          style={{ 
            transform: [
              { translateY: slideAnim }, 
              { translateY: panY }  
            ] 
          }}
          className="bg-background dark:bg-dark-bg rounded-t-3xl pt-3 pb-10 px-6 max-h-[100%]"
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
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
                      className={`text-base ${
                        isSelected
                          ? "font-bold text-foreground dark:text-dark-fg"
                          : "font-medium text-foreground dark:text-dark-fg"
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
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );

  if (showLabelOnly) {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsOpen(true)}
          className="self-start flex-row items-center px-3 py-1.5 rounded-full border border-border dark:border-dark-border bg-card dark:bg-dark-card gap-1"
        >
          <Text className="text-sm font-medium text-foreground dark:text-dark-fg">
            {label}
          </Text>
          <ChevronDown size={16} color={mutedFgColor} />
        </TouchableOpacity>
        <DropdownModal />
      </>
    );
  }

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

      <DropdownModal />
    </View>
  );
};