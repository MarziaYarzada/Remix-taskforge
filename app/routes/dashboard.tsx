// app/routes/dashboard.tsx
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  return json({ user });
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}!</h1>
      <Form method="post" action="/logout">
        <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </Form>
    </div>
  );
}
