import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import BeerContent from 'business/beer/components/beerContent';
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

  const id = parseInt(beerId);

  return (
    <Layout title={'Zythogora'}>
      <BeerHeader beerId={id} />

      <BeerContent beerId={id} />
    </Layout>
  );
};

export default BeerPage;
