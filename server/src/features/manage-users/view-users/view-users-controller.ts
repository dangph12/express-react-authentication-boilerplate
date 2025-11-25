import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';
import { parseQuery } from '~/shared/utils/query-parser';

import { ViewUsersService } from './view-users-service';

export const ViewUsersController = {
  viewUsers: async (req: Request, res: Response) => {
    const parsed = parseQuery(req.query);

    const result = await ViewUsersService.viewUsers(parsed);

    res
      .status(200)
      .json(ApiResponse.success('Users retrieved successfully', result));
  }
};
