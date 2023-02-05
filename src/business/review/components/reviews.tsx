import { useContext, useEffect, useState } from 'react';

import Review from 'business/review/components';
import { ReviewType } from 'business/review/types';
import { ApiError } from 'technical/api/types/error';
import Alert from 'ui/alert';
import { AlertContext } from 'ui/alert/provider';
import { AlertType } from 'ui/alert/types';
import Spinner from 'ui/spinner';

interface ReviewsProps {
  beerId: number;
  GetReviewsAPI: (id: number) => Promise<ReviewType[]>;
  unauthorizedMessage: string;
  emptyMessage: string;
}

const Reviews = ({
  beerId,
  GetReviewsAPI,
  unauthorizedMessage,
  emptyMessage,
}: ReviewsProps) => {
  const { triggerAlert } = useContext(AlertContext);

  const [unauthorized, setUnauthorized] = useState(false);

  const [reviews, setReviews] = useState<ReviewType[] | null | undefined>(
    undefined,
  );

  const fetchReviews = async () => {
    try {
      const reviewsResult = await GetReviewsAPI(beerId);
      setReviews(reviewsResult);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setUnauthorized(true);
          setReviews(null);
        } else if (error.status === 404) {
          triggerAlert(
            <Alert
              type={AlertType.ERROR}
              compact={true}
              title={error.message}
            />,
          );
          setReviews(null);
        } else {
          triggerAlert(
            <Alert
              type={AlertType.ERROR}
              compact={false}
              title="Server error"
              description={error.message}
            />,
          );
        }
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (reviews === undefined) {
    return (
      <div className="flex flex-col items-center">
        <p className="mb-4 text-gray-900 dark:text-gray-50">
          Loading reviews...
        </p>
        <Spinner size="small" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-gray-900 dark:text-gray-50">{unauthorizedMessage}</p>
      </div>
    );
  }

  if (reviews === null) {
    return null;
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <p className="text-gray-900 dark:text-gray-50">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
};

export default Reviews;
