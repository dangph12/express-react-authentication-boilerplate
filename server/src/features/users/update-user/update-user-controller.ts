import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { UpdateUserService } from './update-user-service';

export const UpdateUserController = {
  updateUser: async (req: Request, res: Response) => {
    const id = req.params.id;

    const data = req.body;

    const result = await UpdateUserService.updateUser(id, data);

    res
      .status(200)
      .json(ApiResponse.success('User updated successfully', result));
  }
};
