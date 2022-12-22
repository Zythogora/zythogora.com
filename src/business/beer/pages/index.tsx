import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import BeerHeader from 'business/beer/components/beerHeader';
import { isNumeric } from 'technical/utils';
import Layout from 'ui/layout';

const BeerPage = () => {
  const navigate = useNavigate();

  const { beerId } = useParams();

  useEffect(() => {
    if (!beerId || !isNumeric(beerId)) {
      navigate('/');
    }
  }, []);

  if (!beerId || !isNumeric(beerId)) {
    return null;
  }

  return (
    <Layout title={'Zythogora'}>
      <BeerHeader beerId={parseInt(beerId)} />

      <div className="w-256 p-12 bg-white dark:bg-gray-700 rounded-xl">
        <div className="flex flex-row gap-x-6 mb-12 pb-12 border-b dark:border-gray-500">
          <div className="px-8 py-4 rounded-full shadow-md bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-900">
            My reviews
          </div>
          <div className="px-8 py-4 rounded-full shadow-md bg-gray-300 dark:bg-gray-900 dark:text-gray-300">
            Friend reviews
          </div>
          <div className="px-8 py-4 rounded-full shadow-md bg-gray-300 dark:bg-gray-900 dark:text-gray-300">
            Brewer notes
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BeerPage;
