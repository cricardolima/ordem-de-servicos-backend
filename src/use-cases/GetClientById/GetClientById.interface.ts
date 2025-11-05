import { Client } from "@prisma/client";

export interface IGetClientByIdUseCase {
    execute(id: string): Promise<Client>;
}