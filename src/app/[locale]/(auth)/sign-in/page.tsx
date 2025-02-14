"use client";

import { signIn } from "@/app/[locale]/(auth)/sign-in/actions";

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>

      <form action={signIn}>
        <input name="email" type="email" placeholder="Email" />

        <input name="password" type="password" placeholder="Password" />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignInPage;
