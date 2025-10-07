import { injectable } from "inversify";
import { IUserRepository } from "./user.respository.interface";
import prisma from "@lib/prisma";
import { User } from "@prisma/client";
import { ICreateUserRequest, IUpdateUserRequest } from "@dtos/models";

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

    public async create(user: ICreateUserRequest): Promise<User> {
        return await prisma.user.create({
            data: user,
        });
    }

    public async update(userId: string, data: IUpdateUserRequest): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: data,
        });
    }

    public async findById(userId: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
            include: {
                createdProfessionals: true,
                updatedProfessionals: true,
                deletedProfessionals: true,
                createdInvoices: true,
                updatedInvoices: true,
                deletedInvoices: true,
            },
        }) ?? null;
    }

    public async softDelete(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() },
        });
    }
}