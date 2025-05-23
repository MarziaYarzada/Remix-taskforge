// app/utils/session.server.ts
import { redirect } from "@remix-run/node";
import { sessionStorage } from "./auth.server";

// Helper to ensure user is authenticated
export async function requireUserId(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");

  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}
