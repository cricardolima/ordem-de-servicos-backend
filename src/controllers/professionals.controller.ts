import { controller, httpPost, httpGet, request, response, requestParam } from "inversify-express-utils";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { TYPES } from "@container/types";
import { ICreateProfessionalsUseCase } from "@use-cases/CreateProfessionals";
import { inject } from "inversify";
import { createProfessionalSchema } from "@validators/createProfessional.schema";
import { Request, Response } from "express";
import { IGetProfessionalByIdUseCase } from "@use-cases/GetProfessionalById";

@controller("/professionals")
export class ProfessionalsController {
    constructor(
        @inject(TYPES.ICreateProfessionalsUseCase) 
        private readonly createProfessionalsUseCase: ICreateProfessionalsUseCase,
        @inject(TYPES.IGetProfessionalByIdUseCase)
        private readonly getProfessionalByIdUseCase: IGetProfessionalByIdUseCase,
    ) {}

    @httpGet("/:id", AuthMiddleware)
    public async getProfessionalById(@request() req: Request, @response() res: Response) {
        return this.getProfessionalByIdUseCase.execute(req.params.id as string);
    }

    @httpPost("/", AuthMiddleware, ValidateMiddleware(createProfessionalSchema))
    public async createProfessional(@request() req: Request, @response() res: Response) {
        return this.createProfessionalsUseCase.execute(req.session, req.body);
    }
}