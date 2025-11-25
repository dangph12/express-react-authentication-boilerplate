import { Router } from 'express';

import loginRoute from '~/features/auth/login/login-route';
import loginWithProviderRoute from '~/features/auth/login-with-provider/login-with-provider-route';
import signUpRoute from '~/features/auth/sign-up/sign-up-route';
import viewUsersRoute from '~/features/manage-users/view-users/view-users-route';

const router = Router();

router.use('/auth', loginRoute);
router.use('/auth', signUpRoute);
router.use('/auth', loginWithProviderRoute);

router.use('/users', viewUsersRoute);

export default router;
