import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

import PrivateRoute from '~/components/private-route';

const AppLayout = lazy(() => import('~/components/layouts/app-layout'));
const RootLayout = lazy(() => import('~/components/layouts/root-layout'));
const AuthLayout = lazy(() => import('~/components/layouts/auth-layout'));

const ErrorComponent = lazy(() => import('~/components/error'));

const ProfilePage = lazy(() => import('~/app/profile/page'));

const router = createBrowserRouter([
  {
    Component: AppLayout,
    ErrorBoundary: ErrorComponent,
    children: [
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
          },
          {
            path: 'profile',
            Component: () => (
              <PrivateRoute allowedRoles={['user', 'admin']}>
                <ProfilePage />
              </PrivateRoute>
            )
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
          },
          {
            path: 'callback',
            Component: lazy(() => import('~/app/auth/callback/page'))
          },
          {
            path: 'forgot-password',
            Component: lazy(() => import('~/app/auth/forgot-password/page'))
          },
          {
            path: 'reset-password',
            Component: lazy(() => import('~/app/auth/reset-password/page'))
          }
        ]
      }
    ]
  }
]);

export default router;
