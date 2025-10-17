import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isDevelopmentEnvironment } from "@/lib/constants";

export async function GET(request: Request) {
  try {
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

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: !isDevelopmentEnvironment,
    });

    if (token) {
      console.log("User already authenticated, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Fix: Redirect to NextAuth signin endpoint instead of calling signIn()
    // This avoids the CallbackRouteError by using proper NextAuth flow
    console.log("Redirecting to NextAuth signin with guest provider");
    const nextAuthUrl = new URL("/api/auth/signin/guest", request.url);
    nextAuthUrl.searchParams.set("callbackUrl", redirectUrl);

    return NextResponse.redirect(nextAuthUrl);
  } catch (error) {
    console.error("Guest auth error:", error);

    // Return JSON error response instead of throwing
    return NextResponse.json(
      {
        error: "Failed to authenticate guest user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
