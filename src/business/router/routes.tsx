import Home from 'business/home/pages';
import { RouterRoute } from 'business/router/types';

const routes: RouterRoute[] = [
  { path: '/', component: <Home /> },
  { path: '/home', component: <Home /> },
];

export default routes;
