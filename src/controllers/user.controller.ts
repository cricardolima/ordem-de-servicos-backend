import { controller, httpGet, httpPost, requestBody, response } from "inversify-express-utils";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { IGetUsersUseCase } from "@use-cases/GetUsers";
import { inject } from "inversify";
import { TYPES } from "@container/types";
import { User } from "@prisma/client";
import { ICreateUserUseCase } from "@use-cases/CreateUser";
import { ICreateUserRequest } from "@dtos/models";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { createUserSchema } from "@validators/createUser.schema";
import { Response } from "express";

@controller("/users")
export class UserController {
    private readonly getUsersUseCase: IGetUsersUseCase;
    private readonly createUserUseCase: ICreateUserUseCase;

    constructor(@inject(TYPES.IGetUsersUseCase) getUsersUseCase: IGetUsersUseCase, @inject(TYPES.ICreateUserUseCase) createUserUseCase: ICreateUserUseCase) {
        this.getUsersUseCase = getUsersUseCase;
        this.createUserUseCase = createUserUseCase;
    }

    @httpGet("/", AuthMiddleware)
    public async getUsers(): Promise<User[]> {
        return this.getUsersUseCase.execute();
    }

    @httpPost("/", ValidateMiddleware(createUserSchema), AuthMiddleware)
    public async createUser(@requestBody() body: ICreateUserRequest, @response() res: Response): Promise<Response> {
        const user = await this.createUserUseCase.execute(body);
        return res.status(201).json(user);
    }
}