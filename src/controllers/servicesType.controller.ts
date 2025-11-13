import { TYPES } from '@container/types';
import type { ICreateServicesTypeRequest, IUpdateServicesTypeRequest } from '@dtos/models';
import { AuthMiddleware } from '@middleware/auth.middleware';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import type { ICreateServicesTypeUseCase } from '@use-cases/CreateServicesType/CreateServicesType.interface';
import type { IDeleteServiceTypeUseCase } from '@use-cases/DeleteServiceType/DeleteServiceType.interface';
import type { IGetServicesTypeUseCase } from '@use-cases/GetServicesType/GetServicesType.interface';
import type { IGetServicesTypeByIdUseCase } from '@use-cases/GetServicesTypeById/GetServicesTypeById.interface';
import type { IUpdateServicesTypeUseCase } from '@use-cases/UpdateServicesType';
import { createServiceTypeSchema } from '@validators/createServiceType.schema';
import { updateServiceTypeSchema } from '@validators/updateServiceType.schema';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  request,
  requestParam,
  response,
} from 'inversify-express-utils';

@controller('/services-type')
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

  @httpGet('/', AuthMiddleware)
  public async getServicesType() {
    return this.getServicesTypeUseCase.execute();
  }

  @httpPost('/', AuthMiddleware, ValidateMiddleware(createServiceTypeSchema))
  public async createServicesType(@request() req: Request, @response() _res: Response) {
    return this.createServicesTypeUseCase.execute(req.body as ICreateServicesTypeRequest);
  }

  @httpDelete('/:id', AuthMiddleware)
  public async deleteServicesType(@requestParam('id') id: string, @response() res: Response) {
    await this.deleteServicesTypeUseCase.execute(id);
    return res.status(200).json({ success: true, message: 'Service type deleted successfully' });
  }

  @httpPatch('/:id', AuthMiddleware, ValidateMiddleware(updateServiceTypeSchema))
  public async updateServicesType(@requestParam('id') id: string, @request() req: Request, @response() res: Response) {
    await this.updateServicesTypeUseCase.execute(id, req.body as IUpdateServicesTypeRequest);
    return res.status(200).json({ success: true, message: 'Service type updated successfully' });
  }

  @httpGet('/:id', AuthMiddleware)
  public async getServicesTypeById(@requestParam('id') id: string) {
    return this.getServicesTypeByIdUseCase.execute(id);
  }
}
