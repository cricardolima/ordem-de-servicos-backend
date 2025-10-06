import { User } from "@prisma/client";

export interface IUserRepository {
    findByRegistration(registration: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}