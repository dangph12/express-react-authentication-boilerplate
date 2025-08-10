import express, { Router } from 'express';
import passport from 'passport';

import validate from '~/middleware/validate';
import asyncHandler from '~/utils/async-handler';

import AuthController from './auth-controller';
import { LocalLogin, LocalRegister } from './auth-validation';

const router: Router = express.Router();

router.post(
  '/register',
  validate(LocalRegister.shape),
  asyncHandler(AuthController.register)
);
router.post(
  '/login',
  validate(LocalLogin.shape),
  asyncHandler(AuthController.login)
);
router.post('/refresh-token', asyncHandler(AuthController.refreshToken));
router.post('/logout', asyncHandler(AuthController.logout));

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
  }),
  asyncHandler(AuthController.loginByGoogle)
);

// TODO: Get email from facebook profile
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['public_profile'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/login'
  }),
  asyncHandler(AuthController.loginByFacebook)
);

export default router;
