import { useState } from 'react';

import SearchBar from 'business/search/components/searchBar';

const LayoutHeader = () => {
  const [searchActive, setSearchActive] = useState<boolean>(false);

  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement;

        if (
          target.parentElement!.parentElement!.id === 'searchbar' ||
          target.id === 'results'
        ) {
          return;
        }

        setSearchActive(false);
      }}
      className="relative"
    >
      <div
        className="
          flex justify-between items-center h-20 px-20 border-b border-neutral-200
          dark:bg-gray-900 dark:border-gray-700
        "
      >
        <div className="text-2xl text-primary font-sans font-bold">
          zythogora
        </div>

        <div id="searchbar" className="relative w-96 z-20">
          <SearchBar active={searchActive} setActive={setSearchActive} />
        </div>

        <div
          className="
          flex flex-row items-center px-1.5 py-1.5 border rounded-3xl cursor-pointer
          border-neutral-300
          dark:border-gray-500 dark:hover:shadow-gray-700
          transition duration-200
          hover:shadow-md
        "
        >
          <div className="px-3">
            <span className="block w-4 h-0.5 mb-0.5 rounded-sm bg-neutral-900 dark:bg-gray-300"></span>
            <span className="block w-4 h-0.5 rounded-sm bg-neutral-900 dark:bg-gray-300"></span>
            <span className="block w-4 h-0.5 mt-0.5 rounded-sm bg-neutral-900 dark:bg-gray-300"></span>
          </div>

          <div className="relative w-7 h-7 overflow-hidden rounded-full bg-neutral-500 dark:bg-gray-600">
            <span className="absolute top-1.5 left-2 w-3 h-3 rounded-full bg-white dark:bg-gray-300"></span>
            <span className="absolute top-4 left-1 w-5 h-5 rounded-full bg-white dark:bg-gray-300"></span>
            <span className="absolute w-7 h-7 border-2 rounded-full border-neutral-500 dark:border-gray-600"></span>
          </div>
        </div>
      </div>

      {searchActive ? (
        <div
          onClick={() => {
            setSearchActive(false);
          }}
          className="
            absolute top-20 w-full h-[calc(100vh-5rem)] z-10 shadow-inner
            bg-neutral-800 shadow-black opacity-40
            dark:bg-neutral-900 dark:opacity-60
          "
        ></div>
      ) : null}
    </div>
  );
};

export default LayoutHeader;
