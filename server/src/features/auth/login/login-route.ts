import { Router } from 'express';

import { parseFormData, validate } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { LoginController } from './login-controller';
import { loginRequestSchema } from './login-dto';

const router = Router();

router.post(
  '/login',
  parseFormData,
  validate(loginRequestSchema.shape),
  asyncHandler(LoginController.login)
);

export default router;
