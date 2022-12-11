import { Beer } from 'business/beer/types';
import { api } from 'technical/api';
import { ApiError } from 'technical/api/types/error';

export const SearchBeers = async (name: string, count: number) => {
  let response;
  try {
    response = await api.get<Beer[]>(`/beers/search/${name}?count=${count}`);
  } catch (error: any) {
    throw new ApiError(
      500,
      'Something went wrong on our side while searching for beers.',
    );
  }

  return response.data;
};
