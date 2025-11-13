import { Role } from '@prisma/client';
import * as z from 'zod';

export const updateUserSchema = z.object({
  name: z.string().optional(),
  registration: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(Role, { message: 'Role is required' }).optional(),
});
