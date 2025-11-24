import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  API_URL_DEVELOPMENT,
  API_URL_PRODUCTION,
  isProduction,
} from "./lib/constants";

export default async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("connect.sid");
  const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isOnHome = request.nextUrl.pathname === "/";

  // Validate session with backend if cookie exists
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const response = await fetch(
        isProduction
          ? `${API_URL_PRODUCTION}/api/v1/auth/user`
          : `${API_URL_DEVELOPMENT}/api/v1/auth/user`,
        {
          method: "GET",
          headers: {
            Cookie: `connect.sid=${sessionCookie.value}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        isAuthenticated = data.isAuthenticated || false;
      }
    } catch (error) {
      console.error("Error validating session:", error);
    }
  }

  // Redirect to dashboard if authenticated and on home page
  if (isAuthenticated && isOnHome) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect to home if not authenticated and trying to access dashboard
  if (!isAuthenticated && isOnDashboard) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
