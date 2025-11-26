import createHttpError from 'http-errors';

import { AuthModel, UserModel } from '~/shared/database/models';
import {
  generateResetPasswordToken,
  hashPassword,
  sendMail,
  verifyToken
} from '~/shared/utils';

export const ResetPasswordService = {
  forgotPassword: async (email: string): Promise<void> => {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = generateResetPasswordToken(user._id.toString());

    sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: 'password-reset',
      templateData: {
        name: user.name,
        resetUrl: `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`
      }
    }).catch(error => {
      console.error('Failed to send reset password email:', error);
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    const storedLastResetToken = await AuthModel.findOne({
      lastResetPasswordToken: token
    });

    if (storedLastResetToken) {
      throw createHttpError(
        400,
        'This reset password token has already been used'
      );
    }

    const decoded = verifyToken(token, process.env.JWT_RESET_PASSWORD_SECRET!);

    // If the decoded token is a string, it means the token is invalid
    if (typeof decoded === 'string') {
      throw createHttpError(400, 'Invalid reset password token');
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await hashPassword(newPassword);
    let auth = await AuthModel.findOne({ user: user._id, provider: 'local' });

    if (!auth) {
      auth = await AuthModel.create({
        user: user._id,
        provider: 'local',
        providerId: user.email,
        localPassword: hashedPassword
      });
      return;
    }

    auth.localPassword = hashedPassword;
    await auth.save();
  }
};
