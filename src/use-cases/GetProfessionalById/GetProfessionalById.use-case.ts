import { inject, injectable } from "inversify";
import { Professionals } from "@prisma/client";
import { IGetProfessionalByIdUseCase } from "./GetProfessionalById.interface";
import { NotFoundException } from "@exceptions/notFound.exception";
import { IProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { TYPES } from "@container/types";

@injectable()
export class GetProfessionalByIdUseCase implements IGetProfessionalByIdUseCase {
  constructor(@inject(TYPES.IProfessionalsRepository) private readonly professionalsRepository: IProfessionalsRepository) {}

  async execute(id: string): Promise<Professionals> {
    const professional = await this.professionalsRepository.findById(id);
    if (!professional) {
      throw new NotFoundException("Professional not found");
    }
    return professional;
  }
}