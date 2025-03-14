export const getPaginatedResults = <T>(
  results: T[],
  count: number,
  page: number,
  limit: number,
) => {
  return {
    results,
    count,
    page: {
      current: page,
      total: count > 0 ? Math.ceil(count / limit) : 1,
    },
  };
};
