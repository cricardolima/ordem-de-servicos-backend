import { authSchema } from './auth.schema';

describe('AuthSchema', () => {
  it('should validate the request body', () => {
    const requestBody = {
      registration: '1234567890',
      password: '1234567890',
    };

    const result = authSchema.safeParse(requestBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(requestBody);
    }
  });

  it('should throw a ValidationException if the request is invalid', () => {
    const requestBody = {
      registration: '',
      password: '1234567890',
    };

    const result = authSchema.safeParse(requestBody);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
      expect(result.error?.issues).toHaveLength(1);
      expect(result.error?.issues[0]?.path).toEqual(['registration']);
      expect(result.error?.issues[0]?.message).toEqual('Registration is required');
    }
  });
});
