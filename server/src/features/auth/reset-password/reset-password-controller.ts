import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { ResetPasswordService } from './reset-password-service';

export const ResetPasswordController = {
  forgotPassword: async (req: Request, res: Response) => {
    const { email } = req.body;

    await ResetPasswordService.forgotPassword(email);

    res
      .status(200)
      .json(
        ApiResponse.success('A password reset link has been sent to your email')
      );
  },
  resetPassword: async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;
    await ResetPasswordService.resetPassword(token, password);

    res
      .status(200)
      .json(ApiResponse.success('Your password has been reset successfully'));
  }
};
