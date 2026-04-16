import { TYPES } from '@container/types';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { IClientsRepository } from '@repositories/ClientsRepository';
import type { IDeleteClientUseCase } from '@use-cases/DeleteClient/DeleteClient.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteClientUseCase implements IDeleteClientUseCase {
  constructor(@inject(TYPES.IClientsRepository) private readonly clientRepository: IClientsRepository) {}

  async execute(id: string): Promise<void> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.clientRepository.deleteFromId(id);
  }
}
