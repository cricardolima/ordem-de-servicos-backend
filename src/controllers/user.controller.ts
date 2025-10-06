import { controller, httpGet, httpPost } from "inversify-express-utils";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { IGetUsersUseCase } from "@use-cases/GetUsers";
import { inject } from "inversify";
import { TYPES } from "@container/types";
import { User } from "@prisma/client";

@controller("/users")
export class UserController {
    private readonly getUsersUseCase: IGetUsersUseCase;

    constructor(@inject(TYPES.IGetUsersUseCase) getUsersUseCase: IGetUsersUseCase) {
        this.getUsersUseCase = getUsersUseCase;
    }

    @httpGet("/", AuthMiddleware)
    public async getUsers(): Promise<User[]> {
        return this.getUsersUseCase.execute();
    }
}