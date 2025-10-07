import { injectable, inject } from "inversify";
import { IDeleteUserUseCase } from "./DeleteUser.interface";
import { IUserRepository } from "@repositories/UserRepository";
import { TYPES } from "@container/types";
import { NotFoundException } from "@exceptions/notFound.exception";
import { IRefreshTokenUseCase } from "@use-cases/RefreshToken";

@injectable()
export class DeleteUserUseCase implements IDeleteUserUseCase {
    constructor(@inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository, @inject(TYPES.IRefreshTokenUseCase) private readonly refreshTokenUseCase: IRefreshTokenUseCase) {}

    public async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        await this.refreshTokenUseCase.revokeAllUserTokens(userId);
        await this.userRepository.softDelete(userId);
    }
}