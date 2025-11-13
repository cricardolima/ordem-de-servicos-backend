import type { ICreateProfessionalsRequest, ISession } from '@dtos/models';
import type { Professionals } from '@prisma/client';

export interface ICreateProfessionalsUseCase {
  execute(session: ISession, professional: ICreateProfessionalsRequest): Promise<Professionals>;
}
