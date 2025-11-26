import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { SignUpService } from './sign-up-service';

export const SignUpController = {
  signUp: async (req: Request, res: Response) => {
    const signUpData = req.body;
    const file = req.file;

    const { accessToken, refreshToken } = await SignUpService.signUp(
      signUpData,
      file
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res
      .status(200)
      .json(ApiResponse.success('Sign up successful', { accessToken }));
  }
};
