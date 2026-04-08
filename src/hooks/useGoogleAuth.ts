import { API_URL } from "@/src/utils/config";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";

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
          Toast.show({
            type: "error",
            text1: error,
          });
          return null;
        }

        if (status === "signup_success") {
          Toast.show({
            type: "success",
            text1: "Account Created! Please verify your email.",
          });
          return null;
        }

        if (token) {
          return token;
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong opening Google Sign-In.",
      });
    }
    return null;
  };

  return { promptGoogleAuth };
};
