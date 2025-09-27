const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface User {
  id: string;
  name?: string;
  username?: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  providerId?: string;
}

interface AuthResponse {
  isAuthenticated: boolean;
  user?: User;
}

export const authService = {
  async checkAuthStatus(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check auth status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error checking auth status:", error);
      return { isAuthenticated: false };
    }
  },

  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  getLoginUrl(): string {
    return `${API_BASE_URL}/auth/microsoft`;
  },

  async getUserProfile(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.error ? null : data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },
};

export type { User, AuthResponse };
