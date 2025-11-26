import type { Request, Response } from 'express';

import { ApiResponse } from '~/shared/utils';

import { RefreshAccessTokenService } from './refresh-access-token-service';

export const RefreshAccessTokenController = {
  refreshAccessToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const accessToken =
      await RefreshAccessTokenService.refreshAccessToken(refreshToken);

    res.status(200).json(
      ApiResponse.success('Access token refreshed successfully', {
        accessToken
      })
    );
  }
};
