import { AxiosError } from 'axios';

import { ReviewType } from 'business/review/types';
import { api } from 'technical/api';
import { ApiError } from 'technical/api/types/error';

export const GetMyReviews = async (beerId: number) => {
  try {
    const response = await api.get<ReviewType[]>(`/beers/${beerId}/reviews/me`);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 401) {
        throw new ApiError(
          401,
          'You need to be logged in to access your reviews.',
        );
      } else if (error.response.status === 404) {
        throw new ApiError(404, 'That beer does not exist.');
      } else {
        throw new ApiError(
          error.response.status,
          'Something went wrong on our side while fetching your reviews.',
        );
      }
    }
    throw error;
  }
};

export const GetFriendsReviews = async (beerId: number) => {
  try {
    const response = await api.get<ReviewType[]>(
      `/beers/${beerId}/reviews/friends`,
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 401) {
        throw new ApiError(
          401,
          'You need to be logged in to access your friends reviews.',
        );
      } else if (error.response.status === 404) {
        throw new ApiError(404, 'That beer does not exist.');
      } else {
        throw new ApiError(
          error.response.status,
          'Something went wrong on our side while fetching your friends reviews.',
        );
      }
    }
    throw error;
  }
};
