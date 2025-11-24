"use client";

import { useAuthControllerGetCurrentUser } from "@/api/auth/auth";
import { useAuthControllerLogout } from "@/api/auth/auth";
import { API_URL } from "@/lib/constants";

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
    const loginUrl = `${API_URL}/api/v1/auth/microsoft`;
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
