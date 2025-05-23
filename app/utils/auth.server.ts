// app/utils/auth.server.ts
import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { db } from "./db.server";

// Define session data type
export type SessionData = {
  userId: string;
};

// Create the session storage
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "taskforge_session", // Cookie name
    secrets: ["super-secret-key"], // Replace with environment variable in production
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

// Create the authenticator and attach sessionStorage
export const authenticator = new Authenticator<SessionData>(sessionStorage);

// Add form-based login strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (!email || !password) {
      throw new Error("Email or password not entered!");
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("The password is incorrect!");
    }

    return { userId: user.id };
  }),
  "user-pass" // Strategy name
);
