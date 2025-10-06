import { injectable } from "inversify";
import { IUserRepository } from "./user.respository.interface";
import prisma from "@lib/prisma";
import { User } from "@prisma/client";

@injectable()
export class UserRepository implements IUserRepository {
    public async findByRegistration(registration: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                registration
            },
        }) || null;
        
        return user;
    }

    public async findAll(): Promise<User[]> {
        return await prisma.user.findMany();
    }
}