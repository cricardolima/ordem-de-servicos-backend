import { controller, httpPost, httpGet, httpPatch, request, response, requestParam } from "inversify-express-utils";
import { AuthMiddleware } from "@middleware/auth.middleware";
import { ValidateMiddleware } from "@middleware/validate.middleware";
import { TYPES } from "@container/types";
import { ICreateProfessionalsUseCase } from "@use-cases/CreateProfessionals";
import { inject } from "inversify";
import { createProfessionalSchema } from "@validators/createProfessional.schema";
import { updateProfessionalSchema } from "@validators/updateProfessional.schema";
import { Request, Response } from "express";
import { IGetProfessionalByIdUseCase } from "@use-cases/GetProfessionalById";
import { IGetProfessionalsUseCase } from "@use-cases/GetProfessionals";
import { IUpdateProfessionalUseCase } from "@use-cases/UpdateProfessional";

@controller("/professionals")
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
    ) {}

    @httpGet("/:id", AuthMiddleware)
    public async getProfessionalById(@request() req: Request, @response() res: Response) {
        return this.getProfessionalByIdUseCase.execute(req.params.id as string);
    }
    
    @httpGet("/", AuthMiddleware)
    public async getProfessionals(@request() req: Request, @response() res: Response) {
        return this.getProfessionalsUseCase.execute();
    }

    @httpPost("/", AuthMiddleware, ValidateMiddleware(createProfessionalSchema))
    public async createProfessional(@request() req: Request, @response() res: Response) {
        return this.createProfessionalsUseCase.execute(req.session, req.body);
    }

    @httpPatch("/:id", AuthMiddleware, ValidateMiddleware(updateProfessionalSchema))
    public async updateProfessional(@request() req: Request, @response() res: Response) {
        await this.updateProfessionalUseCase.execute(req.params.id as string, req.session, req.body);
        return res.status(200).json({ success: true, message: "Professional updated successfully" });
    }
}