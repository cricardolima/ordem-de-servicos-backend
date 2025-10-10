import { injectable } from "inversify";
import { IServicesTypeRepository } from "./servicesType.repository.interface";
import { ServicesType } from "@prisma/client";
import prisma from "@lib/prisma";
import { ICreateServicesTypeRequest } from "@dtos/models";

@injectable()
export class ServicesTypeRepository implements IServicesTypeRepository {
    public async findAll(): Promise<ServicesType[]> {
        return await prisma.servicesType.findMany();
    }

    public async create(servicesType: ICreateServicesTypeRequest): Promise<ServicesType> {
        return await prisma.servicesType.create({
            data: servicesType,
        });
    }

    public async findByServiceCode(serviceCode: string): Promise<ServicesType | null> {
        return await prisma.servicesType.findFirst({
            where: { serviceCode, deletedAt: null },
        });
    }

    public async deleteFromId(id: string): Promise<void> {
        await prisma.servicesType.delete({
            where: { id },
        });
    }

    public async findById(id: string): Promise<ServicesType | null> {
        return await prisma.servicesType.findUnique({
            where: { id, deletedAt: null },
        });
    }
}