import { TYPES } from '@container/types';
import type { ICreateUserRequest, IUpdateUserRequest } from '@dtos/models';
import type { User } from '@prisma/client';
import type { ICreateUserUseCase } from '@use-cases/CreateUser';
import type { IDeleteUserUseCase } from '@use-cases/DeleteUser';
import type { IGetUserByIdUseCase } from '@use-cases/GetUserById';
import type { IGetUsersUseCase } from '@use-cases/GetUsers';
import type { IUpdateUserUseCase } from '@use-cases/UpdateUser';
import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController {
  private readonly getUsersUseCase: IGetUsersUseCase;
  private readonly createUserUseCase: ICreateUserUseCase;
  private readonly updateUserUseCase: IUpdateUserUseCase;
  private readonly deleteUserUseCase: IDeleteUserUseCase;
  private readonly getUserByIdUseCase: IGetUserByIdUseCase;

  constructor(
    @inject(TYPES.IGetUsersUseCase) getUsersUseCase: IGetUsersUseCase,
    @inject(TYPES.ICreateUserUseCase) createUserUseCase: ICreateUserUseCase,
    @inject(TYPES.IUpdateUserUseCase) updateUserUseCase: IUpdateUserUseCase,
    @inject(TYPES.IDeleteUserUseCase) deleteUserUseCase: IDeleteUserUseCase,
    @inject(TYPES.IGetUserByIdUseCase) getUserByIdUseCase: IGetUserByIdUseCase,
  ) {
    this.getUsersUseCase = getUsersUseCase;
    this.createUserUseCase = createUserUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  public async getUsers(): Promise<User[]> {
    return this.getUsersUseCase.execute();
  }

  public async getUser(req: Request): Promise<User> {
    return this.getUserByIdUseCase.execute(req.params.id as string);
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    const user = await this.createUserUseCase.execute(req.body as ICreateUserRequest);
    return res.status(201).json(user);
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    await this.updateUserUseCase.execute(req.params.id as string, req.body as IUpdateUserRequest);
    return res.status(200).json({ success: true, message: 'User updated successfully' });
  }

  public async deleteUser(req: Request, res: Response): Promise<Response> {
    await this.deleteUserUseCase.execute(req.params.id as string);
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  }
}
