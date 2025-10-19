import { Professionals } from "@prisma/client";
import { ICreateProfessionalsRequest, IUpdateProfessionalsRequest } from "@dtos/models";

export interface IProfessionalsRepository {
    create(professional: ICreateProfessionalsRequest): Promise<Professionals>;
    findByRegistration(registration: string): Promise<Professionals | null>;
    findById(id: string): Promise<Professionals | null>;
    findAll(): Promise<Professionals[]>;
    update(id: string, professional: IUpdateProfessionalsRequest): Promise<void>;
}