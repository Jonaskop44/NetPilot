"use client";

import { useUserControllerGetUserProfile } from "@/api/user/user";

export function useUserProfile() {
  const {
    data: userProfile,
    isLoading,
    error,
    refetch,
  } = useUserControllerGetUserProfile();

  // Check if response contains error
  const hasError = userProfile && "error" in userProfile;

  return {
    user: hasError ? null : userProfile,
    isLoading,
    error: hasError ? (userProfile as { error: string }).error : error,
    refetch,
  };
}
