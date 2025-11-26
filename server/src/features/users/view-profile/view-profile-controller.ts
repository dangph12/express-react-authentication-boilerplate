import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { ViewProfileService } from './view-profile-service';

export const ViewProfileController = {
  viewProfile: async (req: Request, res: Response) => {
    const id = req.user?.id.toString() || '';

    const result = await ViewProfileService.viewProfile(id);

    res
      .status(200)
      .json(ApiResponse.success('Profile retrieved successfully', result));
  }
};
