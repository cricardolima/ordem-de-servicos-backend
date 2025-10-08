import { inject } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { IGetServicesTypeUseCase } from "@use-cases/GetServicesType/GetServicesType.interface";
import { TYPES } from "@container/types";
import { AuthMiddleware } from "@middleware/auth.middleware";


@controller("/services-type")
export class ServicesTypeController {
    constructor(
        @inject(TYPES.IGetServicesTypeUseCase)
        private readonly getServicesTypeUseCase: IGetServicesTypeUseCase
    ) {}

    @httpGet("/", AuthMiddleware)
    public async getServicesType() {
        return this.getServicesTypeUseCase.execute();
    }
}