import { Router } from 'express';

import { authenticate, authorize } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { ViewUserDetailController } from './view-user-detail-controller';

const router = Router();

router.get(
  '/:id',
  authenticate(),
  authorize(['admin']),
  asyncHandler(ViewUserDetailController.viewUserDetail)
);

export default router;
