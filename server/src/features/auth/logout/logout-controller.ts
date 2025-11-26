import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

export const LogoutController = {
  logout: async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json(ApiResponse.success('Logout successful'));
  }
};
