import type { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <div className="flex h-screen flex-col">{children}</div>;
};

export default AuthLayout;
