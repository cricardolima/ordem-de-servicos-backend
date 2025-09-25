import { TYPES } from "@container/types";
import { IUserLoginRequest } from "@dtos/models";
import { IUserLoginUseCase } from "@use-cases/UserLogin";
import { inject } from "inversify";
import { controller, httpPost, requestBody } from "inversify-express-utils";

@controller("/auth")
export class AuthController {
    private readonly userLoginUseCase: IUserLoginUseCase;

    constructor(@inject(TYPES.IUserLoginUseCase) userLoginUseCase: IUserLoginUseCase) {
        this.userLoginUseCase = userLoginUseCase;
    }

    @httpPost("/login")
    public async login(@requestBody() body: IUserLoginRequest) {
        return this.userLoginUseCase.execute(body);
    }
}