import createHttpError from 'http-errors';

import { AuthModel, UserModel } from '~/shared/database/models';
import { uploadAvatar } from '~/shared/utils';
import { hashPassword } from '~/shared/utils/bcrypt';
import { generateToken } from '~/shared/utils/jwt';

import type { SignUpRequest, SignUpResponse } from './sign-up-dto';

export const SignUpService = {
  signUp: async (
    data: SignUpRequest,
    file?: Express.Multer.File
  ): Promise<SignUpResponse> => {
    const newUser = await createNewUser(data, file);

    const existingAuth = await AuthModel.findOne({
      provider: 'local',
      providerId: data.email
    });

    if (existingAuth) {
      throw createHttpError(409, 'Email already in use');
    }

    const hashedPassword = await hashPassword(data.password);

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

const createNewUser = async (
  data: SignUpRequest,
  file?: Express.Multer.File
) => {
  const existingUser = await UserModel.findOne({ email: data.email });

  if (existingUser) {
    throw createHttpError(400, 'User with this email already exists');
  }

  const newUser = await UserModel.create({
    ...data,
    isActive: true
  });

  if (!newUser) {
    throw createHttpError(500, 'Failed to create user');
  }

  if (file) {
    const uploadResult = await uploadAvatar(
      file.buffer,
      newUser._id.toString()
    );
    if (uploadResult.success && uploadResult.data) {
      await UserModel.findByIdAndUpdate(newUser._id, {
        avatar: uploadResult.data.secure_url
      });
    } else {
      throw createHttpError(500, 'Failed to upload avatar');
    }
  }
  return newUser;
};
