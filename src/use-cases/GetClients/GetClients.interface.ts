import type { Client } from '@prisma/client';

export interface IGetClientsUseCase {
  execute(): Promise<Client[]>;
}
