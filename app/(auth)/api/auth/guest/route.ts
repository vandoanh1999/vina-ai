import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
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

    console.log("Attempting guest sign in");
    return await signIn("guest", { redirect: true, redirectTo: redirectUrl });
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
