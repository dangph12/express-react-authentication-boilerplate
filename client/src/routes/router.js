import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const RootLayout = lazy(() => import('~/layouts/RootLayout'));
const AuthLayout = lazy(() => import('~/layouts/AuthLayout'));

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
    path: '/auth/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: lazy(() => import('~/app/auth/login/page'))
      },
      {
        path: 'sign-up',
        Component: lazy(() => import('~/app/auth/sign-up/page'))
      }
    ]
  }
]);

export default router;
