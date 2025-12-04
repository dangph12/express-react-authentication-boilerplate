import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import Header from '~/components/header';
import { Toaster } from '~/components/ui/sonner';
import { fetchAvatar } from '~/store/features/avatar-slice';

const RootLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      dispatch(fetchAvatar());
    }
  }, [dispatch, user]);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Toaster position='top-right' theme={theme} />
    </div>
  );
};

export default RootLayout;
