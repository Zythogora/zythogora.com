"use server";

import { auth } from "@/lib/auth/server";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const response = await auth.api.signInEmail({
    body: {
      email: email as string,
      password: password as string,
    },
  });

  console.log(response);
};
