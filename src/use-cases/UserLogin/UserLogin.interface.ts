import type { IUserLoginRequest, IUserLoginResponse } from '@dtos/models';
import type { Response } from 'express';

export interface IUserLoginUseCase {
  execute(request: IUserLoginRequest, res: Response): Promise<IUserLoginResponse>;
}
