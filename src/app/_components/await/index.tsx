import type { ReactNode } from "react";

interface AwaitProps<T> {
  promise: Promise<T>;
  children: (result: T) => ReactNode;
}

const Await = async <T,>({ promise, children }: AwaitProps<T>) => {
  const result = await promise;

  return children(result);
};

export default Await;
