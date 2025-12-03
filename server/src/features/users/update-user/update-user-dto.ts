import { z } from 'zod';

import { Gender } from '~/shared/constants/gender';
import { Role } from '~/shared/constants/role';

export const updateUserRequestSchema = z.object({
  email: z.email('Invalid email address').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  avatar: z.file().optional(),
  gender: z
    .enum(Object.values(Gender), { message: 'Invalid gender' })
    .optional(),
  role: z.enum(Object.values(Role), { message: 'Invalid role' }).optional(),
  dob: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional()
});

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
