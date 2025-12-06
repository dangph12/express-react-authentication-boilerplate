import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { UpdateUserService } from './update-user-service';

export const UpdateUserController = {
  updateUser: async (req: Request, res: Response) => {
    const id = req.params.id;

    const data = req.body;

    const currentUserId = req.user?._id.toString();

    if (id === currentUserId && data.isActive === 'false') {
      return res
        .status(400)
        .json(ApiResponse.failed('Admin cannot deactivate own account'));
    }

    const result = await UpdateUserService.updateUser(id, data);

    res
      .status(200)
      .json(ApiResponse.success('User updated successfully', result));
  }
};
