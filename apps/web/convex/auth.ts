import { convexAuth, getAuthUserId } from "@convex-dev/better-auth/convex";
import { Password } from "@convex-dev/better-auth/providers";
import { DataModel } from "./_generated/dataModel";

/**
 * Better Auth configuration for Convex
 *
 * Features:
 * - Email/password authentication
 * - User sessions stored in Convex database
 * - Automatic user profile creation
 */
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
});

/**
 * Helper to get the current authenticated user ID
 * Throws an error if the user is not authenticated
 */
export async function requireAuth(ctx: { auth: () => Promise<{ userId: string | null }> }) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Unauthorized: User must be logged in");
  }
  return userId;
}
