import { Router } from 'express';

import { authenticate, authorize } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { DeleteUserController } from './delete-user-controller';

const router = Router();

router.delete(
  '/:id',
  authenticate(),
  authorize(['admin']),
  asyncHandler(DeleteUserController.deleteUser)
);

export default router;
