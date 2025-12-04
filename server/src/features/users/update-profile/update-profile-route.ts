import { Router } from 'express';

import { authenticate } from '~/shared/middlewares';
import { asyncHandler, handleSingleImageUpload } from '~/shared/utils';

import { UpdateProfileController } from './update-profile-controller';

const router = Router();

router.patch(
  '/me',
  authenticate(),
  handleSingleImageUpload('avatar'),
  asyncHandler(UpdateProfileController.updateProfile)
);

export default router;
