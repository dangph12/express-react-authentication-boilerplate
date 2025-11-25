import createHttpError from 'http-errors';

import { User } from '~/entities/user';
import { UserModel } from '~/shared/database/models';

export const ViewUserDetailService = {
  viewUserDetail: async (id: string): Promise<User> => {
    const user = await UserModel.findById(id);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return user;
  }
};
