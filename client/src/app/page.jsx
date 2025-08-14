import React from 'react';
import { useSelector } from 'react-redux';

const Page = () => {
  const theme = useSelector(state => state.theme.value);
  return <div>HomePage with {theme} theme</div>;
};

export default Page;
