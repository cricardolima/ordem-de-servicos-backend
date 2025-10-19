import { Professionals } from "@prisma/client";
import { ICreateProfessionalsRequest, IUpdateProfessionalsRequest, ISession } from "@dtos/models";

export interface IProfessionalsRepository {
    create(professional: ICreateProfessionalsRequest): Promise<Professionals>;
    findByRegistration(registration: string): Promise<Professionals | null>;
    findById(id: string): Promise<Professionals | null>;
    findAll(): Promise<Professionals[]>;
    update(id: string, professional: IUpdateProfessionalsRequest): Promise<void>;
    deleteFromId(id: string, session: ISession): Promise<void>;
}