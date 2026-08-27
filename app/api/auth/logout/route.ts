import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/jwt";

// Đăng xuất = xoá cookie phiên của chính trình duyệt này. Tài khoản dùng chung
// nên không đụng gì tới DB: người khác đang đăng nhập vẫn giữ nguyên phiên.
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
