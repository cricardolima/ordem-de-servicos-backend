import { ICreateUserRequest } from "@dtos/models";
import { User } from "@prisma/client";

export interface ICreateUserUseCase {
    execute(user: ICreateUserRequest): Promise<User>;
}