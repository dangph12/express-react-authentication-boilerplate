// types/express/index.d.ts
import { User as AppUser } from '~/entities/user';

declare global {
  namespace Express {
    interface User extends AppUser {
      id: string;
    }
  }
}
