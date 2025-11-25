import { Router } from 'express';
import passport from 'passport';

import { createOAuthCallback } from '~/shared/middlewares/oauth-callback';

import { loginWithProviderController } from './login-with-provider-controller';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  createOAuthCallback('google'),
  loginWithProviderController.loginWithProvider
);

export default router;
