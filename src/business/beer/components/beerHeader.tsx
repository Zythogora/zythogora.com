import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { GetBeer } from 'business/beer/services';
import { Beer } from 'business/beer/types';
import { ApiError } from 'technical/api/types/error';
import Alert from 'ui/alert';
import { AlertContext } from 'ui/alert/provider';
import { AlertType } from 'ui/alert/types';
import AbvIcon from 'ui/assets/abvIcon';
import IbuIcon from 'ui/assets/ibuIcon';
import PintIcon from 'ui/assets/pintIcon';
import StyleIcon from 'ui/assets/styleIcon';
import Spinner from 'ui/spinner';

interface BeerHeaderProps {
  beerId: number;
}

const BeerHeader = ({ beerId }: BeerHeaderProps) => {
  const { alert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [beer, setBeer] = useState<Beer | null>();

  const fetchBeer = async (id: number) => {
    try {
      const beerResult = await GetBeer(id);
      setBeer(beerResult);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          alert(
            <Alert
              type={AlertType.ERROR}
              compact={false}
              title={error.message}
              description="Redirecting to the home page..."
            />,
          );

          setBeer(null);

          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          alert(
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
    fetchBeer(beerId);
  }, []);

  if (beer === undefined) {
    return <Spinner />;
  }

  if (beer === null) {
    return null;
  }

  return (
    <div className="w-256 h-fit p-12 mb-12 flex flex-col justify-between z-0 bg-gradient-card rounded-xl shadow-xl">
      <div className="flex flex-col justify-around gap-y-4">
        <h1 className="text-4xl text-white font-bold">{beer.name}</h1>

        <h2 className="flex-grow text-2xl text-white">
          Brewed by{' '}
          <Link
            to={`/breweries/${beer.brewery.id}`}
            className="text-primary font-bold"
          >
            {beer.brewery.name}
          </Link>
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-[4fr_2fr_1fr_1fr]">
        <div className="flex flex-row items-center gap-x-4">
          <StyleIcon fill="#ffffff" className="w-10 h-10 opacity-70" />
          <div className="flex flex-col">
            <h1 className="text-xs text-white opacity-70 uppercase">Style</h1>
            <p className="text-2xl text-white">{beer.style.name}</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-x-4">
          {beer.color && (
            <>
              <PintIcon
                fill="white"
                fillAir="rgba(255, 255, 255, 0.25)"
                fillBeer={`#${beer.color.color}`}
                className="w-[calc(411/700*theme(space.10))] h-10"
              />
              <div className="flex flex-col">
                <h1 className="text-xs text-white opacity-70 uppercase">
                  Color
                </h1>
                <p className="text-2xl text-white">{beer.color.name}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-row items-center gap-x-4">
          <AbvIcon fill="#ffffff" className="w-10 h-10 opacity-70" />
          <div className="flex flex-col">
            <h1 className="text-xs text-white opacity-70">ABV</h1>
            <p className="text-2xl text-white">{beer.abv}</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-x-4">
          {beer.ibu && (
            <>
              <IbuIcon fill="#ffffff" className="w-10 h-10 opacity-70" />
              <div className="flex flex-col">
                <h1 className="text-xs text-white opacity-70">IBU</h1>
                <p className="text-2xl text-white">{beer.ibu}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeerHeader;
