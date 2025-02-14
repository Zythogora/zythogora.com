"use client";

import { signUp } from "@/app/[locale]/(auth)/sign-up/actions";

const SignUpPage = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <form action={signUp} className="flex w-128 flex-col gap-y-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="rounded-lg border bg-stone-50 px-4 py-2 drop-shadow"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-lg border bg-stone-50 px-4 py-2 drop-shadow"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="rounded-lg border bg-stone-50 px-4 py-2 drop-shadow"
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;
