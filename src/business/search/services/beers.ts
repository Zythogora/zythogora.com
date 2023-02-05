import { AxiosError } from 'axios';

import { Beer } from 'business/beer/types';
import { api } from 'technical/api';
import { ApiError } from 'technical/api/types/error';

export const SearchBeers = async (name: string, count: number) => {
  try {
    const response = await api.get<Beer[]>(
      `/beers/search/${name}?count=${count}`,
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response) {
      throw new ApiError(
        error.response.status,
        'Something went wrong on our side while searching for beers.',
      );
    }
    throw error;
  }
};
