import { TYPES } from '@container/types';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { Client } from '@prisma/client';
import type { IClientsRepository } from '@repositories/ClientsRepository';
import { inject, injectable } from 'inversify';
import type { IGetClientByIdUseCase } from './GetClientById.interface';

@injectable()
export class GetClientByIdUseCase implements IGetClientByIdUseCase {
  constructor(
    @inject(TYPES.IClientsRepository)
    private readonly clientsRepository: IClientsRepository,
  ) {}

  public async execute(id: string): Promise<Client> {
    const client = await this.clientsRepository.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }
}
