import { Router } from 'express';

import { asyncHandler } from '~/shared/utils';

import { LogoutController } from './logout-controller';

const router = Router();

router.post('/logout', asyncHandler(LogoutController.logout));

export default router;
