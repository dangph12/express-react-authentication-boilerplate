import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import AuthService from './auth-service';

const AuthController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.login(
      email,
      password
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json(
      ApiResponse.success('User logged in successfully', {
        user,
        accessToken
      })
    );
  },
  register: async (req: Request, res: Response) => {
    const { userData, password, confirmPassword } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.register(
      userData,
      password
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(201).json(
      ApiResponse.success('User registered successfully', {
        user,
        accessToken
      })
    );
  },
  forgotPassword: async (req: Request, res: Response) => {
    const { email } = req.body;

    await AuthService.forgotPassword(email);

    return res
      .status(200)
      .json(ApiResponse.success('Password reset link sent to email'));
  },
  resetPassword: async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.query;

    if (typeof token !== 'string') {
      return res.status(400).json(ApiResponse.error('Invalid reset token'));
    }

    await AuthService.resetPassword(token, password);

    return res
      .status(200)
      .json(ApiResponse.success('Password reset successfully'));
  },
  refreshAccessToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const accessToken = await AuthService.refreshAccessToken(refreshToken);

    return res.status(200).json(
      ApiResponse.success('Token refreshed successfully', {
        accessToken
      })
    );
  },
  logout: async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({ message: 'User logged out successfully' });
  },
  // TODO: Implement login with provider
  loginWithProvider: async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?error=User not found`
      );
    }
    const { accessToken, refreshToken } = await AuthService.loginWithProvider(
      'facebook',
      user.id,
      user
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}`
    );
  }
};

export default AuthController;
