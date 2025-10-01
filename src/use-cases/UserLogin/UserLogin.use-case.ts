import { inject, injectable } from "inversify";
import { IUserLoginUseCase } from "@use-cases/UserLogin";
import { TYPES } from "@container/types";
import { IUserRepository } from "@repositories/UserRepository";
import verifyPassword from "@utils/verifyPassword";
import jwt from "jsonwebtoken";
import { IRefreshTokenUseCase } from "@use-cases/RefreshToken/RefreshToken.interface";
import { IUserLoginRequest, IUserLoginResponse } from "@dtos/models";
import { BusinessException } from "@exceptions/business.exception";
import { NotFoundException } from "@exceptions/notFound.exception";

@injectable()
export class UserLoginUseCase implements IUserLoginUseCase {
    private readonly userRepository: IUserRepository;
    private readonly refreshTokenUseCase: IRefreshTokenUseCase;

    constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository, @inject(TYPES.IRefreshTokenUseCase) refreshTokenUseCase: IRefreshTokenUseCase) {
        this.userRepository = userRepository;
        this.refreshTokenUseCase = refreshTokenUseCase;
    }

    public async execute(request: IUserLoginRequest): Promise<IUserLoginResponse> {
        const { registration, password } = request;
        const user = await this.userRepository.findByRegistration(registration);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new BusinessException("Invalid password");
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
        const refreshToken = await this.refreshTokenUseCase.generateRefreshToken(user.id);
        
        return {
            accessToken: token,
            refreshToken: refreshToken.token,
        };
    }
}