import type { ICreateClientAddressRequest } from '@dtos/models';
import type { ClientAddress } from '@prisma/client';
import type { IClientAddressRepository } from '@repositories/ClientAddressRepository';
import { injectable } from 'inversify';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

@injectable()
export class InMemoryClientAddressRepository
  extends BaseInMemoryRepository<ClientAddress>
  implements IClientAddressRepository
{
  public async createClientAddress(clientAddress: ICreateClientAddressRequest): Promise<ClientAddress> {
    const createdAddress: ClientAddress = {
      id: clientAddress.id ?? this.generateUUID(),
      street: clientAddress.street,
      number: clientAddress.number,
      complement: clientAddress.complement ?? null,
      neighborhood: clientAddress.neighborhood,
      zipCode: clientAddress.zipCode ?? null,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };

    this.addItem(createdAddress);
    return createdAddress;
  }

  public async findAddressWithWhere(address: ICreateClientAddressRequest): Promise<ClientAddress | null> {
    return (
      this.items.find(
        (item) =>
          item.street === address.street &&
          item.number === address.number &&
          item.neighborhood === address.neighborhood &&
          item.zipCode === (address.zipCode ?? null),
      ) || null
    );
  }
}
