import { Professionals } from "@prisma/client";

export interface IGetProfessionalsUseCase {
    execute(): Promise<Professionals[]>;
}