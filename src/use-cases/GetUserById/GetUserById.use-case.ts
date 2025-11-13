import { TYPES } from '@container/types';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { User } from '@prisma/client';
import type { IUserRepository } from '@repositories/UserRepository';
import { inject, injectable } from 'inversify';
import type { IGetUserByIdUseCase } from './GetUserById.interface';

@injectable()
export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
