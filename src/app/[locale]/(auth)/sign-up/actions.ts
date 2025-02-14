"use server";

import { APIError } from "better-auth/api";

import { auth } from "@/lib/auth/server";
import prisma from "@/lib/prisma";

export const signUp = async (formData: FormData) => {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.users.findUnique({
    where: {
      username: username as string,
    },
  });

  if (existingUser) {
    throw new Error("Username taken");
  }

  let response;
  try {
    response = await auth.api.signUpEmail({
      body: {
        email: email as string,
        password: password as string,
        name: username as string,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      console.log({ body: error.body });
    }

    throw error;
  }

  await prisma.users.create({
    data: {
      id: response.user.id,
      username: username as string,
    },
  });
};
