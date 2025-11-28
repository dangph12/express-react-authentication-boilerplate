import { z } from 'zod';

import { GENDER_VALUES } from '~/shared/constants/gender';
import { ROLE_VALUES } from '~/shared/constants/role';

export const createUserRequestSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  gender: z.enum(GENDER_VALUES, { message: 'Invalid gender' }),
  role: z.enum(ROLE_VALUES, { message: 'Invalid role' }),
  dob: z.string().optional()
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
