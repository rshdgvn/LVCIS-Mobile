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
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  Pressable,
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

  const isFormValid =
    name.trim() !== "" && categoryLabel !== "" && description.trim() !== "";

  useEffect(() => {
    if (isVisible) {
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
      });
    }
  }, [isVisible]);

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      {/* Independent Animated Backdrop */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute inset-0 bg-black/40"
      />
      <Pressable className="flex-1 justify-end" onPress={handleClose}>
        <KeyboardAvoidingView
          behavior="padding"
        >
          <Animated.View 
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-background dark:bg-dark-bg rounded-t-[32px] p-6 max-h-[100%]"
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              
              <View className="w-12 h-1.5 bg-muted dark:bg-dark-muted rounded-full self-center mb-6" />

              <Text className="text-xl font-bold text-card-fg dark:text-dark-card-fg mb-6">
                Create New Club
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Logo Upload Area */}
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

                {/* Inputs */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Club Name
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e. g Visual Graphic"
                    placeholderTextColor="#9ca3af"
                    className="border border-border dark:border-dark-border rounded-xl px-4 py-3 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Category
                  </Text>
                  <CustomDropdown
                    label=""
                    value={categoryLabel}
                    options={CATEGORY_OPTIONS}
                    placeholder="Select Category"
                    onSelect={setCategoryLabel}
                  />
                </View>

                <View className="mb-8">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Club Description
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe the mission, vision, and core activities of the club..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="border border-border dark:border-dark-border rounded-xl px-4 py-3 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg min-h-[100px]"
                  />
                </View>

                <TouchableOpacity
                  disabled={!isFormValid || createMutation.isPending}
                  onPress={() => createMutation.mutate()}
                  className={`py-4 rounded-xl items-center ${
                    !isFormValid || createMutation.isPending
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

                <Text className="text-center text-[10px] text-muted-fg dark:text-dark-muted-fg uppercase mt-3 tracking-widest">
                  This action will notify the assigned president
                </Text>

                <View className="h-8" />
              </ScrollView>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};