import { Client } from "@prisma/client";
import { ISession, ICreateClientRequest } from "@dtos/models";

export interface ICreateClientUseCase {
    execute(session: ISession, client: ICreateClientRequest): Promise<Client>;
}