import type { ICreateServicesTypeRequest, IUpdateServicesTypeRequest } from '@dtos/models';
import type { ServicesType } from '@prisma/client';
import type { IServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import { injectable } from 'inversify';
import { BaseInMemoryRepository } from './BaseInMemoryRepository';

@injectable()
export class InMemoryServicesTypeRepository
  extends BaseInMemoryRepository<ServicesType>
  implements IServicesTypeRepository
{
  private get activeServicesTypes(): ServicesType[] {
    return this.items.filter((serviceType) => serviceType.deletedAt === null);
  }

  public findAll(): Promise<ServicesType[]> {
    return Promise.resolve(this.activeServicesTypes);
  }

  public create(servicesType: ICreateServicesTypeRequest): Promise<ServicesType> {
    const newServicesType = {
      ...servicesType,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
    this.addItem(newServicesType);
    return Promise.resolve(newServicesType);
  }

  public createTestServicesType(overrides: Partial<ServicesType> = {}): ServicesType {
    const defaultServicesType: ServicesType = {
      id: this.generateId(),
      serviceName: 'Test Service',
      serviceCode: 'TEST',
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      ...overrides,
    };
    this.addItem(defaultServicesType);
    return defaultServicesType;
  }

  public getByIdIncludingDeleted(id: string): ServicesType | null {
    return this.findByProperty('id', id) || null;
  }

  public async findByServiceCode(serviceCode: string): Promise<ServicesType | null> {
    const servicesType =
      this.activeServicesTypes.find((serviceType) => serviceType.serviceCode === serviceCode) || null;
    return servicesType || null;
  }

  public async softDelete(id: string): Promise<void> {
    this.updateByProperty('id', id, {
      deletedAt: new Date(),
    });
  }

  public async findById(id: string): Promise<ServicesType | null> {
    return this.activeServicesTypes.find((serviceType) => serviceType.id === id) || null;
  }

  public updateFromId(id: string, servicesType: IUpdateServicesTypeRequest): Promise<void> {
    const servicesTypeToUpdate = this.activeServicesTypes.find((serviceType) => serviceType.id === id);
    if (!servicesTypeToUpdate) {
      throw new Error('ServicesType not found');
    }
    Object.assign(servicesTypeToUpdate, servicesType);
    servicesTypeToUpdate.updatedAt = new Date();
    this.updateByProperty('id', id, servicesTypeToUpdate);
    return Promise.resolve();
  }
}
