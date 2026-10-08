import "server-only";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function getWalletCredential(request: NextRequest) {
  const secureCookie = request.nextUrl.protocol === "https:";
  return getToken({ req: request, secret: process.env.AUTH_SECRET, secureCookie });
}
