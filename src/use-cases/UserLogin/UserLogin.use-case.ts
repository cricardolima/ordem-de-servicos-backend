import { inject, injectable } from "inversify";
import { IUserLoginUseCase } from "@use-cases/UserLogin";
import { TYPES } from "@container/types";
import { IUserRepository } from "@repositories/UserRepository";
import verifyPassword from "@utils/verifyPassword";
import jwt from "jsonwebtoken";
import { IGenerateRefreshTokenUseCase } from "@use-cases/GenerateRefreshToken/GenerateRefreshToken.interface";
import { IUserLoginRequest, IUserLoginResponse } from "@dtos/models";

@injectable()
export class UserLoginUseCase implements IUserLoginUseCase {
    private readonly userRepository: IUserRepository;
    private readonly generateRefreshTokenUseCase: IGenerateRefreshTokenUseCase;

    constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository, @inject(TYPES.IGenerateRefreshTokenUseCase) generateRefreshTokenUseCase: IGenerateRefreshTokenUseCase) {
        this.userRepository = userRepository;
        this.generateRefreshTokenUseCase = generateRefreshTokenUseCase;
    }

    public async execute(request: IUserLoginRequest): Promise<IUserLoginResponse> {
        const { registration, password } = request;
        const user = await this.userRepository.findByRegistration(registration);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
        const refreshToken = await this.generateRefreshTokenUseCase.execute(user.id);
        
        return {
            accessToken: token,
            refreshToken: refreshToken.token,
        };
    }
}