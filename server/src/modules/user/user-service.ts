import createHttpError from 'http-errors';

import UserModel from './user-model';

const UserService = {
  find: async ({
    page = 1,
    limit = 10,
    filter = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) => {
    const filterRecord: Record<string, { $regex: string; $options: string }> =
      {};

    if (filter) {
      filter.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          // Use regex for case-insensitive search
          filterRecord[key] = { $regex: value, $options: 'i' };
        }
      });
    }

    const users = await UserModel.find({
      page,
      limit,
      filterRecord,
      sortBy,
      sortOrder
    });

    if (!users || users.length === 0) {
      throw createHttpError(404, 'Not found users');
    }

    return users;
  }
};

export default UserService;
