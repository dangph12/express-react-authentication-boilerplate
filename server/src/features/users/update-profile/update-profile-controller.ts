import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { UpdateProfileService } from './update-profile-service';

export const UpdateProfileController = {
  updateProfile: async (req: Request, res: Response) => {
    const id = req.user?.id;
    const data = req.body;
    const avatar = req.file;

    const result = await UpdateProfileService.updateProfile(id, data, avatar);

    res
      .status(200)
      .json(ApiResponse.success('Profile updated successfully', result));
  }
};
