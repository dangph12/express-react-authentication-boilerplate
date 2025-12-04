import { z } from 'zod';

import { GENDER } from '~/shared/constants/gender';
import { ROLE } from '~/shared/constants/role';

export const createUserRequestSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  gender: z.enum(Object.values(GENDER), { message: 'Invalid gender' }),
  role: z.enum(Object.values(ROLE), { message: 'Invalid role' }),
  dob: z.string().optional()
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
