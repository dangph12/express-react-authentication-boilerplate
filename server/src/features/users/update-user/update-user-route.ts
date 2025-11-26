import { Router } from 'express';

import { authenticate, authorize, validate } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { UpdateUserController } from './update-user-controller';
import { updateUserRequestSchema } from './update-user-dto';

const router = Router();

router.patch(
  '/:id',
  authenticate(),
  authorize(['admin']),
  validate(updateUserRequestSchema.shape),
  asyncHandler(UpdateUserController.updateUser)
);

export default router;
