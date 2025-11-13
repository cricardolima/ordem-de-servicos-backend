import type { ICreateClientAddressRequest } from '@dtos/models';
import type { ClientAddress } from '@prisma/client';

export interface IClientAddressRepository {
  createClientAddress(clientAddress: ICreateClientAddressRequest): Promise<ClientAddress>;
  findAddressWithWhere(address: ICreateClientAddressRequest): Promise<ClientAddress | null>;
}
