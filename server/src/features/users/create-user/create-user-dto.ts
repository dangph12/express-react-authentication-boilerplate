import { z } from 'zod';

import { Gender } from '~/shared/constants/gender';
import { Role } from '~/shared/constants/role';

export const createUserRequestSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  gender: z.enum(Object.values(Gender), { message: 'Invalid gender' }),
  role: z.enum(Object.values(Role), { message: 'Invalid role' }),
  dob: z.string().optional()
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
