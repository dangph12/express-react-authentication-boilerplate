import createHttpError from 'http-errors';

import { User } from '~/entities/user';
import { UserModel } from '~/shared/database/models';
import { validateObjectId } from '~/shared/utils';

export const ViewProfileService = {
  viewProfile: async (id: string): Promise<User> => {
    if (!validateObjectId(id)) {
      throw createHttpError(400, 'Invalid user ID format');
    }

    const user = await UserModel.findById(id);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return user;
  }
};
