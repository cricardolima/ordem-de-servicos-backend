import { TYPES } from '@container/types';
import type { ICreateClientUseCase } from '@use-cases/CreateClient';
import type { IDeleteClientUseCase } from '@use-cases/DeleteClient';
import type { IGetClientByIdUseCase } from '@use-cases/GetClientById';
import type { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ClientsController {
  constructor(
    @inject(TYPES.ICreateClientUseCase)
    private readonly createClientUseCase: ICreateClientUseCase,
    @inject(TYPES.IGetClientByIdUseCase)
    private readonly getClientByIdUseCase: IGetClientByIdUseCase,
    @inject(TYPES.IDeleteClientUseCase)
    private readonly deleteClientUseCase: IDeleteClientUseCase,
  ) {}

  public async getClientById(req: Request) {
    return await this.getClientByIdUseCase.execute(req.params.id as string);
  }

  public async createClient(req: Request) {
    return await this.createClientUseCase.execute(req.session, req.body);
  }

  public async deleteClient(req: Request, res: Response) {
    await this.deleteClientUseCase.execute(req.params.id as string);
    return res.status(200).json({ success: true, message: 'Client deleted successfully' });
  }
}
