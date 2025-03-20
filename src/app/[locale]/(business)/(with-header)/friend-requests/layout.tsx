import type { PropsWithChildren } from "react";

const FriendRequestLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full flex-col items-center gap-y-12 p-8">
      {children}
    </div>
  );
};

export default FriendRequestLayout;
