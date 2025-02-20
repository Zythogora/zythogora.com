export type PaginationParams<T> = T & {
  page?: number;
  limit?: number;
};

export type PaginatedResults<T> = {
  results: T[];
  count: number;
  page: {
    current: number;
    total: number;
  };
};
