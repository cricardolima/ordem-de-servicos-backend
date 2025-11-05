import { Client } from "@prisma/client";
import { ICreateClientRequest } from "@dtos/models";

export interface IClientsRepository {
    findByPhone(phone: string): Promise<Client | null>;
    create(client: ICreateClientRequest): Promise<Client>;
    findById(id: string): Promise<Client | null>;
}