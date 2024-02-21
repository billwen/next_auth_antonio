import {auth} from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  console.log("Route: ", req.nextUrl.pathname);
});

// Optional, don't invoke the middleware on some paths
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
};
