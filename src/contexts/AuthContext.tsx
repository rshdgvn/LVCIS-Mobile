import { setUnauthorizedCallback } from "@/src/api/api";
import { authService } from "@/src/services/authService";
import { userService } from "@/src/services/userService";
import { AuthContextType, RegisterPayload } from "@/src/types/auth";
import { User } from "@/src/types/user";
import { TOKEN_KEY } from "@/src/utils/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect } from "react";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const USER_CACHE_KEY = "USER_CACHE";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    setUnauthorizedCallback(async () => {
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "user",
      });
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_CACHE_KEY);
    });
  }, [queryClient]);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (!token) {
        return null;
      }

      try {
        const response = await userService.getUserProfile();
        console.log(JSON.stringify(response, null, 2));

        const fullUser = response as User;
        await SecureStore.setItemAsync(
          USER_CACHE_KEY,
          JSON.stringify(fullUser),
        );

        return fullUser;
      } catch (error: any) {
        console.log(
          "⚠️ [Auth Debug] API Fetch Failed. Error status:",
          error?.response?.status,
        );

        const cachedUser = await SecureStore.getItemAsync(USER_CACHE_KEY);

        if (cachedUser && error?.response?.status !== 401) {
          return JSON.parse(cachedUser) as User;
        }

        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_CACHE_KEY);
        return null;
      }
    },
    retry: false,
  });

  const signUp = async (data: RegisterPayload): Promise<void> => {
    await authService.register(data);
  };

  const signIn = async (token: string, newUser: User) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_CACHE_KEY, JSON.stringify(newUser));

    try {
      const response = await userService.getUserProfile();
      queryClient.setQueryData(["user"], response as User);
    } catch {
      queryClient.setQueryData(["user"], newUser);
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.log("Logout error", e);
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_CACHE_KEY);

      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "user",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
