import { controller, httpPost, request, response } from "inversify-express-utils";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { TYPES } from "@container/types";
import { ICreateProfessionalsUseCase } from "@use-cases/CreateProfessionals";
import { inject } from "inversify";
import { createProfessionalSchema } from "@validators/createProfessional.schema";
import { Request, Response } from "express";

@controller("/professionals")
export class ProfessionalsController {
    constructor(
        @inject(TYPES.ICreateProfessionalsUseCase) 
        private readonly createProfessionalsUseCase: ICreateProfessionalsUseCase,
    ) {}

    @httpPost("/", AuthMiddleware, ValidateMiddleware(createProfessionalSchema))
    public async createProfessional(@request() req: Request, @response() res: Response) {
        return this.createProfessionalsUseCase.execute(req.session, req.body);
    }
}