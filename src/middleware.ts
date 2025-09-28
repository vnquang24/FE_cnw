import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Định nghĩa danh sách các routes công khai không cần xác thực
const publicRoutes = [
  "/login",
  "/register",
  "/public", // Tất cả routes trong public (/public/*)
  "/_next", // Next.js static files
  "/api/auth", // API routes xác thực
  "/api/public", // API routes công khai (nếu có)
];

// Routes được bảo vệ cần xác thực (tất cả routes trong /main)
const protectedRoutes = [
  "/main", // Tất cả routes trong main (/main/*)
];

// Routes API được bảo vệ
const protectedApiRoutes = [
  "/api/courses",
  "/api/lessons",
  "/api/users",
  "/api/tests",
  "/api/components",
];

// Tối ưu middleware để xử lý nhiều requests cùng lúc
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Chỉ log khi cần debug
  // console.log(`Middleware: ${pathname}, Token: ${accessToken ? 'có' : 'không'}`);

  // Kiểm tra nếu đang ở trang chủ
  if (pathname === "/") {
    // Nếu đã đăng nhập, chuyển đến dashboard
    if (accessToken) {
      // console.log('Root -> Dashboard (có token)');
      return NextResponse.redirect(new URL("/main/dashboard", request.url));
    }
    // Nếu chưa đăng nhập, chuyển đến public page
    // console.log('Root -> Public (không có token)');
    return NextResponse.redirect(new URL("/public", request.url));
  }

  // Kiểm tra routes công khai - cho phép truy cập tự do
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // Nếu đã đăng nhập và đang truy cập trang auth (login/register), chuyển về dashboard
    if (
      accessToken &&
      (pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
      return NextResponse.redirect(new URL("/main/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Kiểm tra routes được bảo vệ (main routes)
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Nếu chưa đăng nhập, chuyển đến trang login
    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Kiểm tra API routes được bảo vệ
  if (protectedApiRoutes.some((route) => pathname.startsWith(route))) {
    // Nếu chưa đăng nhập, trả về 401 Unauthorized
    if (!accessToken) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { status: 401, headers: { "content-type": "application/json" } },
      );
    }
    return NextResponse.next();
  }

  // Đối với các route khác không được định nghĩa rõ ràng
  if (!accessToken) {
    // Nếu không có token và không phải là public routes, chuyển về public
    if (
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register") &&
      !pathname.startsWith("/public")
    ) {
      // console.log(`Fallback -> Public (không có token): ${pathname}`);
      return NextResponse.redirect(new URL("/public", request.url));
    }
  } else {
    // Nếu có token và không phải là protected routes, cho phép truy cập
    if (!pathname.startsWith("/main")) {
      // console.log(`Allow access với token: ${pathname}`);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
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
