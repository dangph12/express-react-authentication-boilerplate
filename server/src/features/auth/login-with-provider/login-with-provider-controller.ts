import type { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';

import { User } from '~/entities/user';

import { LoginWithProviderService } from './login-with-provider-service';

export const loginWithProviderController = {
  loginWithProvider: async (req: Request, res: Response) => {
    const user = req.user as HydratedDocument<User>;
    const provider = (req as any).authInfo?.provider;
    const providerId = (req as any).authInfo?.providerId;

    const { accessToken, refreshToken } =
      await LoginWithProviderService.loginWithProvider(
        provider,
        providerId,
        user
      );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}`
    );
  }
};
