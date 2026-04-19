import { TYPES } from '@container/types';
import type { Client } from '@prisma/client';
import type { IClientsRepository } from '@repositories/ClientsRepository';
import { inject, injectable } from 'inversify';
import type { IGetClientsUseCase } from './GetClients.interface';

@injectable()
export class GetClientsUseCase implements IGetClientsUseCase {
  constructor(
    @inject(TYPES.IClientsRepository)
    private readonly clientsRepository: IClientsRepository,
  ) {}

  public async execute(): Promise<Client[]> {
    return await this.clientsRepository.findAll();
  }
}
