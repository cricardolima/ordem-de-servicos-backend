import type { ISession } from '@dtos/models';

export interface IDeleteClientUseCase {
  execute(session: ISession, id: string): Promise<void>;
}
