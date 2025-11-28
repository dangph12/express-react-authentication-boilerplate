import generatePassword from 'generate-password';
import createHttpError from 'http-errors';

import { User } from '~/entities/user';
import { AuthModel, UserModel } from '~/shared/database/models';
import { hashPassword, sendMail } from '~/shared/utils';

import { CreateUserRequest } from './create-user-dto';

export const CreateUserService = {
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const newUser = await UserModel.create(data);
    if (!newUser) {
      throw createHttpError(500, 'Failed to create user');
    }

    const password = generatePassword.generate({
      length: 12,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true
    });
    const hashedPassword = await hashPassword(password);

    await AuthModel.create({
      user: newUser._id,
      provider: 'local',
      providerId: newUser.email,
      localPassword: hashedPassword,
      verifyAt: new Date()
    });

    sendMail({
      to: newUser.email,
      subject: 'Welcome to Our Platform',
      template: 'create-user',
      templateData: {
        email: newUser.email,
        password
      }
    });

    return newUser;
  }
};
