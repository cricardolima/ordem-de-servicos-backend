import { ZodError } from 'zod';
import { getErrorCode, zodValidationErrorParse } from './zodValidationErrorParse';

describe('zodValidationErrorParse', () => {
  it('should parse a zod error', () => {
    const error = new ZodError([
      {
        code: 'invalid_type',
        path: ['name'],
        expected: 'string',
        message: 'Name must be a string',
      },
    ]);
    const result = zodValidationErrorParse(error);
    expect(result).toEqual([
      {
        field: 'name',
        message: 'Name must be a string',
      },
    ]);
  });

  it('should return an empty array if the error is not a zod error', () => {
    const error = new Error('Test error');
    expect(() => zodValidationErrorParse(error as unknown as ZodError)).toThrow(Error);
  });
});

describe('getErrorCode', () => {
  it('should return mapped error code for valid zod codes', () => {
    expect(getErrorCode('invalid_type')).toEqual('INVALID_TYPE');
    expect(getErrorCode('invalid_string')).toEqual('INVALID_STRING');
    expect(getErrorCode('invalid_number')).toEqual('INVALID_NUMBER');
    expect(getErrorCode('invalid_boolean')).toEqual('INVALID_BOOLEAN');
    expect(getErrorCode('invalid_date')).toEqual('INVALID_DATE');
    expect(getErrorCode('invalid_array')).toEqual('INVALID_ARRAY');
  });

  it('should return unknown for unknown zod codes', () => {
    expect(getErrorCode('invalid_custom')).toEqual('unknown');
    expect(getErrorCode('invalid_custom_2')).toEqual('unknown');
  });
});
