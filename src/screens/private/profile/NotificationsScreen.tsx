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

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-dark-bg"
      edges={["top"]}
    >
      <View className="flex-row items-center px-4 py-3 bg-background dark:bg-dark-bg">
        <TouchableOpacity
          onPress={onBack}
          className="w-9 h-9 rounded-full bg-muted dark:bg-dark-muted justify-center items-center"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={22}
            color={isDark ? "#f8f9fa" : "#1c1e26"}
          />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-[17px] font-semibold text-muted-fg dark:text-dark-muted-fg">
          Notifications
        </Text>

        <View className="w-9" />
      </View>

      <View className="px-4 pb-3">
        <View
          className={`flex-row items-center bg-input dark:bg-dark-input rounded-xl px-3 gap-2 ${
            Platform.OS === "ios" ? "py-2.5" : "py-1.5"
          }`}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={isDark ? "#adb2c3" : "#848a9e"}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notification"
            placeholderTextColor={isDark ? "#adb2c3" : "#848a9e"}
            className="flex-1 text-[14px] text-foreground dark:text-dark-fg p-0"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={isDark ? "#adb2c3" : "#848a9e"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-row px-4 gap-2 mb-4">
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full border ${
              activeFilter === f
                ? "bg-primary dark:bg-dark-primary border-primary dark:border-dark-primary"
                : "bg-card dark:bg-dark-card border-border dark:border-dark-border"
            }`}
          >
            <Text
              className={`text-[13px] font-semibold ${
                activeFilter === f
                  ? "text-primary-fg dark:text-dark-primary-fg"
                  : "text-muted-fg dark:text-dark-muted-fg"
              }`}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color={primaryColor} />
        </View>
      ) : groups.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={52}
            color={isDark ? "#adb2c3" : "#848a9e"}
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
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color={primaryColor} />
              </View>
            ) : null
          }
          renderItem={({ item: group }) => (
            <View className="mb-2">
              <View className="flex-row justify-between items-center px-5 py-2">
                <Text className="text-[13px] font-semibold text-muted-fg dark:text-dark-muted-fg">
                  {group.label}
                </Text>
                <TouchableOpacity
                  onPress={() => handleClearSection(group.label, group.data)}
                >
                  <Text className="text-[13px] font-semibold text-primary dark:text-dark-primary">
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-card dark:bg-dark-card rounded-2xl mx-4 overflow-hidden border border-border dark:border-dark-border">
                {group.data.map((item, idx) => (
                  <View key={item.id}>
                    <NotificationRow item={item} onDelete={handleDelete} />
                    {idx < group.data.length - 1 && (
                      <View className="h-[1px] bg-border dark:bg-dark-border ml-20" />
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
