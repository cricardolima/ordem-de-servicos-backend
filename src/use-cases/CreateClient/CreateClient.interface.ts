import type { ICreateClientRequest, ISession } from '@dtos/models';
import type { Client } from '@prisma/client';

export interface ICreateClientUseCase {
  execute(session: ISession, client: ICreateClientRequest): Promise<Client>;
}
