import { unstable_cache } from "next/cache";

type CacheOptions<TArgs extends unknown[], TResult> = {
  callback: (...params: TArgs) => Promise<TResult>;
  tags?: (params: TArgs) => string[];
  expiresAfter?: number;
};

export const nextCache =
  <TArgs extends unknown[], TResult>(config: CacheOptions<TArgs, TResult>) =>
  async (...args: TArgs): Promise<TResult> =>
    unstable_cache(config.callback, [], {
      tags: config.tags?.(args) ?? [],
      revalidate: config.expiresAfter ?? false,
    })(...args);
