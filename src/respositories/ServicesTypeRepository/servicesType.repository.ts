import type { ICreateServicesTypeRequest, IUpdateServicesTypeRequest } from '@dtos/models';
import prisma from '@lib/prisma';
import type { ServicesType } from '@prisma/client';
import { injectable } from 'inversify';
import type { IServicesTypeRepository } from './servicesType.repository.interface';

@injectable()
export class ServicesTypeRepository implements IServicesTypeRepository {
  public async findAll(): Promise<ServicesType[]> {
    return await prisma.servicesType.findMany({
      where: { deletedAt: null },
    });
  }

  public async create(servicesType: ICreateServicesTypeRequest): Promise<ServicesType> {
    return await prisma.servicesType.create({
      data: servicesType,
    });
  }

  public async findByServiceCode(serviceCode: string): Promise<ServicesType | null> {
    return await prisma.servicesType.findFirst({
      where: { serviceCode, deletedAt: null },
    });
  }

  public async softDelete(id: string): Promise<void> {
    await prisma.servicesType.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  public async findById(id: string): Promise<ServicesType | null> {
    return await prisma.servicesType.findUnique({
      where: { id, deletedAt: null },
    });
  }

  public async updateFromId(id: string, servicesType: IUpdateServicesTypeRequest): Promise<void> {
    await prisma.servicesType.update({
      where: { id, deletedAt: null },
      data: servicesType,
    });
  }
}
