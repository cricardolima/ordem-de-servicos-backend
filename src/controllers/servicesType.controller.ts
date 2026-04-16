import { TYPES } from '@container/types';
import type { ICreateServicesTypeRequest, IUpdateServicesTypeRequest } from '@dtos/models';
import type { ICreateServicesTypeUseCase } from '@use-cases/CreateServicesType/CreateServicesType.interface';
import type { IDeleteServiceTypeUseCase } from '@use-cases/DeleteServiceType/DeleteServiceType.interface';
import type { IGetServicesTypeUseCase } from '@use-cases/GetServicesType/GetServicesType.interface';
import type { IGetServicesTypeByIdUseCase } from '@use-cases/GetServicesTypeById/GetServicesTypeById.interface';
import type { IUpdateServicesTypeUseCase } from '@use-cases/UpdateServicesType';
import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ServicesTypeController {
  constructor(
    @inject(TYPES.IGetServicesTypeUseCase)
    private readonly getServicesTypeUseCase: IGetServicesTypeUseCase,
    @inject(TYPES.ICreateServicesTypeUseCase)
    private readonly createServicesTypeUseCase: ICreateServicesTypeUseCase,
    @inject(TYPES.IDeleteServiceTypeUseCase)
    private readonly deleteServicesTypeUseCase: IDeleteServiceTypeUseCase,
    @inject(TYPES.IUpdateServicesTypeUseCase)
    private readonly updateServicesTypeUseCase: IUpdateServicesTypeUseCase,
    @inject(TYPES.IGetServicesTypeByIdUseCase)
    private readonly getServicesTypeByIdUseCase: IGetServicesTypeByIdUseCase,
  ) {}

  public async getServicesType() {
    return this.getServicesTypeUseCase.execute();
  }

  public async createServicesType(req: Request, _res: Response) {
    return this.createServicesTypeUseCase.execute(req.body as ICreateServicesTypeRequest);
  }

  public async deleteServicesType(req: Request, res: Response) {
    await this.deleteServicesTypeUseCase.execute(req.params.id as string);
    return res.status(200).json({ success: true, message: 'Service type deleted successfully' });
  }

  public async updateServicesType(req: Request, res: Response) {
    await this.updateServicesTypeUseCase.execute(req.params.id as string, req.body as IUpdateServicesTypeRequest);
    return res.status(200).json({ success: true, message: 'Service type updated successfully' });
  }

  public async getServicesTypeById(req: Request) {
    return this.getServicesTypeByIdUseCase.execute(req.params.id as string);
  }
}
