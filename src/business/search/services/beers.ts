import { Beer } from 'business/beer/types';
import { api } from 'technical/api';

export const SearchBeers = async (name: string, count: number) => {
  const response = await api.get<Beer[]>(
    `/beers/search/${name}?count=${count}`,
  );

  if (response.status !== 200) {
    throw new Error(
      'Something went wrong on our side while searching for beers.',
    );
  }

  return response.data;
};
