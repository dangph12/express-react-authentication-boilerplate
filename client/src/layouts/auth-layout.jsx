import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import { Toaster } from '~/components/ui/sonner';

const AuthLayout = () => {
  const theme = useSelector(state => state.theme.value);

  return (
    <div>
      <Outlet />
      <Toaster position='top-right' theme={theme} />
    </div>
  );
};

export default AuthLayout;
