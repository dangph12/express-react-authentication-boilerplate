import { Router } from 'express';

import { parseFormData, validate } from '~/shared/middlewares';
import { asyncHandler } from '~/shared/utils';

import { ResetPasswordController } from './reset-password-controller';
import {
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema
} from './reset-password-dto';

const router = Router();

router.post(
  '/forgot-password',
  parseFormData,
  validate(forgotPasswordRequestSchema.shape),
  asyncHandler(ResetPasswordController.forgotPassword)
);

router.post(
  '/reset-password',
  parseFormData,
  validate(resetPasswordRequestSchema.shape),
  asyncHandler(ResetPasswordController.resetPassword)
);

export default router;
