import { injectable, inject } from "inversify";
import { ICreateClientUseCase } from "@use-cases/CreateClient";
import { TYPES } from "@container/types";
import { IClientsRepository } from "@repositories/ClientsRepository";
import { Client, ClientAddress } from "@prisma/client";
import { ICreateClientRequest, ISession } from "@dtos/models";
import { BusinessException } from "@exceptions/business.exception";
import { IClientAddressRepository } from "@repositories/ClientAddressRepository";

@injectable()
export class CreateClientUseCase implements ICreateClientUseCase {
    constructor(
        @inject(TYPES.IClientsRepository)
        private readonly clientsRepository: IClientsRepository,
        @inject(TYPES.IClientAddressRepository)
        private readonly clientAddressRepository: IClientAddressRepository,
    ) {}

    public async execute(session: ISession, client: ICreateClientRequest): Promise<Client> {
        const clientExists = await this.clientsRepository.findByPhone(client.phone);
        if (clientExists) {
            throw new BusinessException("Client already exists");
        }

        return await this.clientsRepository.create(client);
    }
}