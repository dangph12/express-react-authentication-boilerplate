import { Router } from 'express';

import { authenticate, authorize } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { ViewUsersController } from './view-users-controller';

const router = Router();

router.get(
  '/',
  authenticate(),
  authorize(['admin']),
  asyncHandler(ViewUsersController.viewUsers)
);

export default router;
