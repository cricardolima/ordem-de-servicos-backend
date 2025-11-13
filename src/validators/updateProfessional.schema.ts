import * as zod from 'zod';

export const updateProfessionalSchema = zod
  .object({
    name: zod.string().optional(),
    registration: zod.string().optional(),
  })
  .refine((data) => data.name || data.registration, {
    message: 'At least one field is required',
  });
