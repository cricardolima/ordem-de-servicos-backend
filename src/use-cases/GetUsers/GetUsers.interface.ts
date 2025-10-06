import { User } from "@prisma/client";

export interface IGetUsersUseCase {
    execute(): Promise<User[]>;
}