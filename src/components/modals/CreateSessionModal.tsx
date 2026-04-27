import { useClub } from "@/src/contexts/ClubContext";
import { useAttendanceMutations } from "@/src/hooks/useAttendance";
import { useIsAdmin } from "@/src/hooks/useIsAdmin";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
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
  clubId: number | null;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const CreateSessionModal = ({ isVisible, onClose, clubId }: Props) => {
  const queryClient = useQueryClient();
  const { createSession } = useAttendanceMutations();
  const { clubs, activeClubId, isOfficer, getUserRole } = useClub();
  const isAdmin = useIsAdmin();

  // Determine allowed clubs based on roles
  const availableClubs = isAdmin ? clubs : clubs.filter((c) => isOfficer(c.id));

  const getInitialClubId = () => {
    if (clubId !== undefined && clubId !== null) return clubId;
    if (isAdmin) return null; // Default to General for Admin
    if (activeClubId && isOfficer(activeClubId)) return activeClubId;
    return availableClubs.length > 0 ? availableClubs[0].id : null;
  };

  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [dateObj, setDateObj] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(
    getInitialClubId(),
  );

  // Main Modal Animation States
  const [showModal, setShowModal] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Inner Club Modal Animation States
  const [clubModalTrigger, setClubModalTrigger] = useState(false);
  const [renderClubModal, setRenderClubModal] = useState(false);
  const clubSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const clubFadeAnim = useRef(new Animated.Value(0)).current;

  // --- Main Modal Animations ---
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

  // --- Inner Club Modal Animations ---
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
      setSelectedClubId(getInitialClubId());
    }
  }, [isVisible, clubId, isAdmin]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDateObj(selectedDate);
    }
  };

  const resetForm = () => {
    setTitle("");
    setVenue("");
    setDateObj(new Date());
    setSelectedClubId(getInitialClubId());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = () => {
    if (
      !title.trim() ||
      !venue.trim() ||
      (!isAdmin && selectedClubId === null)
    ) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    const dateStr = dateObj.toISOString().split("T")[0];

    createSession.mutate(
      {
        club_id: selectedClubId === null ? undefined : selectedClubId,
        title,
        venue,
        date: dateStr,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Session Created!",
            text2: `"${title}" has been successfully created.`,
          });
          queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
          handleClose();
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || "Something went wrong.";
          Toast.show({
            type: "error",
            text1: "Creation Failed",
            text2: msg,
          });
        },
      },
    );
  };

  const isFormValid =
    title.trim() !== "" &&
    venue.trim() !== "" &&
    (isAdmin || selectedClubId !== null);

  // --- Main Modal PanResponder ---
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

  // --- Inner Club Modal PanResponder ---
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
    ? [{ id: null, name: "General", logo_url: null }, ...availableClubs]
    : availableClubs;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
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
              {/* Main Modal Drag Handle */}
              <View
                {...mainPanResponder.panHandlers}
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
                  Create Session
                </Text>

                {/* Host Club / Context Selection */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Select Club
                  </Text>
                  <TouchableOpacity
                    onPress={() => setClubModalTrigger(true)}
                    className="flex-row items-center justify-between bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-xl px-4 py-4"
                  >
                    <Text className="text-card-fg dark:text-dark-card-fg text-sm">
                      {selectedClubId === null
                        ? "General Attendance"
                        : clubs.find((c) => c.id === selectedClubId)?.name ||
                          "Select a club"}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Session Title
                  </Text>
                  <TextInput
                    placeholder="e.g., General Assembly"
                    placeholderTextColor="#9ca3af"
                    value={title}
                    onChangeText={setTitle}
                    className="border border-border dark:border-dark-border rounded-xl px-4 py-4 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Venue
                  </Text>
                  <TextInput
                    placeholder="e.g., Main Hall"
                    placeholderTextColor="#9ca3af"
                    value={venue}
                    onChangeText={setVenue}
                    className="border border-border dark:border-dark-border rounded-xl px-4 py-4 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg"
                  />
                </View>

                <View className="mb-8">
                  <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                    Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    className="border border-border dark:border-dark-border rounded-xl px-4 py-4 bg-background dark:bg-dark-bg flex-row justify-between items-center"
                  >
                    <Text className="text-card-fg dark:text-dark-card-fg text-sm">
                      {dateObj.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>

                {showPicker && (
                  <View
                    className={
                      Platform.OS === "ios"
                        ? "mb-6 bg-muted/20 dark:bg-dark-muted/20 rounded-xl p-2"
                        : ""
                    }
                  >
                    {Platform.OS === "ios" && (
                      <View className="flex-row justify-end mb-2">
                        <TouchableOpacity onPress={() => setShowPicker(false)}>
                          <Text className="text-primary dark:text-dark-primary font-bold">
                            Done
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <DateTimePicker
                      value={dateObj}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "calendar"}
                      onChange={onChangeDate}
                    />
                  </View>
                )}

                <TouchableOpacity
                  disabled={!isFormValid || createSession.isPending}
                  onPress={handleCreate}
                  className={`py-4 rounded-xl items-center ${
                    !isFormValid || createSession.isPending
                      ? "bg-primary/50 dark:bg-dark-primary/50"
                      : "bg-primary dark:bg-dark-primary"
                  }`}
                >
                  {createSession.isPending ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Create Session
                    </Text>
                  )}
                </TouchableOpacity>

                <Text className="text-center text-[10px] text-muted-fg dark:text-dark-muted-fg uppercase mt-3 tracking-widest">
                  This action will notify session members
                </Text>
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>

      {/* INNER CLUB SELECTION MODAL */}
      {renderClubModal && (
        <Modal
          visible={renderClubModal}
          transparent
          animationType="none"
          onRequestClose={() => setClubModalTrigger(false)}
        >
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
                <View
                  {...clubPanResponder.panHandlers}
                  className="w-full pt-4 pb-2 items-center bg-transparent"
                >
                  <View className="w-14 h-1.5 bg-muted dark:bg-dark-muted rounded-full mb-2" />
                </View>

                <View className="px-6">
                  <View className="mb-6">
                    <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-1">
                      Select Club
                    </Text>
                    <Text className="text-sm text-muted-fg dark:text-dark-muted-fg">
                      Select which club this session belongs to
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
                            <MaterialCommunityIcons
                              name="grid"
                              size={24}
                              color="#64748b"
                            />
                          ) : item.logo_url ? (
                            <Image
                              source={{ uri: item.logo_url }}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name="account-group"
                              size={22}
                              color="#64748b"
                            />
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
                          {item.id === null && (
                            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg mt-0.5">
                              Available to all students
                            </Text>
                          )}
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
