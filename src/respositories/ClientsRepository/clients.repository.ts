import type { ICreateClientAddressRequest, ICreateClientRequest } from '@dtos/models';
import prisma from '@lib/prisma';
import type { Client } from '@prisma/client';
import { injectable } from 'inversify';
import type { IClientsRepository } from './clients.interface';

@injectable()
export class ClientsRepository implements IClientsRepository {
  public async findByPhone(phone: string): Promise<Client | null> {
    return await prisma.client.findFirst({
      where: { phone, deletedAt: null },
    });
  }

  public async create(client: ICreateClientRequest): Promise<Client> {
    const clientData = {
      name: client.name,
      phone: client.phone,
      ...this.buildClientAddressRelation(client.address),
    };

    return await prisma.client.create({
      data: clientData,
      include: {
        clientAddress: true,
      },
    });
  }

  /**
   * Constrói a relação de endereços do cliente de forma segura.
   * Se não houver endereços, retorna objeto vazio (Prisma ignora campos undefined).
   *
   * @param addresses - Array de endereços do cliente (pode ser vazio ou undefined)
   * @returns Objeto com a relação clientAddress ou objeto vazio
   */
  private buildClientAddressRelation(addresses?: ICreateClientAddressRequest[]): Record<string, unknown> {
    // Se não houver endereços ou o array estiver vazio, retorna objeto vazio
    // O Prisma simplesmente não cria a relação quando o campo não é fornecido
    if (!addresses || addresses.length === 0) {
      return {};
    }

    return {
      clientAddress: {
        connectOrCreate: addresses.map((address) => ({
          where: {
            street_number_neighborhood_zipCode: {
              street: address.street,
              number: address.number,
              neighborhood: address.neighborhood,
              zipCode: address.zipCode ?? null,
            },
          },
          create: {
            street: address.street,
            number: address.number,
            complement: address.complement ?? null,
            neighborhood: address.neighborhood,
            zipCode: address.zipCode ?? null,
          },
        })),
      },
    };
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
