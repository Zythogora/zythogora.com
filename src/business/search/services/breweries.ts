import { Brewery } from 'business/brewery/types';
import { api } from 'technical/api';
import { ApiError } from 'technical/api/types/error';

export const SearchBreweries = async (name: string, count: number) => {
  let response;
  try {
    response = await api.get<Brewery[]>(
      `/breweries/search/${name}?count=${count}`,
    );
  } catch (error: any) {
    throw new ApiError(
      500,
      'Something went wrong on our side while searching for breweries.',
    );
  }

  return response.data;
};
