import type { ICreateClientRequest } from '@dtos/models';
import type { Client } from '@prisma/client';

export interface IClientsRepository {
  findByPhone(phone: string): Promise<Client | null>;
  create(client: ICreateClientRequest): Promise<Client>;
  findById(id: string): Promise<Client | null>;
}
