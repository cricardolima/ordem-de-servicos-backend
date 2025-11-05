import { controller, httpPost, request, response, httpGet, requestParam } from "inversify-express-utils";
import { TYPES } from "@container/types";
import { ICreateClientUseCase } from "@use-cases/CreateClient";
import { inject } from "inversify";
import { Request, Response } from "express";
import { ICreateClientRequest } from "@dtos/models";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { createClientSchema } from "@validators/createClientSchema.schema";
import { IGetClientByIdUseCase } from "@use-cases/GetClientById";

@controller("/clients")
export class ClientsController {
    constructor(
        @inject(TYPES.ICreateClientUseCase)
        private readonly createClientUseCase: ICreateClientUseCase,
        @inject(TYPES.IGetClientByIdUseCase)
        private readonly getClientByIdUseCase: IGetClientByIdUseCase,
    ) {}

    @httpGet("/:id", AuthMiddleware)
    public async getClientById(@requestParam("id") id: string) {
        return await this.getClientByIdUseCase.execute(id);
    }

    @httpPost("/", AuthMiddleware, ValidateMiddleware(createClientSchema))
    public async createClient(@request() req: Request) {
        return await this.createClientUseCase.execute(req.session, req.body);
    }
}