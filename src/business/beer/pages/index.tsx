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
    </Layout>
  );
};

export default BeerPage;
