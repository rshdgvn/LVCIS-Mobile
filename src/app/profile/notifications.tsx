import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import NotificationsScreen from "@/src/screens/private/profile/NotificationsScreen";
import { FilterType } from "@/src/types/notifications";
import React, { useState } from "react";

const Notifications = () => {
  const router = useThrottledRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const handleBack = () => {
    router.back();
  };

  return (
    <NotificationsScreen
      onBack={handleBack}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    />
  );
};

export default Notifications;
