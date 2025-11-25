import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { ViewUserDetailService } from './view-user-detail-service';

export const ViewUserDetailController = {
  viewUserDetail: async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await ViewUserDetailService.viewUserDetail(id);

    res
      .status(200)
      .json(ApiResponse.success('User retrieved successfully', result));
  }
};
