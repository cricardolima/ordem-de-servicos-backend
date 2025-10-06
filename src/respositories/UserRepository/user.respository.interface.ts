import { User } from "@prisma/client";
import { ICreateUserRequest } from "@dtos/models";

export interface IUserRepository {
    findByRegistration(registration: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(user: ICreateUserRequest): Promise<User>;
}