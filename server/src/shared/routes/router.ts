import { Router } from 'express';

import loginRoute from '~/features/auth/login/login-route';
import loginWithProviderRoute from '~/features/auth/login-with-provider/login-with-provider-route';
import logoutRoute from '~/features/auth/logout/logout-route';
import refreshAccessTokenRoute from '~/features/auth/refresh-access-token/refresh-access-token-route';
import resetPasswordRoute from '~/features/auth/reset-password/reset-password-route';
import signUpRoute from '~/features/auth/sign-up/sign-up-route';
import createUserRoute from '~/features/users/create-user/create-user-route';
import deleteUserRoute from '~/features/users/delete-user/delete-user-route';
import updateUserRoute from '~/features/users/update-user/update-user-route';
import viewUserDetailRoute from '~/features/users/view-user-detail/view-user-detail-route';
import viewUsersRoute from '~/features/users/view-users/view-users-route';

const router = Router();

router.use('/auth', loginRoute);
router.use('/auth', signUpRoute);
router.use('/auth', loginWithProviderRoute);
router.use('/auth', logoutRoute);
router.use('/auth', refreshAccessTokenRoute);
router.use('/auth', resetPasswordRoute);

router.use('/users', createUserRoute);
router.use('/users', updateUserRoute);
router.use('/users', deleteUserRoute);
router.use('/users', viewUsersRoute);
router.use('/users', viewUserDetailRoute);

export default router;
