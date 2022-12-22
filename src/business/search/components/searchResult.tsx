import { Link } from 'react-router-dom';

import { Beer } from 'business/beer/types';
import { Brewery } from 'business/brewery/types';
import BeerIcon from 'ui/assets/beerIcon';
import BreweryIcon from 'ui/assets/breweryIcon';

type SearchResultProps =
  | {
      type: 'beer';
      data: Beer['name'];
      dataSub: Beer['brewery']['name'];
      href: string;
    }
  | {
      type: 'brewery';
      data: Brewery['name'];
      dataSub: Brewery['country']['name'];
      href: string;
    };

const SearchResult = ({ type, data, dataSub, href }: SearchResultProps) => {
  return (
    <Link reloadDocument to={href}>
      <div
        className="
          grid grid-cols-[theme(space.10)_calc(100%-theme(space.16))] items-center gap-x-6 p-3 rounded-lg cursor-pointer
          hover:bg-neutral-50
          dark:hover:bg-gray-700
        "
      >
        <div
          className="
            grid items-center justify-items-center w-10 h-10 rounded-lg
          bg-neutral-200
          dark:bg-gray-600
          "
        >
          <div className="w-2/3 h-2/3">
            {type === 'beer' ? (
              <BeerIcon className="w-full h-full dark:!fill-white" />
            ) : (
              <BreweryIcon className="w-full h-full dark:!fill-white" />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <p
            className="
              truncate 
              text-black
              dark:text-gray-200
            "
          >
            {data}
          </p>
          <p
            className="
              text-xs -mt-0.5 truncate
              text-neutral-500
              dark:text-gray-400
            "
          >
            {dataSub}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SearchResult;
