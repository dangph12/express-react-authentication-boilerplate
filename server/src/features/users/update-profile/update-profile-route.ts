import { Router } from 'express';

import { authenticate } from '~/shared/middlewares';
import { asyncHandler, uploadSingle } from '~/shared/utils';

import { UpdateProfileController } from './update-profile-controller';

const router = Router();

router.patch(
  '/me',
  authenticate(),
  uploadSingle('avatar'),
  asyncHandler(UpdateProfileController.updateProfile)
);

export default router;
