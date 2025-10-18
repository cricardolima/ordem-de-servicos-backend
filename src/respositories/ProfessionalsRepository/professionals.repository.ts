import { injectable } from "inversify";
import { IProfessionalsRepository } from "./professionals.interface";
import prisma from "@lib/prisma";
import { Professionals } from "@prisma/client";
import { ICreateProfessionalsRequest } from "@dtos/models";

@injectable()
export class ProfessionalsRepository implements IProfessionalsRepository {
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
}