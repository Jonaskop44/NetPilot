"use client";

import { useState, useEffect } from "react";
import {
  authService,
  type User,
  type AuthResponse,
} from "@/services/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authResponse: AuthResponse = await authService.checkAuthStatus();
      setIsAuthenticated(authResponse.isAuthenticated);
      setUser(authResponse.user || null);
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    const loginUrl = authService.getLoginUrl();
    window.location.href = loginUrl;
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
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
}
