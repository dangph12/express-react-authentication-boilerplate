import { Router } from 'express';

import { asyncHandler } from '~/shared/utils';

import { RefreshAccessTokenController } from './refresh-access-token-controller';

const router = Router();

router.post(
  '/refresh-access-token',
  asyncHandler(RefreshAccessTokenController.refreshAccessToken)
);

export default router;
