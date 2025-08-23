import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Toaster } from '~/components/ui/sonner';
import { fetchAvatar } from '~/store/features/avatarSlice';

const RootLayout = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.value);
  const { url: avatarUrl } = useSelector(state => state.avatar);

  useEffect(() => {
    dispatch(fetchAvatar());
  }, []);

  return (
    <div>
      <div>
        <div>Header</div>
        <Avatar>
          <AvatarImage src={avatarUrl} alt='User Avatar' />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
      <Outlet />
      <div>Footer</div>
      <Toaster position='top-right' theme={theme} />
    </div>
  );
};

export default RootLayout;
