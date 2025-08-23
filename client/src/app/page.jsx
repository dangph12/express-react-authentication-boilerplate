import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { Button } from '~/components/ui/button';
import { logout } from '~/store/features/authSlice';
import { clearAvatar } from '~/store/features/avatarSlice';

const Page = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.value);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearAvatar());
  };

  return (
    <>
      <div>HomePage with {theme} theme</div>
      <div className='flex flex-col space-y-4'>
        <Link to='/profile'>Profile</Link>
        <Link to='/auth/login'>Login</Link>
        <Link to='/auth/sign-up'>Sign Up</Link>
        <Button className='sm' onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </>
  );
};

export default Page;
