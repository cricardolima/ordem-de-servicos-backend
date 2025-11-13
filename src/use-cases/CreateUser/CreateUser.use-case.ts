import { TYPES } from '@container/types';
import type { ICreateUserRequest } from '@dtos/models';
import { BusinessException } from '@exceptions/business.exception';
import type { User } from '@prisma/client';
import type { IUserRepository } from '@repositories/UserRepository';
import type { ICreateUserUseCase } from '@use-cases/CreateUser/CreateUser.interface';
import { hashPassword } from '@utils/hashPassword';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  private readonly userRepository: IUserRepository;

  constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(user: ICreateUserRequest): Promise<User> {
    const userExists = await this.userRepository.findByRegistration(user.registration);
    if (userExists) {
      throw new BusinessException('User already exists');
    }

    const hashedPassword = await hashPassword(user.password);
    return await this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
  }
}
