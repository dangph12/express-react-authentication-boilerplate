import { Router } from 'express';

import { authenticate } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { ViewProfileController } from './view-profile-controller';

const router = Router();

router.get(
  '/me',
  authenticate(),
  asyncHandler(ViewProfileController.viewProfile)
);

export default router;
