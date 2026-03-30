// useGoogleAuth.ts
import { API_URL } from "@/src/utils/config";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const promptGoogleAuth = async (mode: "login" | "signup") => {
    try {
      const redirectUrl = Linking.createURL("/(auth)/login");

      const authUrl = `${API_URL}auth/google?mode=${mode}&platform=mobile&mobile_app_url=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl,
      );

      if (result.type === "success" && result.url) {
        const parsedUrl = Linking.parse(result.url);
        const queryParams = parsedUrl.queryParams;

        const token = queryParams?.token as string | undefined;
        const error = queryParams?.error as string | undefined;
        const status = queryParams?.status as string | undefined;

        if (error) {
          Alert.alert("Authentication Failed", error);
          return null;
        }

        if (status === "signup_success") {
          Alert.alert(
            "Account Created",
            "Please check your email to verify your account before logging in.",
          );
          return null;
        }

        if (token) {
          return token;
        }
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong opening Google Sign-In.");
    }
    return null;
  };

  return { promptGoogleAuth };
};
