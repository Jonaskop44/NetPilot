"use client";

import { useAuthControllerGetCurrentUser } from "@/api/auth/auth";
import { useAuthControllerLogout } from "@/api/auth/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const useAuth = () => {
  const {
    data: authData,
    isLoading,
    refetch: checkAuthStatus,
  } = useAuthControllerGetCurrentUser();

  // Logout mutation
  const { mutate: logoutMutation, isPending: isLoggingOut } =
    useAuthControllerLogout({
      mutation: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });

  const user = authData?.user || null;
  const isAuthenticated = authData?.isAuthenticated || false;

  const login = () => {
    const loginUrl = `${API_BASE_URL}/auth/microsoft`;
    window.location.href = loginUrl;
  };

  const logout = () => {
    logoutMutation();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isLoggingOut,
    login,
    logout,
    checkAuthStatus,
  };
};

export default useAuth;
