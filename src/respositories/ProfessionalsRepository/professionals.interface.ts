import { Professionals } from "@prisma/client";
import { ICreateProfessionalsRequest } from "@dtos/models";

export interface IProfessionalsRepository {
    create(professional: ICreateProfessionalsRequest): Promise<Professionals>;
    findByRegistration(registration: string): Promise<Professionals | null>;
}