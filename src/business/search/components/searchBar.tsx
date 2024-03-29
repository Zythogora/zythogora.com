import { ChangeEvent, useContext, useState } from 'react';
import { useFocus } from 'react-aria';

import { Beer } from 'business/beer/types';
import { Brewery } from 'business/brewery/types';
import SearchResult from 'business/search/components/searchResult';
import { SearchBeers } from 'business/search/services/beers';
import { SearchBreweries } from 'business/search/services/breweries';
import { ApiError } from 'technical/api/types/error';
import Alert from 'ui/alert';
import { AlertContext } from 'ui/alert/provider';
import { AlertType } from 'ui/alert/types';

interface SearchBarProps {
  active: boolean;
  setActive: (value: boolean) => void;
}

const SearchBar = ({ active, setActive }: SearchBarProps) => {
  const [input, setInput] = useState<string>('');

  const { triggerAlert } = useContext(AlertContext);

  const [beers, setBeers] = useState<Beer[]>([]);
  const [breweries, setBreweries] = useState<Brewery[]>([]);

  const { focusProps } = useFocus({
    onFocus: () => setActive(beers.length !== 0 && breweries.length !== 0),
  });

  const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    setInput(searchInput);

    if (searchInput.length === 0) {
      setBeers([]);
      setBreweries([]);
      setActive(false);
      return;
    }

    try {
      const beerResults = await SearchBeers(searchInput, 3);
      setBeers(beerResults);

      const breweryResults = await SearchBreweries(searchInput, 3);
      setBreweries(breweryResults);

      setActive(beerResults.length !== 0 && breweryResults.length !== 0);
    } catch (error: any) {
      if (error instanceof ApiError) {
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
  };

  return (
    <div className="relative w-100">
      <input
        type="text"
        placeholder="Search for a beer or a brewery"
        {...focusProps}
        onChange={handleInput}
        className="
          w-full px-6 py-2 border rounded-3xl
          border-neutral-300 focus:border-neutral-400 shadow
          dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 dark:focus:border-gray-400
          transition duration-200
          hover:shadow-md
          outline-0 
        "
      />

      {active ? (
        <div
          id="results"
          className="
            absolute top-12 w-full p-6 border rounded-3xl shadow-md
            bg-white border-neutral-300
            dark:bg-gray-800 dark:border-gray-400
          "
        >
          {beers.map((beer) => (
            <SearchResult
              key={beer.id}
              type="beer"
              data={beer.name}
              dataSub={beer.brewery.name}
              href={`/beers/${beer.id}`}
            />
          ))}

          <hr className="my-4 dark:border-gray-400" />

          {breweries.map((brewery) => (
            <SearchResult
              key={brewery.id}
              type="brewery"
              data={brewery.name}
              dataSub={brewery.country.name}
              href={`/breweries/${brewery.id}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
