import { User } from "@prisma/client";

export interface IGetUserByIdUseCase {
    execute(id: string): Promise<User>;
}