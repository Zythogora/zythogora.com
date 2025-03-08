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
      total: Math.max(Math.ceil(count / limit), 1),
    },
  };
};
