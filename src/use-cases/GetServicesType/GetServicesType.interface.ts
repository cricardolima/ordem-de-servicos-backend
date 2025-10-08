import { ServicesType } from "@prisma/client";

export interface IGetServicesTypeUseCase {
    execute(): Promise<ServicesType[]>;
}