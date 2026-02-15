import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext } from "react";
import { authService } from "../services/authService";
import { AuthContextType, RegisterPayload, User } from "../types/auth";
import { TOKEN_KEY } from "../utils/constant";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return null;
      try {
        return await authService.getUser();
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
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    queryClient.setQueryData(["user"], null);
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
