import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const expectedUsername = process.env.APP_LOGIN_USERNAME ?? "";
    const expectedPassword = process.env.APP_LOGIN_PASSWORD ?? "";
    const sessionToken = process.env.APP_SESSION_TOKEN ?? "";

    if (!expectedUsername || !expectedPassword || !sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: "后台登录未配置，请先补充环境变量。",
        },
        { status: 400 }
      );
    }

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "账号或密码错误。",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "登录失败。",
      },
      { status: 500 }
    );
  }
}
