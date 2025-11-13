import { createProfessionalSchema } from './createProfessional.schema';

describe('CreateProfessionalSchema', () => {
  it('should validate the request body', () => {
    const requestBody = {
      name: 'John Doe',
      registration: '1234567890',
    };

    const result = createProfessionalSchema.safeParse(requestBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(requestBody);
    }
  });

  it('should throw a ValidationException if the request is invalid', () => {
    const requestBody = {
      name: 'John Doe',
    };

    const result = createProfessionalSchema.safeParse(requestBody);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
      expect(result.error?.issues).toHaveLength(1);
      expect(result.error?.issues[0]?.path).toEqual(['registration']);
      expect(result.error?.issues[0]?.message).toEqual('Invalid input: expected string, received undefined');
    }
  });
});
