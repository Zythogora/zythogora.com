import BeerPage from 'business/beer/pages';
import Home from 'business/home/pages';
import { RouterRoute } from 'business/router/types';

const routes: RouterRoute[] = [
  { path: '/', component: <Home /> },
  { path: '/home', component: <Home /> },
  { path: '/beers/:beerId', component: <BeerPage /> },
];

export default routes;
