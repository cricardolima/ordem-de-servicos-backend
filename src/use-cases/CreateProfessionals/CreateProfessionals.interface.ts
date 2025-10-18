import { Professionals } from "@prisma/client";
import { ICreateProfessionalsRequest, ISession } from "@dtos/models";

export interface ICreateProfessionalsUseCase {
    execute(session: ISession, professional: ICreateProfessionalsRequest): Promise<Professionals>;
}