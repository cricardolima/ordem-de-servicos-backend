import { User } from "@prisma/client";
import { ICreateUserRequest, IUpdateUserRequest } from "@dtos/models";

export interface IUserRepository {
    findByRegistration(registration: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(user: ICreateUserRequest): Promise<User>;
    update(userId: string, data: IUpdateUserRequest): Promise<void>;
    findById(userId: string): Promise<User | null>;
}