import { BrowserRouter, Route, Routes } from 'react-router-dom';

import routes from 'business/router/routes';
import { RouterRoute } from 'business/router/types';

const Zythogora = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route: RouterRoute) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default Zythogora;
