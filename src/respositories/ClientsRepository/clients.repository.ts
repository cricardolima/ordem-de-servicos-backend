import { injectable } from "inversify";
import { IClientsRepository } from "./clients.interface";
import { Client } from "@prisma/client";
import prisma from "@lib/prisma";
import { ICreateClientRequest } from "@dtos/models";

@injectable()
export class ClientsRepository implements IClientsRepository {

    public async findByPhone(phone: string): Promise<Client | null> {
        return await prisma.client.findFirst({
            where: { phone, deletedAt: null },
        });
    }

    public async create(client: ICreateClientRequest): Promise<Client> {
        return await prisma.client.create({
            data: {
                name: client.name,
                phone: client.phone,
                clientAddress: client.address && client.address.length > 0 ? {
                    connectOrCreate: client.address.map(addr => ({
                        where: { 
                            street_number_neighborhood_zipCode: {
                                street: addr.street,
                                number: addr.number,
                                neighborhood: addr.neighborhood,
                                zipCode: addr.zipCode || "",
                            },
                        },
                        create: addr,
                    })),
                } : {
                    create: [],
                },
            },
            include: {
                clientAddress: true,
            },
        });
    }

    public async findById(id: string): Promise<Client | null> {
        return await prisma.client.findUnique({
            where: { id, deletedAt: null },
            include: {
                clientAddress: true,
            },
        });
    }
}