import type { ICreateServicesTypeRequest } from '@dtos/models';
import type { ServicesType } from '@prisma/client';

export interface ICreateServicesTypeUseCase {
  execute(servicesType: ICreateServicesTypeRequest): Promise<ServicesType>;
}
