import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import { ReviewType } from 'business/review/types';

interface ReviewProps {
  review: ReviewType;
}

const Review = ({ review }: ReviewProps) => {
  return (
    <div
      className="
        p-6 mb-6 last:mb-0 rounded-xl
        bg-gray-200
        dark:bg-gray-600
      "
    >
      <div className="flex flex-row justify-between px-6">
        <div className="flex flex-col">
          <Link
            to={`/users/${review.user.username}`}
            className="
              text-2xl font-bold
              text-black
              dark:text-gray-200
            "
          >
            {review.user.username}
          </Link>
          <h2 className="text-gray-600 dark:text-gray-200">
            {format(new Date(review.date), "do 'of' MMMM RRRR")}
          </h2>
        </div>

        <div className="w-fit h-[60px] pr-8">
          <h1
            className="
            relative font-bold text-3xl w-fit
            before:absolute before:top-3 before:-bottom-3 before:-right-2 before:content-[''] before:rotate-30 before:w-px
            after:absolute after:-bottom-6 after:-right-8 after:content-['10'] after:font-normal after:text-xl
            text-gray-900 before:bg-gray-500 after:text-gray-500
            dark:text-gray-50 dark:before:bg-gray-400 dark:after:text-gray-400
          "
          >
            {review.score}
          </h1>
        </div>
      </div>

      {review.comment && (
        <div
          className="
            mt-6 p-6 rounded-xl
            bg-gray-100
            dark:bg-gray-700
          "
        >
          <p
            className="
          text-justify [hyphens:auto]
          text-gray-800
          dark:text-gray-200
          "
          >
            {review.comment}
          </p>
        </div>
      )}
    </div>
  );
};

// #score {
//   position: relative;
//   font-weight: bold;
//   font-size: 48px;
//   width: fit-content;
// }

// #score::before {
//   position: absolute;
//   top: 16px;
//   bottom: -16px;
//   right: -12px;
//   content: "";
//   width: 2px;
//   background: black;
//   transform: rotate(30deg);
// }

// #score::after {
//   position: absolute;
//   bottom: -32px;
//   right: -48px;
//   content: "10";
//   font-weight: normal;
//   font-size: 32px;
// }

export default Review;
