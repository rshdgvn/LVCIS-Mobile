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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    setUnauthorizedCallback(() => {
      // 1. Instantly set user to null (isAuthenticated becomes false, isLoading stays false)
      queryClient.setQueryData(["user"], null);

      // 2. Wipe all other queries (clubs, members) to protect sensitive data,
      // but leave the "user" query alone so it doesn't trigger a hard layout-freezing re-fetch.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "user",
      });
    });
  }, [queryClient]);

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
    try {
      const response = await userService.getUserProfile();
      queryClient.setQueryData(["user"], {
        ...response,
        member: response.member,
      } as User);
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

      // Use the exact same clean wipe logic here!
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "user",
      });

      // Note: No router.replace here! The _layout.tsx will see user is null,
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
