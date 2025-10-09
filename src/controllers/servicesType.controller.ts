import { inject } from "inversify";
import { controller, httpGet, httpPost, request, response } from "inversify-express-utils";
import { IGetServicesTypeUseCase } from "@use-cases/GetServicesType/GetServicesType.interface";
import { TYPES } from "@container/types";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { ICreateServicesTypeUseCase } from "@use-cases/CreateServicesType/CreateServicesType.interface";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { createServiceTypeSchema } from "@validators/createServiceType.schema";
import { ICreateServicesTypeRequest } from "@dtos/models";
import { Request, Response } from "express";


@controller("/services-type")
export class ServicesTypeController {
    constructor(
        @inject(TYPES.IGetServicesTypeUseCase)
        private readonly getServicesTypeUseCase: IGetServicesTypeUseCase,
        @inject(TYPES.ICreateServicesTypeUseCase)
        private readonly createServicesTypeUseCase: ICreateServicesTypeUseCase
    ) {}

    @httpGet("/", AuthMiddleware)
    public async getServicesType() {
        return this.getServicesTypeUseCase.execute();
    }

    @httpPost("/", AuthMiddleware, ValidateMiddleware(createServiceTypeSchema))
    public async createServicesType(@request() req: Request, @response() res: Response) {   
        return this.createServicesTypeUseCase.execute(req.body as ICreateServicesTypeRequest);
    }
}