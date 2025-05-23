// app/routes/test.tsx
import { LoaderFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import {useLoaderData} from '@remix-run/react'

export const loader: LoaderFunction = async () => {
  const users = await db.user.findMany();
  return json(users);
};

export default function TestRoute() {
const data =useLoaderData<typeof loader>();
  console.log("Users:", data);

  return <h1>Check console for users </h1>;
}
