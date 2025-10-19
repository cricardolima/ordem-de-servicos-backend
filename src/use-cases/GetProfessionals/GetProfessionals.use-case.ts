import { injectable, inject } from "inversify";
import { IGetProfessionalsUseCase } from "@use-cases/GetProfessionals/GetProfessionals.interface";
import { TYPES } from "@container/types";
import { IProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { Professionals } from "@prisma/client";

@injectable()
export class GetProfessionalsUseCase implements IGetProfessionalsUseCase {
    constructor(@inject(TYPES.IProfessionalsRepository) private readonly professionalsRepository: IProfessionalsRepository) {}

    public async execute(): Promise<Professionals[]> {
        return await this.professionalsRepository.findAll();
    }
}