import createHttpError from 'http-errors';

import { User } from '~/entities/user';
import { UserModel } from '~/shared/database/models';
import { validateObjectId } from '~/shared/utils';

import { UpdateUserRequest } from './update-user-dto';

export const UpdateUserService = {
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    if (!validateObjectId(id)) {
      throw createHttpError(400, 'Invalid user ID format');
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true
    });

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    return updatedUser;
  }
};
