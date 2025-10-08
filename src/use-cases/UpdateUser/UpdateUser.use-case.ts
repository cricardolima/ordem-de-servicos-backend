import { injectable, inject } from "inversify";
import { IUpdateUserUseCase } from "./UpdateUser.interface";
import { IUpdateUserRequest } from "@dtos/models";
import { IUserRepository } from "@repositories/UserRepository";
import { TYPES } from "@container/types";
import { NotFoundException } from "@exceptions/notFound.exception";
import { hashPassword } from "@utils/hashPassword";

@injectable()
export class UpdateUserUseCase implements IUpdateUserUseCase {
    private readonly userRepository: IUserRepository;

    constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string, data: IUpdateUserRequest): Promise<void> {
        let passwordHash: string | undefined;
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (data.password) {
            passwordHash = await hashPassword(data.password);
        }

        const userToUpdate = Object.assign(user, { ...data, password: passwordHash || user.password });

        userToUpdate.updatedAt = new Date();
        await this.userRepository.update(userId, userToUpdate);
    }
}