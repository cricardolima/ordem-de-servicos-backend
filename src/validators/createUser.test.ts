import { Role } from '@prisma/client';
import { createUserSchema } from './createUser.schema';

describe('CreateUserSchema', () => {
  it('should validate the request body', () => {
    const requestBody = {
      name: 'John Doe',
      registration: 'john.doe',
      password: 'password123',
      role: Role.ADMIN,
    };

    const result = createUserSchema.safeParse(requestBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(requestBody);
    }
  });

  it('should throw a ValidationException if the request is invalid', () => {
    const requestBody = {
      name: 'John Doe',
      registration: 'john.doe',
      password: '123',
      role: Role.ADMIN,
    };

    const result = createUserSchema.safeParse(requestBody);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
      expect(result.error?.issues).toHaveLength(1);
      expect(result.error?.issues[0]?.path).toEqual(['password']);
      expect(result.error?.issues[0]?.message).toEqual('Password must be at least 8 characters long');
    }
  });
});
