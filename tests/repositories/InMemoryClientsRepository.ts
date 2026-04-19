import type { ICreateClientAddressRequest, ICreateClientRequest } from '@dtos/models';
import type { Client, ClientAddress } from '@prisma/client';
import type { IClientsRepository } from '@repositories/ClientsRepository';
import { injectable } from 'inversify';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

type ClientWithAddress = Client & {
  clientAddress: ClientAddress[];
};

@injectable()
export class InMemoryClientsRepository extends BaseInMemoryRepository<ClientWithAddress> implements IClientsRepository {
  private readonly addresses = new Map<string, ClientAddress>();

  private get activeClients(): ClientWithAddress[] {
    return this.items.filter((client) => client.deletedAt === null);
  }

  private normalizeAddress(address: ICreateClientAddressRequest): ClientAddress {
    const key = `${address.street}:${address.number}:${address.neighborhood}:${address.zipCode ?? ''}`;
    const existingAddress = this.addresses.get(key);

    if (existingAddress) {
      return existingAddress;
    }

    const createdAddress: ClientAddress = {
      id: address.id ?? this.generateUUID(),
      street: address.street,
      number: address.number,
      complement: address.complement ?? null,
      neighborhood: address.neighborhood,
      zipCode: address.zipCode ?? null,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };

    this.addresses.set(key, createdAddress);
    return createdAddress;
  }

  public async findByPhone(phone: string): Promise<Client | null> {
    return this.activeClients.find((client) => client.phone === phone) || null;
  }

  public async create(client: ICreateClientRequest): Promise<ClientWithAddress> {
    const newClient: ClientWithAddress = {
      id: client.id ?? this.generateUUID(),
      name: client.name,
      phone: client.phone,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      clientAddress: (client.address ?? []).map((address) => this.normalizeAddress(address)),
    };

    this.addItem(newClient);
    return newClient;
  }

  public async findById(id: string): Promise<Client | null> {
    return this.activeClients.find((client) => client.id === id) || null;
  }

  public async findAll(): Promise<Client[]> {
    return this.activeClients;
  }

  public async deleteFromId(id: string): Promise<void> {
    this.updateByProperty('id', id, {
      deletedAt: new Date(),
    });
  }
}
