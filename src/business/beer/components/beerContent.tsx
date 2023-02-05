import Reviews from 'business/review/components/reviews';
import { GetFriendsReviews, GetMyReviews } from 'business/review/services';
import TabView from 'ui/tabView';

interface BeerContentProps {
  beerId: number;
}

const BeerContent = ({ beerId }: BeerContentProps) => {
  return (
    <TabView
      tabs={{
        'My Reviews': (
          <Reviews
            key="myReviews"
            beerId={beerId}
            GetReviewsAPI={GetMyReviews}
            unauthorizedMessage="You need to be logged in to access your reviews."
            emptyMessage="You have not tasted this beer (yet)..."
          />
        ),
        'Friends Reviews': (
          <Reviews
            key="friendReviews"
            beerId={beerId}
            GetReviewsAPI={GetFriendsReviews}
            unauthorizedMessage="You need to be logged in to access your friends reviews."
            emptyMessage="Your friends did not reviewed this beer (yet)..."
          />
        ),
      }}
      defaultTab="My Reviews"
    />
  );
};

export default BeerContent;
