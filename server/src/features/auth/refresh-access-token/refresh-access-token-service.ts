import createHttpError from 'http-errors';

import { UserModel } from '~/shared/database/models';
import { generateToken, verifyToken } from '~/shared/utils';

export const RefreshAccessTokenService = {
  refreshAccessToken: async (refreshToken: string): Promise<string> => {
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is required');
    }

    const decoded = verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your_jwt_secret'
    );

    // If the decoded token is a string, it means the token is invalid
    if (typeof decoded === 'string') {
      throw createHttpError(400, 'Invalid refresh token');
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const { accessToken } = generateToken({
      id: user._id.toString(),
      role: user.role
    });

    return accessToken;
  }
};
