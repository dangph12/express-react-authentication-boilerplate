import createHttpError from 'http-errors';

import { AuthModel, UserModel } from '~/shared/database/models';
import { comparePassword } from '~/shared/utils/bcrypt';
import { generateToken } from '~/shared/utils/jwt';

import type { LoginRequest, LoginResponse } from './login-dto';

export const LoginService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const auth = await AuthModel.findOne({
      provider: 'local',
      providerId: data.email
    });

    if (!auth || !auth.localPassword) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const isValidPassword = await comparePassword(
      data.password,
      auth.localPassword
    );
    if (!isValidPassword) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const user = await UserModel.findById(auth.user);
    if (!user || !user.isActive) {
      throw createHttpError(404, 'User not found or inactive');
    }

    const { accessToken, refreshToken } = generateToken({
      id: user._id.toString(),
      role: user.role
    });

    return {
      accessToken,
      refreshToken
    };
  }
};
