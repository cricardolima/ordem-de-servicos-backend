import type { ISession, IUpdateProfessionalsRequest } from '@dtos/models';

export interface IUpdateProfessionalUseCase {
  execute(id: string, session: ISession, professional: IUpdateProfessionalsRequest): Promise<void>;
}
