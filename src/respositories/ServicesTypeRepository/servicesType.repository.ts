import { injectable } from "inversify";
import { IServicesTypeRepository } from "./servicesType.repository.interface";
import { ServicesType } from "@prisma/client";
import prisma from "@lib/prisma";

@injectable()
export class ServicesTypeRepository implements IServicesTypeRepository {
    public async findAll(): Promise<ServicesType[]> {
        return await prisma.servicesType.findMany();
    }
}