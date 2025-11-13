import { TYPES } from '@container/types';
import type { ISession } from '@dtos/models';
import type { IClientsRepository } from '@repositories/ClientsRepository';
import type { IDeleteClientUseCase } from '@use-cases/DeleteClient/DeleteClient.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteClientUseCase implements IDeleteClientUseCase {
  constructor(@inject(TYPES.IClientsRepository) private readonly clientRepository: IClientsRepository) {}

  async execute(session: ISession, id: string): Promise<void> {
    console.log(session, id);
  }
}
