import createHttpError from 'http-errors';

import UserModel from './user-model';
import { IUser } from './user-type';

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
  },
  findById: async (userId: string) => {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return user;
  },
  findByEmail: async (email: string) => {
    const user = await UserModel.findOne({
      email: email
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return user;
  },
  create: async (userData: IUser) => {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw createHttpError(400, 'User with this email already exists');
    }

    const newUser = UserModel.create({
      ...userData,
      isActive: true
    });

    if (!newUser) {
      throw createHttpError(500, 'Failed to create user');
    }

    return newUser;
  },
  update: async (userId: string, updateData: Partial<IUser>) => {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    return updatedUser;
  },
  remove: async (userId: string) => {
    await UserModel.findByIdAndDelete(userId);
  }
};

export default UserService;
