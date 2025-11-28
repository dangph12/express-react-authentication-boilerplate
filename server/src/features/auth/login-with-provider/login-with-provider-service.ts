import createHttpError from 'http-errors';
import { HydratedDocument } from 'mongoose';

import { User } from '~/entities/user';
import { AuthModel } from '~/shared/database/models';
import { generateToken } from '~/shared/utils';

import { LoginWithProviderResponse } from './login-with-provider-dto';

export const LoginWithProviderService = {
  loginWithProvider: async (
    provider: string,
    providerId: string,
    user: HydratedDocument<User>
  ): Promise<LoginWithProviderResponse> => {
    if (!user || !user._id) {
      throw createHttpError(400, 'User not found');
    }

    let auth = await AuthModel.findOne({ provider, providerId });

    if (!auth) {
      auth = await AuthModel.create({
        user: user._id,
        provider,
        providerId,
        verifyAt: new Date()
      });
    } else {
      auth.verifyAt = new Date();
      await auth.save();
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
