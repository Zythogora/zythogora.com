import { AxiosError } from 'axios';

import { Beer } from 'business/beer/types';
import { api } from 'technical/api';
import { ApiError } from 'technical/api/types/error';

export const GetBeer = async (beerId: number) => {
  try {
    const response = await api.get<Beer>(`/beers/${beerId}`);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 404) {
        throw new ApiError(404, 'That beer does not exist.');
      } else {
        throw new ApiError(
          error.response.status,
          'Something went wrong on our side while fetching your beer.',
        );
      }
    }
    throw error;
  }
};
