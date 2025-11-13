import type { ZodError } from 'zod';

export const zodValidationErrorParse = (error: ZodError) => {
  const errors = error.issues.map((err) => {
    const field = err.path.join('.');
    const { message } = err;
    return { field, message };
  });
  return errors;
};

export const getErrorCode = (zodCode: string) => {
  const codeMap: Record<string, string> = {
    invalid_type: 'INVALID_TYPE',
    invalid_string: 'INVALID_STRING',
    invalid_number: 'INVALID_NUMBER',
    invalid_boolean: 'INVALID_BOOLEAN',
    invalid_date: 'INVALID_DATE',
    invalid_array: 'INVALID_ARRAY',
  };
  return codeMap[zodCode] || 'unknown';
};
