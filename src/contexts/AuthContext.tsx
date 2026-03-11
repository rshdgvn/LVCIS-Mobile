import { setUnauthorizedCallback } from "@/src/api/api";
import { authService } from "@/src/services/authService";
import { userService } from "@/src/services/userService";
import { AuthContextType, RegisterPayload } from "@/src/types/auth";
import { User } from "@/src/types/user";
import { TOKEN_KEY } from "@/src/utils/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect } from "react";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedCallback(() => {
      queryClient.setQueryData(["user"], null);
      router.replace("/(auth)/login");
    });
  }, [queryClient, router]);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return null;
      try {
        const response = await userService.getUserProfile();

        return {
          ...response.user,
          member: response.member,
        } as User;
      } catch (error) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
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
    queryClient.setQueryData(["user"], newUser);
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.log("Logout error", e);
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries();
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
