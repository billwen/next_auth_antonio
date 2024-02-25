/**
 * An array of routes that are public and do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = [
  "/"
];

/**
 * An array of routes that require authentication.
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error"
];

/**
 * The prefix for API routes.
 * Routes that start with this prefix are considered API routes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after a successful login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
