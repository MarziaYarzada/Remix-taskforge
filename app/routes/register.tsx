//app/routes/register.tsx
import { ActionFunction, redirect,json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email=formData.get("email")?.toString();
  const password=formData.get("password")?.toString();
  if(!email || !password){
    return json({error:" email and password are required"})
  }
  const existingUser=await db.user.findUnique({where:{email}});
  if(existingUser){
    return json({error:"User already exist"})
  }
  const hashPassword=await bcrypt.hash(password,10);
  await db.user.create({
    data:{
        email,
        password:hashPassword
    }
  })
  return redirect("/login")
};
export default function Register() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registration</h1>
      <Form method="post" className="space-y-4">
        <input name="email" type="email" placeholder="email" required className="border p-2 w-full" />
        <input name="password" type="password" placeholder="password " required className="border p-2 w-full" />
        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">register</button>
      </Form>
    </div>
  );
}