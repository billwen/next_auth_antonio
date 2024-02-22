import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes} from "@/routes";

const {auth} = NextAuth(authConfig);

export default auth((req) => {
  const {nextUrl} = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    // Allow API routes to be accessed without authentication, Do nothing
    return;
  }

  if (isAuthRoute) {
    // Allow auth routes to be accessed without authentication, Do nothing
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    // Allow public routes to be accessed without authentication, Do nothing
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return;
});

// Optional, don't invoke the middleware on some paths
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
};
