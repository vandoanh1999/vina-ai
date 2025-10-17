import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isDevelopmentEnvironment } from "@/lib/constants";

export async function GET(request: Request) {
  console.log("Guest auth endpoint called");

  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  // Check if AUTH_SECRET is available
  if (!process.env.AUTH_SECRET) {
    console.error(
      "Guest auth error: AUTH_SECRET environment variable is missing"
    );
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  let token: any = null;
  try {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: !isDevelopmentEnvironment,
    });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json(
      {
        error: "Failed to authenticate guest user",
        details: "Token verification failed",
      },
      { status: 500 }
    );
  }

  // Handle redirects outside try-catch to avoid NEXT_REDIRECT error
  if (token) {
    console.log("User already authenticated, redirecting to home");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to NextAuth signin endpoint with guest provider
  console.log("Redirecting to NextAuth signin with guest provider");
  const nextAuthUrl = new URL("/api/auth/signin/guest", request.url);
  nextAuthUrl.searchParams.set("callbackUrl", redirectUrl);

  return NextResponse.redirect(nextAuthUrl);
}
