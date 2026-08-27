import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE_NAME } from "@/lib/jwt";

// Edge-compatible guard: JWT verification only (no DB — Prisma/pg doesn't run on edge).
// Kiểm tra tài khoản còn tồn tại + hạn phiên trải nghiệm nằm trong lib/auth.ts,
// chạy ở từng API route và server component.

const API_PREFIXES = ["/api/gemini", "/api/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bypass: never intercept static assets — fixes missing CSS/JS on Safari/iPad
  if (
    pathname.startsWith("/_next/") ||
    pathname.includes("/static/") ||
    /\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isApi = API_PREFIXES.some((p) => pathname.startsWith(p));

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await verifySession(token);
    return NextResponse.next();
  } catch {
    if (isApi) {
      return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ" }, { status: 401 });
    }
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
    return res;
  }
}

export const config = {
  matcher: [
    // Protect main app pages
    "/",
    "/admin/:path*",
    // Protect AI and admin APIs
    "/api/gemini/:path*",
    "/api/admin/:path*",
  ],
};
