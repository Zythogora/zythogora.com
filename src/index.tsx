import React from 'react';
import ReactDOM from 'react-dom/client';

import Zythogora from 'business/router';
import 'index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Zythogora />
  </React.StrictMode>,
);
