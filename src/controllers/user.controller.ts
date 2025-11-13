import { TYPES } from '@container/types';
import type { ICreateUserRequest, IUpdateUserRequest } from '@dtos/models';
import { AuthMiddleware } from '@middleware/auth.middleware';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import type { User } from '@prisma/client';
import type { ICreateUserUseCase } from '@use-cases/CreateUser';
import type { IDeleteUserUseCase } from '@use-cases/DeleteUser';
import type { IGetUserByIdUseCase } from '@use-cases/GetUserById';
import type { IGetUsersUseCase } from '@use-cases/GetUsers';
import type { IUpdateUserUseCase } from '@use-cases/UpdateUser';
import { createUserSchema } from '@validators/createUser.schema';
import { updateUserSchema } from '@validators/updateUser.schema';
import type { Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';

@controller('/users')
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

  @httpGet('/', AuthMiddleware)
  public async getUsers(): Promise<User[]> {
    return this.getUsersUseCase.execute();
  }

  @httpGet('/:id', AuthMiddleware)
  public async getUser(@requestParam('id') id: string): Promise<User> {
    return this.getUserByIdUseCase.execute(id);
  }

  @httpPost('/', ValidateMiddleware(createUserSchema), AuthMiddleware)
  public async createUser(@requestBody() body: ICreateUserRequest, @response() res: Response): Promise<Response> {
    const user = await this.createUserUseCase.execute(body);
    return res.status(201).json(user);
  }

  @httpPatch('/:id', ValidateMiddleware(updateUserSchema), AuthMiddleware)
  public async updateUser(
    @requestParam('id') id: string,
    @requestBody() body: IUpdateUserRequest,
    @response() res: Response,
  ): Promise<Response> {
    await this.updateUserUseCase.execute(id, body);
    return res.status(200).json({ success: true, message: 'User updated successfully' });
  }

  @httpDelete('/:id', AuthMiddleware)
  public async deleteUser(@requestParam('id') id: string, @response() res: Response): Promise<Response> {
    await this.deleteUserUseCase.execute(id);
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  }
}
