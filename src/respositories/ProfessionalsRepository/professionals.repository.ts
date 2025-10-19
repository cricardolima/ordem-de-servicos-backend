import { injectable } from "inversify";
import { IProfessionalsRepository } from "./professionals.interface";
import prisma from "@lib/prisma";
import { Professionals } from "@prisma/client";
import { ICreateProfessionalsRequest, IUpdateProfessionalsRequest } from "@dtos/models";

@injectable()
export class ProfessionalsRepository implements IProfessionalsRepository {
    private readonly include = {
        createdBy: {
            select: {
                id: true,
                name: true,
                registration: true,
            },
        },
        updatedBy: {
            select: {
                id: true,
                name: true,
                registration: true,
            },
        },
        deletedBy: {
            select: {
                id: true,
                name: true,
                registration: true,
            },
        },
        servicesInvoice: {
            include: {
                serviceType: true,
                client: true,
                createdBy: true,
                updatedBy: true,
            },
        },
    };

    public async create(professional: ICreateProfessionalsRequest): Promise<Professionals> {
        return await prisma.professionals.create({
            data: professional,
        });
    }

    public async findByRegistration(registration: string): Promise<Professionals | null> {
        return await prisma.professionals.findUnique({
            where: { registration },
        });
    }

    public async findById(id: string): Promise<Professionals | null> {
        return await prisma.professionals.findUnique({
            where: { id },
            include: this.include,
        }) ?? null;
    }

    public async findAll(): Promise<Professionals[]> {
        return await prisma.professionals.findMany({
            where: { deletedAt: null },
            include: this.include,
        });
    }

    public async update(id: string, professional: IUpdateProfessionalsRequest): Promise<void> {
        await prisma.professionals.update({
            where: { id },
            data: professional,
        });
    }
}