import { ForbiddenException } from '@exceptions/forbidden.exception';
import type { Request, Response } from 'express';
import { hasAccess } from './hasAccess.middleware';

describe('HasAccessMiddleware', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(hasAccess).toBeDefined();
  });

  it('should throw a ForbiddenException if the user does not have the required role', () => {
    const req = { session: { user: { role: 'USER' } } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    expect(() => hasAccess(['ADMIN'])(req, res, next)).toThrow(ForbiddenException);
  });

  it('should call next() if the user has the required role', () => {
    const req = { session: { user: { role: 'ADMIN' } } } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    hasAccess(['ADMIN'])(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
