import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router';

import router from '~/routes/router';

const App = () => {
  const theme = useSelector(state => state.theme.value);

  useEffect(() => {
    document.documentElement.setAttribute('class', theme);
  }, [theme]);

  return <RouterProvider router={router} />;
};

export default App;
