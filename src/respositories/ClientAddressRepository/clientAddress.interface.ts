import { ICreateClientAddressRequest, ISession } from "@dtos/models";
import { ClientAddress } from "@prisma/client";

export interface IClientAddressRepository {
    createClientAddress(clientAddress: ICreateClientAddressRequest): Promise<ClientAddress>;
    findAddressWithWhere(address: ICreateClientAddressRequest): Promise<ClientAddress | null>;
}