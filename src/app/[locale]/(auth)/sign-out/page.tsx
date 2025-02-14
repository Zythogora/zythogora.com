"use client";

import { authClient } from "@/lib/auth/client";

const SignOutPage = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p>Fetching session</p>;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div>
      <p>Currently connected as {session?.user?.email}</p>

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default SignOutPage;
