import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  console.log("--- PUSH NOTIFICATION SETUP STARTED ---");
  let token;

  if (Platform.OS === "android") {
    console.log("Setting up Android notification channel...");
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    console.log("Checking notification permissions...");
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      console.log("Permission not granted yet, asking user...");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.error("❌ Failed to get push token: User denied permission!");
      return null;
    }

    console.log("Permission granted! Fetching Project ID...");
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn(
        "⚠️ Project ID not found. Ensure EAS is configured correctly in app.json.",
      );
    } else {
      console.log("Project ID found:", projectId);
    }

    try {
      console.log("Requesting token from Expo servers...");
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("✅ Successfully retrieved Expo Push Token:", token);
    } catch (e) {
      console.error("❌ Error getting Expo Push Token:", e);
    }
  } else {
    console.error(
      "❌ Must use a physical device for Push Notifications. Simulators will not work.",
    );
  }

  console.log("--- PUSH NOTIFICATION SETUP FINISHED ---");
  return token;
}
