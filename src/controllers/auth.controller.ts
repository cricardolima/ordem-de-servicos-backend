import { TYPES } from "@container/types";
import { IUserLoginRequest } from "@dtos/models";
import { IRefreshTokenUseCase } from "@use-cases/RefreshToken";
import { IUserLoginUseCase } from "@use-cases/UserLogin";
import { inject } from "inversify";
import { controller, httpPost, request, requestBody, response } from "inversify-express-utils";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { authSchema } from "@validators/auth.schema";
import { Request, Response } from "express";

@controller("/auth")
export class AuthController {
    private readonly userLoginUseCase: IUserLoginUseCase;
    private readonly refreshTokenUseCase: IRefreshTokenUseCase;

    constructor(@inject(TYPES.IUserLoginUseCase) userLoginUseCase: IUserLoginUseCase, @inject(TYPES.IRefreshTokenUseCase) refreshTokenUseCase: IRefreshTokenUseCase) {
        this.userLoginUseCase = userLoginUseCase;   
        this.refreshTokenUseCase = refreshTokenUseCase;
    }

    @httpPost("/login", ValidateMiddleware(authSchema))
    public async login(@requestBody() body: IUserLoginRequest, @response() res: Response) {
        return this.userLoginUseCase.execute(body, res);
    }

    @httpPost("/logout")
    public async logout(@request() req: Request, @response() res: Response) {
        await this.refreshTokenUseCase.revokeRefreshToken(req.cookies.refreshToken, res);
        return {
            success: true,
            message: "Logout successful"
        };
    }

    @httpPost("/refresh-token")
    public async refreshToken(@request() req: Request, @response() res: Response) {
        return this.refreshTokenUseCase.refreshToken(req.cookies.refreshToken, res);
    }
}