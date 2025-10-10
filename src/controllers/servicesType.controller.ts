import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, request, requestParam, response } from "inversify-express-utils";
import { IGetServicesTypeUseCase } from "@use-cases/GetServicesType/GetServicesType.interface";
import { TYPES } from "@container/types";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { ICreateServicesTypeUseCase } from "@use-cases/CreateServicesType/CreateServicesType.interface";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { createServiceTypeSchema } from "@validators/createServiceType.schema";
import { ICreateServicesTypeRequest } from "@dtos/models";
import { Request, Response } from "express";
import { IDeleteServiceTypeUseCase } from "@use-cases/DeleteServiceType/DeleteServiceType.interface";


@controller("/services-type")
export class ServicesTypeController {
    constructor(
        @inject(TYPES.IGetServicesTypeUseCase)
        private readonly getServicesTypeUseCase: IGetServicesTypeUseCase,
        @inject(TYPES.ICreateServicesTypeUseCase)
        private readonly createServicesTypeUseCase: ICreateServicesTypeUseCase,
        @inject(TYPES.IDeleteServiceTypeUseCase)
        private readonly deleteServicesTypeUseCase: IDeleteServiceTypeUseCase,
    ) {}

    @httpGet("/", AuthMiddleware)
    public async getServicesType() {
        return this.getServicesTypeUseCase.execute();
    }

    @httpPost("/", AuthMiddleware, ValidateMiddleware(createServiceTypeSchema))
    public async createServicesType(@request() req: Request, @response() res: Response) {   
        return this.createServicesTypeUseCase.execute(req.body as ICreateServicesTypeRequest);
    }

    @httpDelete("/:id", AuthMiddleware)
    public async deleteServicesType(@requestParam("id") id: string, @response() res: Response) {
        await this.deleteServicesTypeUseCase.execute(id);
        return res.status(200).json({ success: true, message: "Service type deleted successfully" });
    }
}