import createHttpError from 'http-errors';

import { User } from '~/entities/user';
import { UserModel } from '~/shared/database/models';
import { uploadAvatar, validateObjectId } from '~/shared/utils';

import { UpdateProfileRequest } from './update-profile-dto';

export const UpdateProfileService = {
  updateProfile: async (
    id: string,
    data: UpdateProfileRequest,
    avatar?: Express.Multer.File
  ): Promise<User> => {
    if (!validateObjectId(id)) {
      throw createHttpError(400, 'Invalid user ID format');
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true
    });

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    if (avatar) {
      const uploadResult = await uploadAvatar(
        avatar.buffer,
        updatedUser._id.toString()
      );
      if (uploadResult.success && uploadResult.data) {
        await UserModel.findByIdAndUpdate(updatedUser._id, {
          avatar: uploadResult.data.secure_url
        });
      } else {
        throw createHttpError(500, 'Failed to upload avatar');
      }
    }

    return updatedUser;
  }
};
