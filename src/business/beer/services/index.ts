import { Beer } from 'business/beer/types';
import { api } from 'technical/api';
import { ApiError } from 'technical/api/types/error';

export const GetBeer = async (beerId: number) => {
  let response;
  try {
    response = await api.get<Beer>(`/beers/${beerId}`);
  } catch (error: any) {
    throw new ApiError(
      500,
      'Something went wrong on our side while fetching your beer.',
    );
  }

  if (response.status === 404) {
    throw new ApiError(404, 'That beer does not exist.');
  }

  return response.data;
};
