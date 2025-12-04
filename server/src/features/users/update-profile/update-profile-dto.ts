import { z } from 'zod';

import { GENDER } from '~/shared/constants/gender';

export const updateProfileRequestSchema = z.object({
  email: z.email('Invalid email address').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  avatar: z.file().optional(),
  gender: z
    .enum(Object.values(GENDER), { message: 'Invalid gender' })
    .optional(),
  dob: z.string().optional()
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
