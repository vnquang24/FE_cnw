import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserInfo } from "./lib/auth";

type UserRole = "ADMIN" | "USER";

// Định nghĩa danh sách các routes công khai không cần xác thực
const publicRoutes = [
  "/login",
  "/register",
  "/public", // Tất cả routes trong public (/public/*)
  "/_next", // Next.js static files
  "/api/auth", // API routes xác thực
  "/api/public", // API routes công khai (nếu có)
];

const ADMIN_PREFIX = "/admin";
const USER_PREFIX = "/user";

const DEFAULT_ROUTE: Record<UserRole, string> = {
  ADMIN: `${ADMIN_PREFIX}/dashboard`,
  USER: `${USER_PREFIX}/courses`,
};

// Routes API được bảo vệ
const protectedApiRoutes = [
  "/api/courses",
  "/api/lessons",
  "/api/admins",
  "/api/tests",
  "/api/components",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const role = decodeRoleFromToken(accessToken);
  const infor = getUserInfo();
  console.log("THOONG TIN NÈ", infor);
  const redirect = (target: string) =>
    NextResponse.redirect(new URL(target, request.url));
  const defaultRoute = role ? DEFAULT_ROUTE[role] : "/public";
  const redirectToLoginWithReturn = () => {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  };

  if (pathname === "/") {
    if (accessToken && role) {
      return redirect(defaultRoute);
    }
    return redirect("/public");
  }

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (
      accessToken &&
      role &&
      (pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
      return redirect(defaultRoute);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!accessToken) {
      return redirectToLoginWithReturn();
    }
    if (role !== "ADMIN") {
      return redirect(role ? DEFAULT_ROUTE[role] : "/public");
    }
    return NextResponse.next();
  }

  if (pathname.startsWith(USER_PREFIX)) {
    if (!accessToken) {
      return redirectToLoginWithReturn();
    }
    if (role !== "USER") {
      return redirect(role ? DEFAULT_ROUTE[role] : "/public");
    }
    return NextResponse.next();
  }

  if (protectedApiRoutes.some((route) => pathname.startsWith(route))) {
    if (!accessToken) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { status: 401, headers: { "content-type": "application/json" } },
      );
    }
    return NextResponse.next();
  }

  if (!accessToken) {
    if (
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register") &&
      !pathname.startsWith("/public")
    ) {
      return redirect("/public");
    }
  } else if (role) {
    if (role === "ADMIN" && pathname.startsWith(USER_PREFIX)) {
      return redirect(DEFAULT_ROUTE.ADMIN);
    }
    if (role === "USER" && pathname.startsWith(ADMIN_PREFIX)) {
      return redirect(DEFAULT_ROUTE.USER);
    }
  }

  return NextResponse.next();
}

function decodeRoleFromToken(token?: string): UserRole | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadSegment = parts[1];
    const decodedPayload = base64UrlDecode(payloadSegment);
    const parsed = JSON.parse(decodedPayload) as { role?: string } | undefined;
    console.log("Decoded token payload:", parsed);
    if (parsed?.role === "ADMIN" || parsed?.role === "USER") {
      return parsed.role;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  const normalized = padded + "=".repeat(padLength);

  if (typeof globalThis.atob === "function") {
    return globalThis.atob(normalized);
  }

  const bufferCtor = (
    globalThis as typeof globalThis & { Buffer?: typeof Buffer }
  ).Buffer;
  if (bufferCtor) {
    return bufferCtor.from(normalized, "base64").toString("utf-8");
  }

  throw new Error("No base64 decoder available");
}

// Chỉ định các routes cần được middleware xử lý
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (*.png, *.jpg, *.jpeg, *.gif, *.svg, *.ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico)$).*)",
  ],
};
