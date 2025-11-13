import { TYPES } from '@container/types';
import type { User } from '@prisma/client';
import type { IUserRepository } from '@repositories/UserRepository';
import { inject, injectable } from 'inversify';
import type { IGetUsersUseCase } from './GetUsers.interface';

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
  private readonly userRepository: IUserRepository;

  constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
