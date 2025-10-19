import { injectable } from "inversify";
import { IProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { Professionals } from "@prisma/client";
import { BaseInMemoryRepository } from "./BaseInMemoryRepository";
import { ICreateProfessionalsRequest } from "@dtos/models";

@injectable()
export class InMemoryProfessionalsRepository extends BaseInMemoryRepository<Professionals> implements IProfessionalsRepository {
    private professionals: Professionals[] = [];

    public create(professional: ICreateProfessionalsRequest): Promise<Professionals> {
        const newProfessional = { ...professional, id: this.generateId(), createdAt: new Date(), updatedAt: null, deletedAt: null };
        this.addItem(newProfessional);
        return Promise.resolve(newProfessional);
    }

    public findByRegistration(registration: string): Promise<Professionals | null> {
        const professional = this.findByProperty('registration', registration);
        return professional ? Promise.resolve(professional) : Promise.resolve(null);
    }

    public findById(id: string): Promise<Professionals | null> {
        const professional = this.findByProperty('id', id);
        return professional ? Promise.resolve(professional) : Promise.resolve(null);
    }
}