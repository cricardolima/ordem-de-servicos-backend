import type { ICreateProfessionalsRequest, ISession, IUpdateProfessionalsRequest } from '@dtos/models';
import type { Professionals } from '@prisma/client';
import type { IProfessionalsRepository } from '@repositories/ProfessionalsRepository';
import { injectable } from 'inversify';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

@injectable()
export class InMemoryProfessionalsRepository
  extends BaseInMemoryRepository<Professionals>
  implements IProfessionalsRepository
{
  public create(professional: ICreateProfessionalsRequest): Promise<Professionals> {
    const newProfessional = {
      ...professional,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
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

  public findAll(): Promise<Professionals[]> {
    return Promise.resolve(this.getAllItems());
  }

  public update(id: string, professional: IUpdateProfessionalsRequest): Promise<void> {
    this.updateByProperty('id', id, professional);
    return Promise.resolve();
  }

  public deleteFromId(id: string, session: ISession): Promise<void> {
    this.updateByProperty('id', id, {
      deletedAt: new Date(),
      deletedById: session.userId,
    });
    return Promise.resolve();
  }
}
