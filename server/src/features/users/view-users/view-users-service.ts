import type { QueryOptions } from '@quarks/mongoose-query-parser';
import createHttpError from 'http-errors';

import type { User } from '~/entities/user';
import { UserModel } from '~/shared/database/models';
import { buildPaginateOptions, type PaginateResponse } from '~/shared/utils';

export const ViewUsersService = {
  viewUsers: async (parsed: QueryOptions): Promise<PaginateResponse<User>> => {
    const { filter } = parsed;
    const options = buildPaginateOptions(parsed);

    const result = await UserModel.paginate(filter, options);

    if (!result || result.totalDocs === 0) {
      throw createHttpError(404, 'No users found');
    }

    return result as unknown as PaginateResponse<User>;
  }
};
