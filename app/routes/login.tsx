import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { authenticator, sessionStorage } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  // Try to authenticate the user using the "user-pass" strategy
  const user = await authenticator.authenticate("user-pass", request, {
    failureRedirect: "/login",
  });

  // Create a new session and store the userId
  const session = await sessionStorage.getSession();
  session.set("userId", user.userId); // ✅ Store userId in cookie

  // Redirect to /dashboard with Set-Cookie header
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <Form method="post" className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="email"
          required
          className="border p-2 w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          required
          className="border p-2 w-full"
        />
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </Form>
    </div>
  );
}
