import * as zod from 'zod';

export const refreshTokenSchema = zod.object({
  refreshToken: zod.string().min(1, { message: 'Refresh token is required' }),
});
