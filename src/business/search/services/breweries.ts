import { AxiosError } from 'axios';

import { Brewery } from 'business/brewery/types';
import { api } from 'technical/api';
import { ApiError } from 'technical/api/types/error';

export const SearchBreweries = async (name: string, count: number) => {
  try {
    const response = await api.get<Brewery[]>(
      `/breweries/search/${name}?count=${count}`,
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response) {
      throw new ApiError(
        error.response.status,
        'Something went wrong on our side while searching for breweries.',
      );
    }
    throw error;
  }
};
