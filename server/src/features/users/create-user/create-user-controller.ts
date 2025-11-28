import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { CreateUserService } from './create-user-service';

export const CreateUserController = {
  createUser: async (req: Request, res: Response) => {
    const data = req.body;

    const result = await CreateUserService.createUser(data);

    res
      .status(201)
      .json(ApiResponse.success('User created successfully', result));
  }
};
