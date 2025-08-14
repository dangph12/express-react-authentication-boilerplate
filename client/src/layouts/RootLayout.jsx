import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import { Toaster } from '~/components/ui/sonner';

const RootLayout = () => {
  const theme = useSelector(state => state.theme.value);

  return (
    <div>
      <div>Header</div>
      <Outlet />
      <div>Footer</div>
      <Toaster position='top-center' theme={theme} />
    </div>
  );
};

export default RootLayout;
