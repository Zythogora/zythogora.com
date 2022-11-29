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
    <Link to={href}>
      <div
        className="
          grid grid-cols-[40px_calc(100%-64px)] items-center gap-x-6 p-3 rounded-lg cursor-pointer
        hover:bg-gray-50
        "
      >
        <div className="grid items-center justify-items-center w-10 h-10 bg-gray-200 rounded-lg">
          <div className="w-2/3 h-2/3">
            {type === 'beer' ? <BeerIcon /> : <BreweryIcon />}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="truncate">{data}</p>
          <p className="text-[12px] -mt-0.5 text-gray-500 truncate">
            {dataSub}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SearchResult;
