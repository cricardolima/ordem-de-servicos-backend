import type { ICreateClientAddressRequest } from '@dtos/models';
import prisma from '@lib/prisma';
import type { ClientAddress } from '@prisma/client';
import { injectable } from 'inversify';
import type { IClientAddressRepository } from './clientAddress.interface';

@injectable()
export class ClientAddressRepository implements IClientAddressRepository {
  public async createClientAddress(clientAddress: ICreateClientAddressRequest): Promise<ClientAddress> {
    return await prisma.clientAddress.create({
      data: clientAddress,
    });
  }

  public async findAddressWithWhere(address: ICreateClientAddressRequest): Promise<ClientAddress | null> {
    return (
      (await prisma.clientAddress.findFirst({
        where: {
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          zipCode: address.zipCode,
        },
      })) || null
    );
  }
}
