import createHttpError from 'http-errors';

import { AuthModel, UserModel } from '~/shared/database/models';
import { hashPassword } from '~/shared/utils/bcrypt';
import { generateToken } from '~/shared/utils/jwt';

import type { SignUpRequest, SignUpResponse } from './sign-up-dto';

export const SignUpService = {
  signUp: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const existingAuth = await AuthModel.findOne({
      provider: 'local',
      providerId: data.email
    });

    if (existingAuth) {
      throw createHttpError(409, 'Email already in use');
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await UserModel.create({
      name: data.name,
      email: data.email,
      isActive: true,
      role: 'user'
    });

    await AuthModel.create({
      user: newUser._id,
      provider: 'local',
      providerId: data.email,
      localPassword: hashedPassword,
      verifyAt: new Date()
    });

    const { accessToken, refreshToken } = generateToken({
      id: newUser._id.toString(),
      role: newUser.role
    });

    return {
      accessToken,
      refreshToken
    };
  }
};
