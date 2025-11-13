import { BusinessException } from '@exceptions/business.exception';
import { UnauthorizedException } from '@exceptions/unauthorized.exception';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  let jwtSecret: string;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jwtSecret = process.env.JWT_SECRET as string;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      headers: {},
      session: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(AuthMiddleware).toBeDefined();
  });

  it('should call next() and set user data in session when token is valid', () => {
    const mockUserData = { userId: '123', role: 'admin' };
    const validToken = jwt.sign(mockUserData, jwtSecret);

    req.headers = {
      authorization: `Bearer ${validToken}`,
    };

    AuthMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.session).toEqual({
      userId: mockUserData.userId,
      role: mockUserData.role,
    });
  });

  it('should throw BusinessException when JWT_SECRET is not defined', () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    req.headers = {
      authorization: 'Bearer some-token',
    };

    expect(() => AuthMiddleware(req as Request, res as Response, next)).toThrow(BusinessException);
    expect(() => AuthMiddleware(req as Request, res as Response, next)).toThrow('JWT_SECRET not found');

    process.env.JWT_SECRET = originalSecret;
  });

  it('should throw UnauthorizedException when token is not found', () => {
    req.headers = {
      authorization: '',
    };

    expect(() => AuthMiddleware(req as Request, res as Response, next)).toThrow(UnauthorizedException);
    expect(() => AuthMiddleware(req as Request, res as Response, next)).toThrow('Token not found');
  });
});
