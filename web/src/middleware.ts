import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("connect.sid");
  const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isOnHome = request.nextUrl.pathname === "/";

  // Validate session with backend if cookie exists
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

      const response = await fetch(`${apiUrl}/auth/user`, {
        method: "GET",
        headers: {
          Cookie: `connect.sid=${sessionCookie.value}`,
        },
        credentials: "include",
      });

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
