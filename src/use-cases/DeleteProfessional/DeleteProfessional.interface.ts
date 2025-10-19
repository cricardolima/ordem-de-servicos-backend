import { ISession } from "@dtos/models";

export interface IDeleteProfessionalUseCase {
    execute(id: string, session: ISession): Promise<void>;
}