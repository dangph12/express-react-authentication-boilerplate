import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { LoginService } from './login-service';

export const LoginController = {
  login: async (req: Request, res: Response) => {
    const loginData = req.body;
    const { accessToken, refreshToken } = await LoginService.login(loginData);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res
      .status(200)
      .json(ApiResponse.success('Login successful', { accessToken }));
  }
};
