import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { DeleteUserService } from './delete-user-service';

export const DeleteUserController = {
  deleteUser: async (req: Request, res: Response) => {
    const id = req.params.id;

    const currentUserId = req.user?._id.toString();

    if (id === currentUserId) {
      return res
        .status(400)
        .json(ApiResponse.failed('Admin cannot delete own account'));
    }

    const result = await DeleteUserService.deleteUser(id);

    res
      .status(200)
      .json(ApiResponse.success('User deleted successfully', result));
  }
};
