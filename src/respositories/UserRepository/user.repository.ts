import { injectable } from "inversify";
import { IUserRepository } from "./user.respository.interface";
import prisma from "@lib/prisma";
import { User } from "@prisma/client";

@injectable()
export class UserRepository implements IUserRepository {
    public async findByRegistration(registration: string): Promise<User> {
        return await prisma.user.findFirstOrThrow({
            where: {
                registration
            },
        }) as User;
    }
}