"use client";

import { UserDto } from "@/api/openapi.schemas";

interface UserProfileProps {
  user: UserDto;
  onLogout: () => void;
  isLoading?: boolean;
}

export default function UserProfile({
  user,
  onLogout,
  isLoading = false,
}: UserProfileProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Benutzer-Profil
        </h2>
        <button
          onClick={onLogout}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? "Abmelden..." : "Abmelden"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user.username?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user.username || "Unbekannter Benutzer"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Benutzer-ID:
            </span>
            <span className="text-gray-900 dark:text-white font-mono text-xs">
              {user.id ? String(user.id).substring(0, 8) + "..." : "N/A"}
            </span>
          </div>
          {user.createdAt && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Registriert am:
              </span>
              <span className="text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString("de-DE")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
