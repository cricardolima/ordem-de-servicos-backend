import { Role } from '@prisma/client';
import { updateUserSchema } from './updateUser.schema';

describe('UpdateUserSchema', () => {
  it('should validate the request body', () => {
    const requestBody = {
      name: 'John Doe',
      registration: 'john.doe',
      password: 'password123',
      role: Role.ADMIN,
    };

    const result = updateUserSchema.safeParse(requestBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(requestBody);
    }
  });
});
