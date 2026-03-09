import { authClient } from "./auth-client";
import { headers } from "next/headers";

/**
 * Get session on the server (RSC, Server Actions).
 * Passes cookies from the incoming request to the auth API.
 */
export async function getSession() {
  const headersList = await headers();
  return authClient.getSession({
    fetchOptions: {
      headers: headersList,
      cache: "no-store",
    },
  });
}
