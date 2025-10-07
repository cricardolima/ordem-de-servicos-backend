import { controller, httpGet, httpPost, requestBody, response, httpPatch, requestParam, httpDelete } from "inversify-express-utils";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { IGetUsersUseCase } from "@use-cases/GetUsers";
import { inject } from "inversify";
import { TYPES } from "@container/types";
import { User } from "@prisma/client";
import { ICreateUserUseCase } from "@use-cases/CreateUser";
import { ICreateUserRequest, IUpdateUserRequest } from "@dtos/models";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { createUserSchema } from "@validators/createUser.schema";
import { Response } from "express";
import { IUpdateUserUseCase } from "@use-cases/UpdateUser";
import { updateUserSchema } from "@validators/updateUser.schema";
import { IDeleteUserUseCase } from "@use-cases/DeleteUser";
import { IGetUserByIdUseCase } from "@use-cases/GetUserById";

@controller("/users")
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
        @inject(TYPES.IGetUserByIdUseCase) getUserByIdUseCase: IGetUserByIdUseCase
    ) {
            this.getUsersUseCase = getUsersUseCase;
            this.createUserUseCase = createUserUseCase;
            this.updateUserUseCase = updateUserUseCase;
            this.deleteUserUseCase = deleteUserUseCase;
            this.getUserByIdUseCase = getUserByIdUseCase;
    }

    @httpGet("/", AuthMiddleware)
    public async getUsers(): Promise<User[]> {
        return this.getUsersUseCase.execute();
    }

    @httpGet("/:id", AuthMiddleware)
    public async getUser(@requestParam("id") id: string): Promise<User> {
        return this.getUserByIdUseCase.execute(id);
    }

    @httpPost("/", ValidateMiddleware(createUserSchema), AuthMiddleware)
    public async createUser(@requestBody() body: ICreateUserRequest, @response() res: Response): Promise<Response> {
        const user = await this.createUserUseCase.execute(body);
        return res.status(201).json(user);
    }

    @httpPatch("/:id", ValidateMiddleware(updateUserSchema), AuthMiddleware)
    public async updateUser(@requestParam("id") id: string, @requestBody() body: IUpdateUserRequest, @response() res: Response): Promise<Response> {
        await this.updateUserUseCase.execute(id, body);
        return res.status(200).json({ success: true, message: "User updated successfully" });
    }

    @httpDelete("/:id", AuthMiddleware)
    public async deleteUser(@requestParam("id") id: string, @response() res: Response): Promise<Response> {
        await this.deleteUserUseCase.execute(id);
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    }
}