import { TYPES } from '@container/types';
import type { ICreateProfessionalsUseCase } from '@use-cases/CreateProfessionals';
import type { IDeleteProfessionalUseCase } from '@use-cases/DeleteProfessional';
import type { IGetProfessionalByIdUseCase } from '@use-cases/GetProfessionalById';
import type { IGetProfessionalsUseCase } from '@use-cases/GetProfessionals';
import type { IUpdateProfessionalUseCase } from '@use-cases/UpdateProfessional';
import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
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

  public async getProfessionalById(req: Request, _res: Response) {
    return this.getProfessionalByIdUseCase.execute(req.params.id as string);
  }

  public async getProfessionals(_req: Request, _res: Response) {
    return this.getProfessionalsUseCase.execute();
  }

  public async createProfessional(req: Request, _res: Response) {
    return this.createProfessionalsUseCase.execute(req.session, req.body);
  }

  public async updateProfessional(req: Request, res: Response) {
    await this.updateProfessionalUseCase.execute(req.params.id as string, req.session, req.body);
    return res.status(200).json({ success: true, message: 'Professional updated successfully' });
  }

  public async deleteProfessional(req: Request, res: Response) {
    await this.deleteProfessionalUseCase.execute(req.params.id as string, req.session);
    return res.status(200).json({ success: true, message: 'Professional deleted successfully' });
  }
}
