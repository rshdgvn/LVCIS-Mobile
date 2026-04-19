import { useEventMutations } from "@/src/hooks/useEvents";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import EventCreateScreen from "@/src/screens/private/events/EventCreateScreen";
import React from "react";
import Toast from "react-native-toast-message";

export default function CreateEventRoute() {
  const router = useThrottledRouter();
  const { createEvent, isCreating } = useEventMutations();

  const handleCreate = async (formData: FormData) => {
    try {
      await createEvent(formData);
      Toast.show({ type: "success", text1: "Event created successfully!" });
      router.back();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Failed to create event. Please check inputs.";
      Toast.show({ type: "error", text1: "Action Failed", text2: msg });
    }
  };

  return (
    <EventCreateScreen
      isCreating={isCreating}
      onBack={() => router.back()}
      onSubmit={handleCreate}
    />
  );
}
