import { z } from 'zod';

import { GENDER_VALUES } from '~/shared/constants/gender';
import { ROLE_VALUES } from '~/shared/constants/role';

export const updateUserRequestSchema = z.object({
  email: z.email('Invalid email address').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  avatar: z.file().optional(),
  gender: z.enum(GENDER_VALUES, { message: 'Invalid gender' }).optional(),
  role: z.enum(ROLE_VALUES, { message: 'Invalid role' }).optional(),
  dob: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional()
});

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
