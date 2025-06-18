import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export default clerkMiddleware((auth, request) => {
  let anonId = request.cookies.get("anonId")?.value;
  let shouldSetCookie = false;

  if (!anonId) {
    anonId = uuidv4();
    shouldSetCookie = true;
  }

  const requestHeaders = new Headers(request.headers);
 // requestHeaders.set("x-anon-id", anonId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (shouldSetCookie) {
    response.cookies.set("anonId", anonId, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};