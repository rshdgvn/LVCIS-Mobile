import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { API_URL } from '../utils/config';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const promptGoogleAuth = async (mode: 'login' | 'signup') => {
    try {
      const redirectUrl = Linking.createURL('auth/callback');
      
      const authUrl = `${API_URL}auth/google?mode=${mode}&platform=mobile`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === 'success' && result.url) {
        const urlParams = new URL(result.url).searchParams;
        const token = urlParams.get('token');
        const error = urlParams.get('error'); 
        const status = urlParams.get('status');

        if (error) {
          Alert.alert("Authentication Failed", error);
          return null;
        }

        if (status === 'signup_success') {
          Alert.alert(
            "Account Created", 
            "Please check your email to verify your account before logging in."
          );
          return null;
        }

        if (token) {
          return token;
        }
      }
    } catch (error) {
      console.error("Google OAuth Error:", error);
      Alert.alert("Error", "Something went wrong opening Google Sign-In.");
    }
    return null;
  };

  return { promptGoogleAuth };
};