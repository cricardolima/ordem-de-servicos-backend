import type { ICreateUserRequest } from '@dtos/models';
import type { User } from '@prisma/client';

export interface ICreateUserUseCase {
  execute(user: ICreateUserRequest): Promise<User>;
}
