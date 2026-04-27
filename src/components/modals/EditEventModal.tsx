import { useClub } from "@/src/contexts/ClubContext";
import { useEventMutations } from "@/src/hooks/useEvents";
import { useIsAdmin } from "@/src/hooks/useIsAdmin";
import { Event } from "@/src/types/event";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
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
  event: Event;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const parseDateStr = (str: string): Date => {
  if (!str) return new Date();
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  const parts = str.substring(0, 10).split("-").map(Number);
  const result = new Date();
  result.setFullYear(parts[0], parts[1] - 1, parts[2]);
  result.setHours(0, 0, 0, 0);
  return result;
};

const parseTimeStr = (str: string): Date => {
  if (!str) return new Date();
  if (str.includes("T")) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const result = new Date();
      result.setHours(d.getUTCHours(), d.getUTCMinutes(), 0, 0);
      return result;
    }
  }
  // "HH:MM" or "HH:MM:SS"
  const [h, m] = str.split(":").map(Number);
  const result = new Date();
  result.setHours(h, m, 0, 0);
  return result;
};

export const EditEventModal = ({ isVisible, onClose, event }: Props) => {
  const { updateEvent, isUpdating } = useEventMutations();
  const { clubs, activeClubId, isOfficer } = useClub();
  const isAdmin = useIsAdmin();

  const availableClubs = isAdmin ? clubs : clubs.filter((c) => isOfficer(c.id));

  const getInitialClubId = () => {
    if (event.club_id !== undefined && event.club_id !== null)
      return event.club_id;
    if (isAdmin) return null;
    if (activeClubId && isOfficer(activeClubId)) return activeClubId;
    return availableClubs.length > 0 ? availableClubs[0].id : null;
  };

  const [title, setTitle] = useState(event.title);
  const [venue, setVenue] = useState(event.detail?.venue || "");
  const [description, setDescription] = useState(event.description || "");
  const [coverImage, setCoverImage] = useState<string | null>(
    event.cover_image || null,
  );
  const [selectedClubId, setSelectedClubId] = useState<number | null>(
    getInitialClubId(),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showModal, setShowModal] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [clubModalTrigger, setClubModalTrigger] = useState(false);
  const [renderClubModal, setRenderClubModal] = useState(false);
  const clubSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const clubFadeAnim = useRef(new Animated.Value(0)).current;

  const [dateObj, setDateObj] = useState<Date>(
    parseDateStr(event.detail?.event_date || ""),
  );
  const [timeObj, setTimeObj] = useState<Date>(
    parseTimeStr(event.detail?.event_time?.substring(0, 5) || ""),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  useEffect(() => {
    if (clubModalTrigger) {
      setRenderClubModal(true);
      Animated.parallel([
        Animated.timing(clubFadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(clubSlideAnim, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(clubFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(clubSlideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderClubModal(false);
      });
    }
  }, [clubModalTrigger]);

  useEffect(() => {
    if (isVisible) {
      setTitle(event.title);
      setVenue(event.detail?.venue || "");
      setDescription(event.description || "");
      setCoverImage(event.cover_image || null);
      setDateObj(parseDateStr(event.detail?.event_date || ""));
      setTimeObj(parseTimeStr(event.detail?.event_time?.substring(0, 5) || ""));
      setSelectedClubId(getInitialClubId());
      setErrors({}); 
    }
  }, [event, isVisible, isAdmin]);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleClose = () => {
    setTitle(event.title);
    setVenue(event.detail?.venue || "");
    setDescription(event.description || "");
    setCoverImage(event.cover_image || null);
    setDateObj(parseDateStr(event.detail?.event_date || ""));
    setTimeObj(parseTimeStr(event.detail?.event_time?.substring(0, 5) || ""));
    setSelectedClubId(getInitialClubId());
    setErrors({});
    onClose();
  };

  const handleUpdate = async () => {
    const newErrors: Record<string, string> = {};

    if (!isAdmin && selectedClubId === null) newErrors.club = "Host club is required.";
    if (!title.trim()) newErrors.title = "Event title is required.";
    if (!venue.trim()) newErrors.venue = "Venue is required.";
    if (!description.trim()) newErrors.description = "Description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!event?.id) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Event ID is missing.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("event_date", dateObj.toISOString().split("T")[0]);
    formData.append(
      "event_time",
      `${timeObj.getHours().toString().padStart(2, "0")}:${timeObj.getMinutes().toString().padStart(2, "0")}`,
    );
    formData.append("venue", venue);
    formData.append("description", description);
    formData.append("purpose", event.purpose || "General Event");
    formData.append("status", event.status || "upcoming");
    formData.append("organizer", event.detail?.organizer || "Admin");
    formData.append("contact_person", event.detail?.contact_person || "Admin");
    formData.append(
      "contact_email",
      event.detail?.contact_email || "admin@cis.com",
    );
    formData.append("event_mode", event.detail?.event_mode || "face_to_face");
    formData.append("duration", event.detail?.duration || "2 hours");

    if (selectedClubId !== null) {
      formData.append("club_id", selectedClubId.toString());
    }

    if (coverImage && !coverImage.startsWith("http")) {
      const uriParts = coverImage.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("cover_image", {
        uri: coverImage,
        name: `cover.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      await updateEvent.mutateAsync({ id: event.id, data: formData });
      Toast.show({ type: "success", text1: "Event updated successfully!" });
      handleClose();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error?.response?.data?.message ?? "Something went wrong.",
      });
    }
  };

  const mainPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dy) > 5 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) slideAnim.setValue(gestureState.dy);
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

  const clubPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dy) > 5 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) clubSlideAnim.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SCREEN_HEIGHT * 0.25 || gestureState.vy > 0.5) {
          setClubModalTrigger(false);
        } else {
          Animated.spring(clubSlideAnim, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!showModal) return null;

  const clubOptions = isAdmin
    ? [{ id: null, name: "General Event", logo_url: null }, ...availableClubs]
    : availableClubs;

  return (
    <Modal
      visible={showModal}
      animationType="none"
      transparent
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
            className="bg-background dark:bg-dark-bg rounded-t-[40px] max-h-[90%] w-full flex-shrink"
          >
            <Pressable
              className="flex-shrink w-full flex-col"
              onPress={(e) => e.stopPropagation()}
            >
              <View
                {...mainPanResponder.panHandlers}
                className="w-full pt-4 pb-2 items-center bg-transparent"
              >
                <View className="w-12 h-1.5 bg-muted dark:bg-dark-muted rounded-full" />
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="px-6 flex-shrink"
                keyboardShouldPersistTaps="handled"
              >
                <Text className="text-2xl font-bold text-foreground dark:text-dark-fg mt-4 mb-6">
                  Edit Event
                </Text>

                {/* Host Club Selection */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                    Host Club
                  </Text>
                  <TouchableOpacity
                    onPress={() => setClubModalTrigger(true)}
                    className={`flex-row items-center justify-between bg-background dark:bg-dark-bg border rounded-2xl px-4 py-4 ${
                      errors.club ? "border-red-500" : "border-border dark:border-dark-border"
                    }`}
                  >
                    <Text className="text-foreground dark:text-dark-fg text-sm">
                      {selectedClubId === null
                        ? "General Event"
                        : clubs.find((c) => c.id === selectedClubId)?.name ||
                          "Select a club"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                  </TouchableOpacity>
                  {errors.club && (
                    <Text className="text-red-500 text-[13px] mt-1.5 ml-1">
                      {errors.club}
                    </Text>
                  )}
                </View>

                {/* Cover Image */}
                <TouchableOpacity
                  onPress={pickImage}
                  className="w-full h-40 border-2 border-dashed border-border dark:border-dark-border rounded-3xl items-center justify-center bg-background dark:bg-dark-bg mb-6 overflow-hidden"
                >
                  {coverImage ? (
                    <Image
                      source={{ uri: coverImage }}
                      className="w-full h-full rounded-3xl"
                    />
                  ) : (
                    <>
                      <View className="p-3 bg-background dark:bg-dark-bg rounded-2xl mb-3">
                        <Ionicons
                          name="image-outline"
                          size={28}
                          color="#9ca3af"
                        />
                      </View>
                      <Text className="font-bold text-foreground dark:text-dark-fg text-sm">
                        Upload Cover Photo
                      </Text>
                      <Text className="text-[10px] text-muted-fg dark:text-dark-muted-fg mt-1 uppercase tracking-wider">
                        PNG, JPG UP TO 10MB
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Title */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                    Event Title
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={title}
                      onChangeText={(text) => {
                        setTitle(text);
                        clearError("title");
                      }}
                      placeholder="e.g. Computer Science Seminar"
                      placeholderTextColor="#9ca3af"
                      className={`w-full px-4 py-4 bg-background dark:bg-dark-bg border rounded-2xl text-foreground dark:text-dark-fg ${
                        errors.title ? "border-red-500 pr-10" : "border-border dark:border-dark-border"
                      }`}
                    />
                    {errors.title && (
                      <View className="absolute right-3 top-4">
                        <Ionicons name="alert-circle" size={20} color="#ef4444" />
                      </View>
                    )}
                  </View>
                  {errors.title && (
                    <Text className="text-red-500 text-[13px] mt-1.5 ml-1">
                      {errors.title}
                    </Text>
                  )}
                </View>

                {/* Date + Time row */}
                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                      Date
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      className="flex-row items-center justify-between bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl px-4 py-4"
                    >
                      <Text
                        className="text-foreground dark:text-dark-fg text-sm flex-1"
                        numberOfLines={1}
                      >
                        {dateObj.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-1">
                    <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                      Time
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowTimePicker(true)}
                      className="flex-row items-center justify-between bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl px-4 py-4"
                    >
                      <Text className="text-foreground dark:text-dark-fg text-sm">
                        {formatTime(timeObj)}
                      </Text>
                      <Ionicons name="time-outline" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Date Picker */}
                {showDatePicker && (
                  <DateTimePicker
                    value={dateObj}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    onChange={(_, d) => {
                      setShowDatePicker(false);
                      if (d) setDateObj(d);
                    }}
                  />
                )}

                {/* Time Picker */}
                {showTimePicker && (
                  <DateTimePicker
                    value={timeObj}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "clock"}
                    onChange={(_, t) => {
                      setShowTimePicker(false);
                      if (t) setTimeObj(t);
                    }}
                  />
                )}

                {/* Venue */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                    Venue
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={venue}
                      onChangeText={(text) => {
                        setVenue(text);
                        clearError("venue");
                      }}
                      placeholder="Room 402, Science Building"
                      placeholderTextColor="#9ca3af"
                      className={`w-full pl-12 py-4 bg-background dark:bg-dark-bg border rounded-2xl text-foreground dark:text-dark-fg ${
                        errors.venue ? "border-red-500 pr-10" : "border-border dark:border-dark-border pr-4"
                      }`}
                    />
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#9ca3af"
                      style={{ position: "absolute", left: 16, top: 18 }}
                    />
                    {errors.venue && (
                      <View className="absolute right-3 top-4">
                        <Ionicons name="alert-circle" size={20} color="#ef4444" />
                      </View>
                    )}
                  </View>
                  {errors.venue && (
                    <Text className="text-red-500 text-[13px] mt-1.5 ml-1">
                      {errors.venue}
                    </Text>
                  )}
                </View>

                {/* Description */}
                <View className="mb-8">
                  <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                    Description
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={description}
                      onChangeText={(text) => {
                        setDescription(text);
                        clearError("description");
                      }}
                      placeholder="What is this event about?"
                      placeholderTextColor="#9ca3af"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      className={`w-full px-4 py-4 bg-background dark:bg-dark-bg border rounded-2xl text-foreground dark:text-dark-fg h-28 ${
                        errors.description ? "border-red-500 pr-10" : "border-border dark:border-dark-border"
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
              </ScrollView>

              {/* Footer */}
              <View className="px-6 pb-10 pt-4 bg-background dark:bg-dark-bg ">
                <TouchableOpacity
                  onPress={handleUpdate}
                  disabled={isUpdating}
                  className={`w-full py-4 rounded-2xl items-center ${isUpdating ? "opacity-60" : "opacity-100"} bg-primary dark:bg-dark-primary`}
                >
                  {isUpdating ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-lg">
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>

      {/* INNER CLUB MODAL */}
      {renderClubModal && (
        <Modal
          visible={renderClubModal}
          transparent
          animationType="none"
          onRequestClose={() => setClubModalTrigger(false)}
        >
          {/* Animated Dimming Backdrop */}
          <Animated.View
            style={{ opacity: clubFadeAnim }}
            className="absolute inset-0 bg-black/40"
          />
          <Pressable
            className="flex-1 justify-end"
            onPress={() => setClubModalTrigger(false)}
          >
            <Animated.View
              style={{ transform: [{ translateY: clubSlideAnim }] }}
              className="bg-background dark:bg-dark-bg rounded-t-[32px] pt-0 shadow-xl max-h-[85%] pb-10 flex-shrink w-full"
            >
              <Pressable onPress={(e) => e.stopPropagation()}>
                {/* Club Modal Drag Handle wrapped in PanResponder */}
                <View
                  {...clubPanResponder.panHandlers}
                  className="w-full pt-4 pb-2 items-center bg-transparent"
                >
                  <View className="w-14 h-1.5 bg-muted dark:bg-dark-muted rounded-full mb-2" />
                </View>

                <View className="px-6">
                  <View className="mb-6">
                    <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-1">
                      Select Host
                    </Text>
                    <Text className="text-sm text-muted-fg dark:text-dark-muted-fg">
                      Choose the host club for this event
                    </Text>
                  </View>
                </View>

                <FlatList
                  data={clubOptions}
                  keyExtractor={(item) =>
                    item.id ? item.id.toString() : "general"
                  }
                  showsVerticalScrollIndicator={false}
                  className="px-6"
                  contentContainerStyle={{ paddingBottom: 16 }}
                  renderItem={({ item }) => {
                    const isSelected = item.id === selectedClubId;
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          setSelectedClubId(item.id);
                          clearError("club");
                          setClubModalTrigger(false);
                        }}
                        className={`flex-row items-center p-4 mb-3 rounded-2xl border ${
                          isSelected
                            ? "bg-primary/10 border-primary/30"
                            : "bg-card dark:bg-dark-card border-border dark:border-dark-border"
                        }`}
                      >
                        <View
                          className={`w-12 h-12 rounded-xl items-center justify-center mr-4 overflow-hidden ${
                            !item.logo_url && "bg-background dark:bg-dark-bg"
                          }`}
                        >
                          {item.id === null ? (
                            <Ionicons
                              name="globe-outline"
                              size={24}
                              color="#64748b"
                            />
                          ) : item.logo_url ? (
                            <Image
                              source={{ uri: item.logo_url }}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            <Ionicons name="people" size={22} color="#64748b" />
                          )}
                        </View>
                        <View className="flex-1 pr-2">
                          <Text
                            className={`text-base ${
                              isSelected
                                ? "font-bold text-primary dark:text-dark-primary"
                                : "font-semibold text-foreground dark:text-dark-fg"
                            }`}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={26}
                            color="#3b82f6"
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
      )}
    </Modal>
  );
};