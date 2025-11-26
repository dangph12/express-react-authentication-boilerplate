import { Router } from 'express';

import { authenticate, authorize, validate } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { CreateUserController } from './create-user-controller';
import { createUserRequestSchema } from './create-user-dto';

const router = Router();

router.post(
  '/',
  authenticate(),
  authorize(['admin']),
  validate(createUserRequestSchema.shape),
  asyncHandler(CreateUserController.createUser)
);

export default router;
