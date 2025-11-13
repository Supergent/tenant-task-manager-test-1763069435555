import { httpRouter } from "convex/server";
import { auth } from "./auth";

/**
 * HTTP routes for the application
 *
 * Routes:
 * - /auth/* - Better Auth authentication endpoints
 */
const http = httpRouter();

// Mount Better Auth routes at /auth
auth.addHttpRoutes(http);

export default http;
