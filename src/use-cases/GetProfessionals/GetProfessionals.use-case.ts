import { TYPES } from '@container/types';
import type { Professionals } from '@prisma/client';
import type { IProfessionalsRepository } from '@repositories/ProfessionalsRepository';
import type { IGetProfessionalsUseCase } from '@use-cases/GetProfessionals/GetProfessionals.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class GetProfessionalsUseCase implements IGetProfessionalsUseCase {
  constructor(
    @inject(TYPES.IProfessionalsRepository)
    private readonly professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(): Promise<Professionals[]> {
    return await this.professionalsRepository.findAll();
  }
}
