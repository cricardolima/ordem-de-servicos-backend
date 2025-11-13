import type { ICreateUserRequest, IUpdateUserRequest } from '@dtos/models';
import type { User } from '@prisma/client';

export interface IUserRepository {
  findByRegistration(registration: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: ICreateUserRequest): Promise<User>;
  update(userId: string, data: IUpdateUserRequest): Promise<void>;
  findById(userId: string): Promise<User | null>;
  softDelete(userId: string): Promise<void>;
}
