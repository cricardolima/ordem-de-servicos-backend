import { TYPES } from '@container/types';
import { AuthMiddleware } from '@middleware/auth.middleware';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import type { ICreateProfessionalsUseCase } from '@use-cases/CreateProfessionals';
import type { IDeleteProfessionalUseCase } from '@use-cases/DeleteProfessional';
import type { IGetProfessionalByIdUseCase } from '@use-cases/GetProfessionalById';
import type { IGetProfessionalsUseCase } from '@use-cases/GetProfessionals';
import type { IUpdateProfessionalUseCase } from '@use-cases/UpdateProfessional';
import { createProfessionalSchema } from '@validators/createProfessional.schema';
import { updateProfessionalSchema } from '@validators/updateProfessional.schema';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils';

@controller('/professionals')
export class ProfessionalsController {
  constructor(
    @inject(TYPES.ICreateProfessionalsUseCase)
    private readonly createProfessionalsUseCase: ICreateProfessionalsUseCase,
    @inject(TYPES.IGetProfessionalByIdUseCase)
    private readonly getProfessionalByIdUseCase: IGetProfessionalByIdUseCase,
    @inject(TYPES.IGetProfessionalsUseCase)
    private readonly getProfessionalsUseCase: IGetProfessionalsUseCase,
    @inject(TYPES.IUpdateProfessionalUseCase)
    private readonly updateProfessionalUseCase: IUpdateProfessionalUseCase,
    @inject(TYPES.IDeleteProfessionalUseCase)
    private readonly deleteProfessionalUseCase: IDeleteProfessionalUseCase,
  ) {}

  @httpGet('/:id', AuthMiddleware)
  public async getProfessionalById(@request() req: Request, @response() _res: Response) {
    return this.getProfessionalByIdUseCase.execute(req.params.id as string);
  }

  @httpGet('/', AuthMiddleware)
  public async getProfessionals(@request() _req: Request, @response() _res: Response) {
    return this.getProfessionalsUseCase.execute();
  }

  @httpPost('/', AuthMiddleware, ValidateMiddleware(createProfessionalSchema))
  public async createProfessional(@request() req: Request, @response() _res: Response) {
    return this.createProfessionalsUseCase.execute(req.session, req.body);
  }

  @httpPatch('/:id', AuthMiddleware, ValidateMiddleware(updateProfessionalSchema))
  public async updateProfessional(@request() req: Request, @response() res: Response) {
    await this.updateProfessionalUseCase.execute(req.params.id as string, req.session, req.body);
    return res.status(200).json({ success: true, message: 'Professional updated successfully' });
  }

  @httpDelete('/:id', AuthMiddleware)
  public async deleteProfessional(@request() req: Request, @response() res: Response) {
    await this.deleteProfessionalUseCase.execute(req.params.id as string, req.session);
    return res.status(200).json({ success: true, message: 'Professional deleted successfully' });
  }
}
