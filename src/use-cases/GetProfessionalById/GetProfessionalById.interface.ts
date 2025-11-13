import type { Professionals } from '@prisma/client';

export interface IGetProfessionalByIdUseCase {
  execute(registration: string): Promise<Professionals>;
}
