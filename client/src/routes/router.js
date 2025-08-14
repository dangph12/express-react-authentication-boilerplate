import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const RootLayout = lazy(() => import('~/layouts/RootLayout'));

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: lazy(() => import('~/app/page'))
      },
      {
        path: 'playground',
        Component: lazy(() => import('~/app/playground/page'))
      }
    ]
  },
  {
    path: '/auth/login',
    Component: lazy(() => import('~/app/auth/login/page'))
  }
]);

export default router;
