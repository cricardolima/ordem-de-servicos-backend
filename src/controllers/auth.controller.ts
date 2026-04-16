import { TYPES } from '@container/types';
import type { IUserLoginRequest } from '@dtos/models';
import type { IRefreshTokenUseCase } from '@use-cases/RefreshToken';
import type { IUserLoginUseCase } from '@use-cases/UserLogin';
import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthController {
  private readonly userLoginUseCase: IUserLoginUseCase;
  private readonly refreshTokenUseCase: IRefreshTokenUseCase;

  constructor(
    @inject(TYPES.IUserLoginUseCase) userLoginUseCase: IUserLoginUseCase,
    @inject(TYPES.IRefreshTokenUseCase)
    refreshTokenUseCase: IRefreshTokenUseCase,
  ) {
    this.userLoginUseCase = userLoginUseCase;
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  public async login(req: Request, res: Response) {
    return this.userLoginUseCase.execute(req.body as IUserLoginRequest, res);
  }

  public async logout(req: Request, res: Response) {
    await this.refreshTokenUseCase.revokeRefreshToken(req.cookies.refreshToken, res);
    return {
      success: true,
      message: 'Logout successful',
    };
  }

  public async refreshToken(req: Request, res: Response) {
    return this.refreshTokenUseCase.refreshToken(req.cookies.refreshToken, res);
  }
}
