import { api } from "@/src/api/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/hooks/useTheme";
import { FilterType } from "@/src/types/notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "@/src/components/common/BackButton";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";

interface NotificationActor {
  id: number | null;
  name: string;
  avatar: string | null;
}

interface NotificationMeta {
  club_id?: number;
  club_name?: string;
  event_id?: number;
  event_title?: string;
  task_id?: number;
  task_title?: string;
  session_id?: number;
  status?: string;
  new_status?: string;
  new_role?: string;
}

interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  time_ago: string;
  actor: NotificationActor;
  meta: NotificationMeta;
}

interface Props {
  onBack: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
}

const groupByDate = (notifications: AppNotification[]) => {
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const groups: Record<string, AppNotification[]> = {};

  notifications.forEach((n) => {
    const d = new Date(n.created_at).toDateString();
    let label = "Earlier";
    if (d === todayStr) label = "Today";
    else if (d === yesterdayStr) label = "Yesterday";
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });

  const ordered: { label: string; data: AppNotification[] }[] = [];
  ["Today", "Yesterday", "Earlier"].forEach((label) => {
    if (groups[label]) ordered.push({ label, data: groups[label] });
  });

  return ordered;
};

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

const ActorAvatar = ({ actor }: { actor: NotificationActor }) => {
  const { primaryColor } = useTheme();

  if (actor?.avatar) {
    return (
      <Image
        source={{ uri: actor.avatar }}
        className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted"
      />
    );
  }

  if (!actor?.id) {
    return (
      <View className="w-12 h-12 rounded-full bg-primary/10 dark:bg-dark-primary/10 justify-center items-center border border-primary/20 dark:border-dark-primary/20">
        <MaterialCommunityIcons
          name="bell-outline"
          size={22}
          color={primaryColor}
        />
      </View>
    );
  }

  const initials = actor.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View className="w-12 h-12 rounded-full bg-primary/10 dark:bg-dark-primary/10 justify-center items-center">
      <Text className="text-primary dark:text-dark-primary font-bold text-base">
        {initials}
      </Text>
    </View>
  );
};

const NotificationRow = ({
  item,
  onDelete,
}: {
  item: AppNotification;
  onDelete: (id: string) => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleLongPress = () => {
    Alert.alert("Delete", "Remove this notification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start(() => onDelete(item.id));
        },
      },
    ]);
  };
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        onLongPress={handleLongPress}
        activeOpacity={0.75}
        className={`flex-row items-start px-5 py-3.5 bg-card dark:bg-dark-card ${
          item.is_read
            ? ""
            : "border-l-[3px] border-l-primary dark:border-l-dark-primary"
        }`}
      >
        <ActorAvatar actor={item.actor} />

        <View className="flex-1 ml-3">
          <View className="flex-row justify-between items-start">
            <Text
              className={`text-sm flex-1 mr-2 text-foreground dark:text-dark-fg ${
                item.is_read ? "font-semibold" : "font-bold"
              }`}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text className="text-[11px] text-muted-fg dark:text-dark-muted-fg shrink-0">
              {formatTime(item.created_at)}
            </Text>
          </View>

          <Text
            className="text-[13px] text-muted-fg dark:text-dark-muted-fg mt-1 leading-[18px]"
            numberOfLines={2}
          >
            {item.body}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationsScreen = ({
  onBack,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: Props) => {
  const { user } = useAuth();
  const { isDark, primaryColor } = useTheme();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNotifications = useCallback(
    async (pageNum = 1, replace = true) => {
      if (!user) return;
      try {
        const { data } = await api.get(
          `/notifications?page=${pageNum}&per_page=30`,
        );
        const items: AppNotification[] = data.notifications ?? [];

        setNotifications((prev) => (replace ? items : [...prev, ...items]));
        setLastPage(data.last_page ?? 1);
        setPage(pageNum);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [user],
  );

  const markAllRead = useCallback(async () => {
    if (!user) return;
    try {
      await api.post(`/notifications/read-all`);
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        })),
      );
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications().then(() => {
      setTimeout(markAllRead, 800);
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(1, true);
  };

  const onLoadMore = () => {
    if (loadingMore || page >= lastPage) return;
    setLoadingMore(true);
    fetchNotifications(page + 1, false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleClearSection = (label: string, items: AppNotification[]) => {
    Alert.alert(
      `Clear ${label}`,
      `Remove all ${label.toLowerCase()} notifications?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            const ids = items.map((n) => n.id);
            ids.forEach((id) => {
              api.delete(`/notifications/${id}`).catch(console.error);
            });
            setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
          },
        },
      ],
    );
  };

  const filtered = notifications.filter((n) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Read" && n.is_read) ||
      (activeFilter === "Unread" && !n.is_read);

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q) ||
      (n.actor?.name ?? "").toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const groups = groupByDate(filtered);

  const FILTERS: FilterType[] = ["All", "Read", "Unread"];

  const router = useThrottledRouter();

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-dark-bg"
      edges={["top"]}
    >
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <View className="z-10">
          <BackButton onPress={() => router.back()} />
        </View>
        <View className="absolute left-0 right-0 items-center">
          <Text className="text-[17px] font-medium text-gray-400 dark:text-dark-muted-fg">
            Notification
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 mt-2 mb-4">
        <View
          className={`flex-row items-center bg-white dark:bg-dark-input rounded-[16px] px-4 border border-gray-200 dark:border-dark-border ${
            Platform.OS === "ios" ? "py-3" : "py-2"
          }`}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color={isDark ? "#adb2c3" : "#a1a1aa"}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notification"
            placeholderTextColor={isDark ? "#adb2c3" : "#a1a1aa"}
            className="flex-1 text-[15px] text-foreground dark:text-dark-fg ml-2 p-0"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color="#a1a1aa"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <View className="flex-row px-6 gap-2.5 mb-6">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-[14px] border ${
                isActive
                  ? "bg-[#3b82f6] border-[#3b82f6]"
                  : "bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border"
              }`}
            >
              <Text
                className={`text-[13px] font-medium ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 dark:text-dark-muted-fg"
                }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List Section */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color={primaryColor} />
        </View>
      ) : groups.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={52}
            color={isDark ? "#adb2c3" : "#a1a1aa"}
          />
          <Text className="text-foreground dark:text-dark-fg text-[17px] font-bold mt-4">
            No notifications
          </Text>
          <Text className="text-muted-fg dark:text-dark-muted-fg text-[13px] text-center mt-1.5">
            {searchQuery
              ? "No results match your search."
              : "You're all caught up! We'll let you know when something happens."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(g) => g.label}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={primaryColor}
            />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item: group }) => (
            <View className="mb-4">
              <View className="flex-row justify-between items-center px-6 py-2">
                <Text className="text-[14px] font-semibold text-gray-400">
                  {group.label}
                </Text>
                <TouchableOpacity
                  onPress={() => handleClearSection(group.label, group.data)}
                >
                  <Text className="text-[13px] font-medium text-blue-500">
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-white dark:bg-dark-card rounded-2xl mx-5 overflow-hidden border border-gray-100 dark:border-dark-border">
                {group.data.map((item, idx) => (
                  <View key={item.id}>
                    <NotificationRow item={item} onDelete={handleDelete} />
                    {idx < group.data.length - 1 && (
                      <View className="h-[1px] bg-gray-100 dark:bg-dark-border ml-20" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;