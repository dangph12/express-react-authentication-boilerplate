import { HydratedDocument } from 'mongoose';

import { User as AppUser } from '~/entities/user';

declare global {
  namespace Express {
    type User = HydratedDocument<AppUser>;
  }
}
