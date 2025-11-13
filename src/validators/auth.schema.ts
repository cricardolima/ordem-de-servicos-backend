import * as zod from 'zod';

export const authSchema = zod.object({
  registration: zod.string().min(1, { message: 'Registration is required' }),
  password: zod.string().min(1, { message: 'Password is required' }),
});
