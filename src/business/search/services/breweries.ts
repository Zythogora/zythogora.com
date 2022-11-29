import { Brewery } from 'business/brewery/types';
import { api } from 'technical/api';

export const SearchBreweries = async (name: string, count: number) => {
  const response = await api.get<Brewery[]>(
    `/breweries/search/${name}?count=${count}`,
  );

  if (response.status !== 200) {
    throw new Error(
      'Something went wrong on our side while searching for breweries.',
    );
  }

  return response.data;
};
