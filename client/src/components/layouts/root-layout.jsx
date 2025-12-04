import { useTheme } from 'next-themes';
import { Outlet } from 'react-router';

import Footer from '~/components/footer';
import Header from '~/components/header';
import { Toaster } from '~/components/ui/sonner';

const RootLayout = () => {
  const { theme } = useTheme();

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Toaster position='top-right' theme={theme} />
      <Footer />
    </div>
  );
};

export default RootLayout;
