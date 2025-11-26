import createHttpError from 'http-errors';

import { User } from '~/entities/user';
import { UserModel } from '~/shared/database/models';

import { CreateUserRequest } from './create-user-dto';

export const CreateUserService = {
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const newUser = await UserModel.create(data);

    if (!newUser) {
      throw createHttpError(500, 'Failed to create user');
    }

    return newUser;
  }
};
