import { TYPES } from "@container/types";
import { IRefreshTokenRequestDto, IUserLoginRequest } from "@dtos/models";
import { IRefreshTokenUseCase } from "@use-cases/RefreshToken";
import { IUserLoginUseCase } from "@use-cases/UserLogin";
import { inject } from "inversify";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { authSchema } from "@validators/auth.schema";

@controller("/auth")
export class AuthController {
    private readonly userLoginUseCase: IUserLoginUseCase;
    private readonly refreshTokenUseCase: IRefreshTokenUseCase;

    constructor(@inject(TYPES.IUserLoginUseCase) userLoginUseCase: IUserLoginUseCase, @inject(TYPES.IRefreshTokenUseCase) refreshTokenUseCase: IRefreshTokenUseCase) {
        this.userLoginUseCase = userLoginUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
    }

    @httpPost("/login", ValidateMiddleware(authSchema))
    public async login(@requestBody() body: IUserLoginRequest) {
        return this.userLoginUseCase.execute(body);
    }

    @httpPost("/refresh-token")
    public async refreshToken(@requestBody() body: IRefreshTokenRequestDto) {
        return this.refreshTokenUseCase.validateRefreshToken(body.refreshToken);
    }

    @httpPost("/logout")
    public async logout(@requestBody() body: IRefreshTokenRequestDto) {
        return this.refreshTokenUseCase.revokeRefreshToken(body.refreshToken);
    }
}