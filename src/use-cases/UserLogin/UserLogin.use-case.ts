import { TYPES } from '@container/types';
import type { IUserLoginRequest, IUserLoginResponse } from '@dtos/models';
import { BusinessException } from '@exceptions/business.exception';
import { NotFoundException } from '@exceptions/notFound.exception';
import { UnauthorizedException } from '@exceptions/unauthorized.exception';
import type { IUserRepository } from '@repositories/UserRepository';
import type { IRefreshTokenUseCase } from '@use-cases/RefreshToken/RefreshToken.interface';
import type { IUserLoginUseCase } from '@use-cases/UserLogin';
import verifyPassword from '@utils/verifyPassword';
import type { Response } from 'express';
import { inject, injectable } from 'inversify';
import jwt, { type SignOptions } from 'jsonwebtoken';

@injectable()
export class UserLoginUseCase implements IUserLoginUseCase {
  private readonly userRepository: IUserRepository;
  private readonly refreshTokenUseCase: IRefreshTokenUseCase;

  constructor(
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(TYPES.IRefreshTokenUseCase)
    refreshTokenUseCase: IRefreshTokenUseCase,
  ) {
    this.userRepository = userRepository;
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  public async execute(request: IUserLoginRequest, res: Response): Promise<IUserLoginResponse> {
    const { registration, password } = request;
    const user = await this.userRepository.findByRegistration(registration);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const expiresIn: SignOptions['expiresIn'] =
      (process.env.ACCESS_TOKEN_EXPIRATION as SignOptions['expiresIn']) || '5m';
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!jwtSecret) {
      throw new BusinessException('JWT_SECRET not found');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
      expiresIn,
    });
    const refreshToken = await this.refreshTokenUseCase.generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    });

    return {
      accessToken: token,
    };
  }
}
