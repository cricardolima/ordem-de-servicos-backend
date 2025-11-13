import type { ServicesType } from '@prisma/client';

export interface IGetServicesTypeByIdUseCase {
  execute(id: string): Promise<ServicesType>;
}
