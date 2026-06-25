import { NextResponse } from "next/server";

function makeLogoutResponse() {
  const response = NextResponse.redirect(
    process.env.NEXTAUTH_URL + "/login" || "https://talim-uz-git-main-axmatovar4-6298s-projects.vercel.app/login"
  );
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  return response;
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  return response;
}

export async function GET() {
  return makeLogoutResponse();
}
