import { CustomDropdown } from "@/src/components/common/CustomDropdown";
import {
  CATEGORY_OPTIONS,
  CATEGORY_VALUE_MAP,
} from "@/src/constants/clubOptions";
import { clubService } from "@/src/services/clubService";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const CreateClubModal = ({ isVisible, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [logo, setLogo] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(isVisible);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setLogo(null);
    setName("");
    setCategoryLabel("");
    setDescription("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const categoryValue = CATEGORY_VALUE_MAP[categoryLabel];

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", categoryValue || "");
      formData.append("description", description);

      if (logo) {
        const filename = logo.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("logo", {
          uri: logo,
          name: filename,
          type,
        } as any);
      }

      return await clubService.createClub(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      Toast.show({ type: "success", text1: "Club created successfully!" });
      handleClose();
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Failed to create club.",
      });
    },
  });

  const handleValidateAndSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Club name is required.";
    if (!categoryLabel) newErrors.categoryLabel = "Category is required.";
    if (!description.trim()) newErrors.description = "Description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    createMutation.mutate();
  };

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
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
      });
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dy) > 5 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SCREEN_HEIGHT * 0.25 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute inset-0 bg-black/40"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end" onPress={handleClose}>
          <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-background dark:bg-dark-bg rounded-t-[32px] max-h-[90%] w-full flex-shrink"
          >
            <Pressable
              className="flex-shrink flex-col w-full"
              onPress={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <View
                {...panResponder.panHandlers}
                className="w-full pt-4 pb-4 items-center bg-transparent z-10"
              >
                <View className="w-12 h-1.5 bg-muted dark:bg-dark-muted rounded-full" />
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-shrink px-6"
                contentContainerStyle={{ paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
              >
                <Text className="text-xl font-bold text-card-fg dark:text-dark-card-fg mb-6">
                  Create New Club
                </Text>

                {/* Logo Upload */}
                <TouchableOpacity
                  onPress={pickImage}
                  className="border-2 border-dashed border-border dark:border-dark-border rounded-2xl h-36 items-center justify-center mb-6 bg-muted/30 dark:bg-dark-muted/10 overflow-hidden"
                >
                  {logo ? (
                    <Image
                      source={{ uri: logo }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="items-center">
                      <Ionicons
                        name="image"
                        size={32}
                        color="#9ca3af"
                        className="mb-2"
                      />
                      <Text className="text-card-fg dark:text-dark-card-fg font-semibold">
                        Upload Club Logo
                      </Text>
                      <Text className="text-xs text-muted-fg dark:text-dark-muted-fg mt-1 uppercase tracking-wider">
                        PNG, JPG, OR SVG UP TO 5MB
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Club Name Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Club Name
                  </Text>
                  <View className="relative justify-center">
                    <TextInput
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      placeholder="e.g Visual Graphic"
                      placeholderTextColor="#9ca3af"
                      className={`border rounded-xl px-4 py-3 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg pr-10 ${
                        errors.name
                          ? "border-red-500"
                          : "border-border dark:border-dark-border"
                      }`}
                    />
                    {errors.name && (
                      <View className="absolute right-3">
                        <Ionicons name="alert-circle" size={20} color="#ef4444" />
                      </View>
                    )}
                  </View>
                  {errors.name && (
                    <Text className="text-red-500 text-[13px] mt-1.5 ml-1">
                      {errors.name}
                    </Text>
                  )}
                </View>

                {/* Category Dropdown */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Category
                  </Text>
                  <View className={errors.categoryLabel ? "border border-red-500 rounded-xl" : ""}>
                    <CustomDropdown
                      label=""
                      value={categoryLabel}
                      options={CATEGORY_OPTIONS}
                      placeholder="Select Category"
                      onSelect={(val) => {
                        setCategoryLabel(val);
                        if (errors.categoryLabel)
                          setErrors((prev) => ({ ...prev, categoryLabel: "" }));
                      }}
                    />
                  </View>
                  {errors.categoryLabel && (
                    <Text className="text-red-500 text-[13px] mt-1.5 ml-1">
                      {errors.categoryLabel}
                    </Text>
                  )}
                </View>

                {/* Description Input */}
                <View className="mb-8">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Club Description
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={description}
                      onChangeText={(text) => {
                        setDescription(text);
                        if (errors.description)
                          setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      placeholder="Describe the mission, vision, and core activities of the club..."
                      placeholderTextColor="#9ca3af"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      className={`border rounded-xl px-4 py-3 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg min-h-[100px] pr-10 ${
                        errors.description
                          ? "border-red-500"
                          : "border-border dark:border-dark-border"
                      }`}
                    />
                    {errors.description && (
                      <View className="absolute right-3 top-3">
                        <Ionicons name="alert-circle" size={20} color="#ef4444" />
                      </View>
                    )}
                  </View>
                  {errors.description && (
                    <Text className="text-red-500 text-[13px] mt-1.5 ml-1">
                      {errors.description}
                    </Text>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  disabled={createMutation.isPending}
                  onPress={handleValidateAndSubmit}
                  className={`py-4 rounded-xl items-center ${
                    createMutation.isPending
                      ? "bg-primary/50 dark:bg-dark-primary/50"
                      : "bg-primary dark:bg-dark-primary"
                  }`}
                >
                  {createMutation.isPending ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Create Club
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};