import { Router } from 'express';

import { validate } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { SignUpController } from './sign-up-controller';
import { signUpRequestSchema } from './sign-up-dto';

const router = Router();

router.post(
  '/sign-up',
  validate(signUpRequestSchema.shape),
  asyncHandler(SignUpController.signUp)
);

export default router;
