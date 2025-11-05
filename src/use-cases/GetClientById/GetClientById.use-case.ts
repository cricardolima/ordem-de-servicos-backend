import { injectable, inject } from "inversify";
import { IGetClientByIdUseCase } from "./GetClientById.interface";
import { TYPES } from "@container/types";
import { IClientsRepository } from "@repositories/ClientsRepository";
import { Client } from "@prisma/client";
import { NotFoundException } from "@exceptions/notFound.exception";

@injectable()
export class GetClientByIdUseCase implements IGetClientByIdUseCase {
    constructor(@inject(TYPES.IClientsRepository) private readonly clientsRepository: IClientsRepository) {}

    public async execute(id: string): Promise<Client> {
        const client = await this.clientsRepository.findById(id);
        if (!client) {
            throw new NotFoundException("Client not found");
        }
        return client;
    }
}