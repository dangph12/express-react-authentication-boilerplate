import { Gender } from '~/shared/constants/gender';
import { Role } from '~/shared/constants/role';

export interface User {
  email: string;
  name: string;
  avatar?: string;
  gender?: Gender;
  role: Role;
  dob?: Date;
  isActive: boolean;
}
