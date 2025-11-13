import { TYPES } from '@container/types';
import type { ICreateClientRequest, ISession } from '@dtos/models';
import { BusinessException } from '@exceptions/business.exception';
import type { Client } from '@prisma/client';
import type { IClientAddressRepository } from '@repositories/ClientAddressRepository';
import type { IClientsRepository } from '@repositories/ClientsRepository';
import type { ICreateClientUseCase } from '@use-cases/CreateClient';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateClientUseCase implements ICreateClientUseCase {
  constructor(
    @inject(TYPES.IClientsRepository)
    private readonly clientsRepository: IClientsRepository,
    @inject(TYPES.IClientAddressRepository) readonly _clientAddressRepository: IClientAddressRepository,
  ) {}

  public async execute(_session: ISession, client: ICreateClientRequest): Promise<Client> {
    const clientExists = await this.clientsRepository.findByPhone(client.phone);
    if (clientExists) {
      throw new BusinessException('Client already exists');
    }

    return await this.clientsRepository.create(client);
  }
}
