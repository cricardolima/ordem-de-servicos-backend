import type { IUpdateServicesTypeRequest } from '@dtos/models';

export interface IUpdateServicesTypeUseCase {
  execute(id: string, servicesType: IUpdateServicesTypeRequest): Promise<void>;
}
