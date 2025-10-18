import { injectable, inject } from "inversify";
import { ICreateProfessionalsUseCase } from "./CreateProfessionals.interface";
import { TYPES } from "@container/types";
import { IProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { ISession } from "@dtos/models";
import { Professionals } from "@prisma/client";
import { ICreateProfessionalsRequest } from "@dtos/models";
import { BusinessException } from "@exceptions/business.exception";

@injectable()
export class CreateProfessionalsUseCase implements ICreateProfessionalsUseCase {
    constructor(
        @inject(TYPES.IProfessionalsRepository)
        private readonly professionalsRepository: IProfessionalsRepository,
    ) {}

    public async execute(session: ISession, professional: ICreateProfessionalsRequest): Promise<Professionals> {
        const professionalsExists = await this.professionalsRepository.findByRegistration(professional.registration);
        if (professionalsExists) {
            throw new BusinessException("Professionals already exists");
        }

        professional.createdById = session.userId;

        return await this.professionalsRepository.create(professional);
    }
}