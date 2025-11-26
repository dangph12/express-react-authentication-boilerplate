import createHttpError from 'http-errors';

import { User } from '~/entities/user';
import { UserModel } from '~/shared/database/models';
import { validateObjectId } from '~/shared/utils';

export const DeleteUserService = {
  deleteUser: async (id: string): Promise<User> => {
    if (!validateObjectId(id)) {
      throw createHttpError(400, 'Invalid user ID format');
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw createHttpError(404, 'User not found');
    }

    return deletedUser;
  }
};
