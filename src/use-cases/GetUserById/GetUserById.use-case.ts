import { injectable, inject } from "inversify";
import { IGetUserByIdUseCase } from "./GetUserById.interface";
import { IUserRepository } from "@repositories/UserRepository";
import { TYPES } from "@container/types";
import { User } from "@prisma/client";
import { NotFoundException } from "@exceptions/notFound.exception";

@injectable()
export class GetUserByIdUseCase implements IGetUserByIdUseCase {
    constructor(@inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository) {}

    public async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }
}