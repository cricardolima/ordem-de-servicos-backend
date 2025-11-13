import { TYPES } from '@container/types';
import type { ICreateProfessionalsRequest, ISession } from '@dtos/models';
import { BusinessException } from '@exceptions/business.exception';
import type { Professionals } from '@prisma/client';
import type { IProfessionalsRepository } from '@repositories/ProfessionalsRepository';
import { inject, injectable } from 'inversify';
import type { ICreateProfessionalsUseCase } from './CreateProfessionals.interface';

@injectable()
export class CreateProfessionalsUseCase implements ICreateProfessionalsUseCase {
  constructor(
    @inject(TYPES.IProfessionalsRepository)
    private readonly professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(session: ISession, professional: ICreateProfessionalsRequest): Promise<Professionals> {
    const professionalsExists = await this.professionalsRepository.findByRegistration(professional.registration);
    if (professionalsExists) {
      throw new BusinessException('Professional already exists');
    }

    professional.createdById = session.userId;

    return await this.professionalsRepository.create(professional);
  }
}
