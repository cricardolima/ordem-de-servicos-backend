import { injectable, inject } from "inversify";
import { IGetUsersUseCase } from "./GetUsers.interface";
import { User } from "@prisma/client";
import { IUserRepository } from "@repositories/UserRepository";
import { TYPES } from "@container/types";

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
    private readonly userRepository: IUserRepository;

    constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}