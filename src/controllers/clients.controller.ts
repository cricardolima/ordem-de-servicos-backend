import { TYPES } from '@container/types';
import { AuthMiddleware } from '@middleware/auth.middleware';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import type { ICreateClientUseCase } from '@use-cases/CreateClient';
import type { IDeleteClientUseCase } from '@use-cases/DeleteClient';
import type { IGetClientByIdUseCase } from '@use-cases/GetClientById';
import { createClientSchema } from '@validators/createClientSchema.schema';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, request, requestParam, response } from 'inversify-express-utils';

@controller('/clients')
export class ClientsController {
  constructor(
    @inject(TYPES.ICreateClientUseCase)
    private readonly createClientUseCase: ICreateClientUseCase,
    @inject(TYPES.IGetClientByIdUseCase)
    private readonly getClientByIdUseCase: IGetClientByIdUseCase,
    @inject(TYPES.IDeleteClientUseCase)
    private readonly deleteClientUseCase: IDeleteClientUseCase,
  ) {}

  @httpGet('/:id', AuthMiddleware)
  public async getClientById(@requestParam('id') id: string) {
    return await this.getClientByIdUseCase.execute(id);
  }

  @httpPost('/', AuthMiddleware, ValidateMiddleware(createClientSchema))
  public async createClient(@request() req: Request) {
    return await this.createClientUseCase.execute(req.session, req.body);
  }

  @httpDelete('/:id', AuthMiddleware)
  public async deleteClient(@request() req: Request, @response() res: Response) {
    await this.deleteClientUseCase.execute(req.session, req.params.id as string);
    return res.status(200).json({ success: true, message: 'Client deleted successfully' });
  }
}
