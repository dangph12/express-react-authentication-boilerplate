import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router';

import { Spinner } from '~/components/ui/spinner';
import router from '~/routes/router';
import { initializeAuth } from '~/store/features/authSlice';

const App = () => {
  const theme = useSelector(state => state.theme.value);
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.setAttribute('class', theme);
  }, [theme]);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner size='lg' />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
